import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  const activity = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const service = new ActivitiesService({
    activity,
  } as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists recent activity first', async () => {
    await service.findAll();
    expect(activity.findMany).toHaveBeenCalledWith({
      orderBy: { timestamp: 'desc' },
    });
  });

  it('allows clearing the optional entity link', async () => {
    await service.update('activity-id', { entityId: null });
    expect(activity.update).toHaveBeenCalledWith({
      where: { id: 'activity-id' },
      data: { type: undefined, message: undefined, entityId: null },
    });
  });

  it('returns 404 for a missing activity', async () => {
    activity.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
