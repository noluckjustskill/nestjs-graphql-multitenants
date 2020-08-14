import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../../common/interfaces/token-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly moduleRef: ModuleRef, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      algorithms: ['HS512'],
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenPayload) {
    const contextId = ContextIdFactory.getByRequest(request);
    const userService = await this.moduleRef.resolve(UsersService, contextId);

    if (payload.tenantId !== userService.connection.name) {
      throw new ForbiddenException();
    }

    const user = await userService.get(payload.id) || null;

    return user;
  }
}
