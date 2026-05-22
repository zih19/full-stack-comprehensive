import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/categories/category.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  // Purpose: You do not need to import it again in every module
  imports: [
    ConfigModule.forRoot({
      // initialize and configure the module once the application starts
      isGlobal: true, // make the config module available across the enture application
      envFilePath: '.env', // specify the path to read all secret keys from the .env file
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // time to live for each request in seconds
        limit: 10, // maximum number of requests allowed within the ttl
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
