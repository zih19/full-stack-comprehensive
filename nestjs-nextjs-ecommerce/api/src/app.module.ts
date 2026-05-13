import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  // Purpose: You do not need to import it again in every module
  imports: [
    ConfigModule.forRoot({
      // initialize and configure the module once the application starts
      isGlobal: true, // make the config module available across the enture application
      envFilePath: '.env', // specify the path to read all secret keys from the .env file
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
