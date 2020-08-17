import { Inject, NotFoundException } from '@nestjs/common';
import { TenantService } from '../tenants/decorators/tenants-service.decorator';
import { TENANT_CONNECTION } from '../tenants/tenants.module';
import { IConnection } from '../tenants/interfaces/connection.interface';
import { UserType } from './types/user.type';

@TenantService()
export class UsersService {
  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly connection: IConnection,
  ) {}

  async get(id: string): Promise<UserType> {
    const usersRepository = this.connection.repositories['users'];
    const user = usersRepository.find(u => u.id === id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
