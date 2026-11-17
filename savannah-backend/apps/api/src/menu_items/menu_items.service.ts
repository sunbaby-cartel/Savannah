import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: {
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        category: createMenuItemDto.category,
        price: createMenuItemDto.price,
        availableQuantity: createMenuItemDto.available_quantity,
        totalQuantity: createMenuItemDto.total_quantity,
        preparationTimeMinutes: createMenuItemDto.preparation_time_minutes,
        dietaryTags: createMenuItemDto.dietary_tags,
        imageGradient: createMenuItemDto.image_gradient,
        isAvailable: createMenuItemDto.is_available,
      },
    });
  }

  findAll() {
    return this.prisma.menuItem.findMany();
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    try {
      return await this.prisma.menuItem.update({
        where: { id },
        data: {
          name: updateMenuItemDto.name,
          description: updateMenuItemDto.description,
          category: updateMenuItemDto.category,
          price: updateMenuItemDto.price,
          availableQuantity: updateMenuItemDto.available_quantity,
          totalQuantity: updateMenuItemDto.total_quantity,
          preparationTimeMinutes: updateMenuItemDto.preparation_time_minutes,
          dietaryTags: updateMenuItemDto.dietary_tags,
          imageGradient: updateMenuItemDto.image_gradient,
          isAvailable: updateMenuItemDto.is_available,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Menu item with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.menuItem.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Menu item with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Cannot delete a menu item referenced by existing orders',
          );
        }
      }
      throw error;
    }
  }
}
