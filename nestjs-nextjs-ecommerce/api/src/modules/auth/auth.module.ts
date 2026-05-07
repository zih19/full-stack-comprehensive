import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Module({
  imports: [
    PassportModule.register( { defaultStrategy: 'jwt' } ), // protect the route
    
    // register the JWT system asynchronously so that you can safely read values from the environment variable at the setup
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // create 'JWT_SECRET' in .env file and set it to a random string, and read it here
        // use the command to generate a long secured signature: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
        // copy and paste the generated string into the .env file as the value of JWT_SECRET
        secret: configService.get<string>('JWT_SECRET') ?? 'defaultsecret2025' , // the key used to sign and verify the token
        signOptions: { 
          expiresIn: Number(configService.get<number>('JWT_EXPIRES_IN', 900)) 
        }, // the expiration time of the token, set how long the token is valid 
      })
    }) // generate the token
   
    
  ],
  providers: [
    AuthService, 
    JWTStrategy, // add JWTStrategy to the providers array to make it available for dependency injection in the application
    RefreshTokenStrategy, // add RefreshTokenStrategy to the providers array to make it available for dependency injection in the application
  ],
  controllers: [AuthController],
})
export class AuthModule {}
