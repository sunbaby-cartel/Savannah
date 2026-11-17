import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuItemsModule } from './menu_items/menu_items.module';
import { ActivitiesModule } from './activities/activities.module';
import { CustomersModule } from './customers/customers.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    MenuItemsModule,
    ActivitiesModule,
    CustomersModule,
    OrderItemsModule,
    OrdersModule,
    ReservationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
