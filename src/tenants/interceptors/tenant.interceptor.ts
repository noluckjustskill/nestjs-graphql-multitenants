import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope, Inject, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IConnection } from '../interfaces/connection.interface';
import { TENANT_CONNECTION } from '../tenants.module';
import { Reflector } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class TenantInterceptor implements NestInterceptor {
  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly connection: IConnection,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // @ts-ignore
    const user = context.args[2]?.req.user;

    if (user && user.tenantId !== this.connection.name) {
      throw new ForbiddenException()
    }

    // Validate user with using reflector

    // Update user (for @CurrentUser as example) with using connection

    return next.handle();
  }
}