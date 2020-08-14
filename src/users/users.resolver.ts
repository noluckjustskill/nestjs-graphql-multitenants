import {UnauthorizedException, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { UserType } from './types/user.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(of => UserType)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  @Query(returns => UserType)
  async me(@CurrentUser() user?: UserType): Promise<UserType> {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
