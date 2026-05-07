import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AutoResponseDto } from './dto/auto-response.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12; // The private property for SALT_ROUNDS is set to 12 by default.
  constructor(
    private prisma: PrismaService, 
    private jwtService: JwtService, 
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<AutoResponseDto> {
    const { email, password } = loginDto;

    // find the user based on the email address and the password
    const user = await this.prisma.user.findUnique({
        where: { email },
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException("Invalid Email or Password");
    }

    // generate the new token and update its newest token to the user
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // return the new token and user details
    return {
        ...tokens,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }
    }
  }

  async register(registerDto: RegisterDto): Promise<AutoResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    // I need to find users that are unique in my database, such as user id or email.
    // search on the user database
    // If you try to search a nonunique field, it can be implemented by findFirst instead.
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    // If the matching exists, the user will already appear.
    if (existingUser) {
      throw new ConflictException('User with this email address already exists!');
    }

    try {
      // If this is the first time the user is registering, we will encrypt the password before saving it to the database using bcrypt.hash.
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

      // insert a new user record
      const newUser = await this.prisma.user.create({
        // contains the field you actually want to save
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName
        },
        select: {
            // select what specified fields you actually want to return
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            password: false, // I do not want to return the password field for security reasons
        }
      })

      // generate the access token 
      const tokens = await this.generateTokens(newUser.id, newUser.email);
    
      // refresh the access token as below
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);

      // return all tokens and the corresponding new user
      return {
        ...tokens,
        user: newUser,
      };

    } catch (error) {
      console.error('Error during user registration:', error);
      throw new InternalServerErrorException('An error occurred during registration. Please try again later!');
    }
  }

  // create a new function to generate both access token and refresh token
  // Authentication: JWT token 
  // [1] Passport.js (an authentication middleware used to verify user's identity) 
  // [2] nestjs/jwt packages (an official nestJS package that adds JWT web token to your application)
  //     -> a wrapper around JSON web token library (jsonwebtoken) 
  //     express: jsonwebtoken
  //     NestJS: nestjs/jwt (jwtModule, jwtService)
  
  // This method actually returns a pair of JWT tokens for authentication: accessToken & refreshToken
  private async generateTokens(
    userId: string, 
    userEmail: string
  ): Promise< { accessToken: string; refreshToken: string } > {
    
    // build a JWT payload containing the user's id and email
    const payload = { sub: userId, userEmail };

    // generate a random refresh id to uniquely identify the refresh token
    // make the refresh token more secure and be harder to predict
    const refreshId = randomBytes(16).toString('hex');

    // use Promise.all to sign both tokens in parallel for better performance and efficiency
    const [accessToken, refreshToken] = await Promise.all([
       
       // the access token used to authenticate the user 
       // inject service in the constructor function
       // JwtService comes from '@nestjs/jwt' package
       // install nestjs/jwt package to use JwtService
       
       // Step 1: create a new folder called strategies and create a new file called jwt.strategy.ts to implement the JWT strategy for authentication
       // Step 2: import and inject the package into auth.module.ts
       // Step 3: go to app.module and import the config module as a dependency -> app.module && auth.module
       // Step 4: continue to focus on JWT strategy to implement its own logic by typing JWTStrategy in the provider
       // Step 5: go to jwt.strategy.ts to implement and identify the overall strategy
       // Step 6: implement the signAsync method and strategy below
       // Step 7: add refresh token strategy (refresh-token.strategy.ts) and add it to the provider in auth.module.ts
       // Step 8: implement the refresh token strategy in refresh-token.strategy.ts
       // Step 9: go to auth.controller.ts to refresh access token using guard
       // Step 10: identify the logout procedure first in auth.controller.ts
       // Step 11: handle the logout's business logic in auth.service.ts
       // Step 12: set http methods for registration, refresh, and log out in Controller
       // Step 13: Create login function and endpoint in auth.controller.ts and auth.service.ts+
       // Step 14: include http status code for your controller methods

       // the authentication flow after the registration
       this.jwtService.signAsync(payload, { 
         expiresIn: '15m',
         secret: this.configService.get<string>('JWT_SECRET'),
       } ), // payload + expiration time
       this.jwtService.signAsync( 
         { ...payload, refreshId }, 
         { 
            expiresIn: '7d',
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
         } 
        ) // payload + refreshId
    ])

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    // It takes the user id and refresh the token
    await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });
  }

  // refresh access token 
  async refreshTokens(userId: string): Promise<AutoResponseDto> {
    // retrieve the user from the database
    const user = await this.prisma.user.findUnique({
        // return the user details except the password field for security reasons
        where: {id: userId},
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            refreshToken: true,
            password: false,
        }
    });

    if (!user) {
        throw new UnauthorizedException('The user is not found!');
    }

    // generate a new pair of tokens for the user
    const newTokens = await this.generateTokens(user.id, user.email);

    // save the new token into the database
    // -> automatically invalidates any previously issued refresh tokens0.000
    await this.updateRefreshToken(user.id, newTokens.refreshToken);

    // return the new tokens and user details
    return {
        ...newTokens,
        user
    }
  }

  // log out
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
        where: {id: userId},
        data: { refreshToken: null} // invalidate the refresh token by setting it to null in the database


    });
  }
}
