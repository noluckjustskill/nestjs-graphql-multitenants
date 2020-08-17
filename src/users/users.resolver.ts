import {UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { UserType } from './types/user.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { TenantInterceptor } from '../tenants/interceptors/tenant.interceptor';
import { ITokenPayload } from '../common/interfaces/token-payload.interface';

@Resolver(of => UserType)
@UseGuards(GqlAuthGuard)
@UseInterceptors(TenantInterceptor)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(returns => UserType)
  async me(@CurrentUser() user?: ITokenPayload): Promise<UserType> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.userService.get(user.id);
  }
}
