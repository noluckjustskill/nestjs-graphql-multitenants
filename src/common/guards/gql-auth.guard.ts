import { Injectable, Optional } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(@Optional() protected readonly options: AuthModuleOptions, private readonly reflector: Reflector) {
    super(options);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isTokenValid;
    try {
      isTokenValid = await super.canActivate(context);
    } catch (error) {
      isTokenValid = false;
    }

    // Any validation with reflector

    return isTokenValid;
  }
}
