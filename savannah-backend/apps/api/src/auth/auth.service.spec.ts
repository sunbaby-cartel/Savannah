import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService login', () => {
  const findUnique = jest.fn();
  const signAsync = jest.fn().mockResolvedValue('signed-token');
  const service = new AuthService(
    { user: { findUnique } } as unknown as PrismaService,
    { signAsync } as unknown as JwtService,
  );
  let user: Record<string, unknown>;

  beforeAll(async () => {
    user = {
      id: 'staff-1',
      email: 'staff@example.com',
      fullName: 'Staff',
      role: 'cashier',
      isActive: true,
      passwordHash: await bcrypt.hash('correct-password', 4),
    };
  });
  beforeEach(() => {
    jest.clearAllMocks();
    findUnique.mockResolvedValue(user);
  });

  it('normalizes the email and returns a token without the password hash', async () => {
    const result = await service.login({
      email: ' STAFF@example.com ',
      password: 'correct-password',
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { email: 'staff@example.com' },
    });
    expect(signAsync).toHaveBeenCalledWith({
      sub: 'staff-1',
      email: 'staff@example.com',
      role: 'cashier',
    });
    expect(result.accessToken).toBe('signed-token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects an incorrect password without issuing a token', async () => {
    await expect(
      service.login({ email: 'staff@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
    expect(signAsync).not.toHaveBeenCalled();
  });

  it.each([null, { isActive: false }])(
    'rejects missing or inactive accounts (%j)',
    async (account) => {
      findUnique.mockResolvedValue(account);
      await expect(
        service.login({
          email: 'staff@example.com',
          password: 'correct-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(signAsync).not.toHaveBeenCalled();
    },
  );
});
