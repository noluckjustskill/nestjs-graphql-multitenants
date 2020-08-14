import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUserType } from '../users/types/auth-user.type';
import { AuthService } from './auth.service';
import { SignInInput } from './inputs/sign-in.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(returns => AuthUserType)
  async login(@Args({ name: 'credentials', type: () => SignInInput }) credentials: SignInInput): Promise<AuthUserType> {
    return this.authService.signIn(credentials);
  }
}
