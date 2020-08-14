import { Module } from '@nestjs/common';
import { TenantModule } from '../tenants/tenants.module';
import { UsersResolver } from './users.resolver';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Module({
  imports: [ TenantModule],
  providers: [
    UsersResolver,
    UsersService,
    AuthService,
  ],
})
export class UsersModule {}
