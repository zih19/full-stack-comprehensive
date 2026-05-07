import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // Why PasssportStrategy(Strategy, 'jwt-refresh')?
  // Answer: distinguish this strategy from the normal access token JWT strategy
  // Access Token and Refresh token have different rules.
  //   -> Access token: short-lived that is used on normal API routes
  //   -> Refresh token: long-lived that is used to only get new tokens

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // tells the passport to extract the refresh token from the authorization bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // tells the passort how to get JWT from the incoming request
      ignoreExpiration: false, // reject expired tokens
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'), // node -e "console.log(require('crypto').randomBytes(124).toString('hex'))"
      passReqToCallback: true, // The full HTTP request is passed to the validate method
    });
  }

  // validate refresh token
  // job: guarantee that the refresh token is still valid according to your database
  async validate(req: Request, payload: { sub: string; userEmail: string }) {
    console.log('RefreshTokenStrategy.validate called');
    console.log('Payload', { sub: payload.sub, email: payload.userEmail });

    // extract the authorization header from the incoming request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // The request will be immediately rejected because the refresh token is not sent
      console.log('No authorization header was found in the request!');
      throw new UnauthorizedException('The refresh token is not provided');
    }

    // extract the refresh token string from the authorized header, which removes the 'Bearer' prefix and isolates the raw refresh token
    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException(
        'The refresh token is empty after extraction',
      );
    }

    // fetch the user from Prisma
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    // compare the provided token with the stored hash using bcrypt.compare() function to see if both of them match
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    // return the validated user object
    return { id: user.id, email: user.email, role: user.role };
  }
}
