// a NestJS authentication file tha tells your app how to read, verify, and trust your JWT tokens sent by the client
// job: protect your own API routes
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

// We set this class as an injectable class
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  // We use PassportStrategy to protect our own API routes
  // PassportStrategy: How Passport.js connects to a specific authentication strategy

  // create the constructor for this class
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // The constructor takes not only prisma service but also config service from nestjs/config package
    // call the super function and pass to it an object that contains JWT from the request
    super({
      // ExtractJwt: verify the token's signature
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // tells the passort how to get JWT from the incoming request
      ignoreExpiration: false, // tells the passport to reject expired tokens,
      secretOrKey: configService.get<string>('JWT_SECRET'), // provides the secret key that was used to sign the token
    });
  }

  // automatically call the validator method if the token becomes valid
  async validate( payload: {sub: string; email: string }) {
      // The payload contains encoded data from JWT token, containing the user's id and email
      const user = await this.prisma.user.findUnique({
         where: { id: payload.sub },
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            password: false, // I do not return the password field for security reasons
         }
      })

      if (!user) {
        throw new UnauthorizedException('The user is not found!');
      }

      return user; // if the user is found, return the user object to be attached to the request object for further use in the route handlers

  }

}