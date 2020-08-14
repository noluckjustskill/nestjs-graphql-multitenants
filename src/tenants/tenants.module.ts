import { InternalServerErrorException, Module, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { IDb } from './interfaces/connection.interface';

const MockConnection: IDb = {
  master: {
    name: 'master-connection',
    repositories: {
      tenants: [{ tenantId: 'foo', name: 'bar', host: 'localhost:3003' }],
    },
  },
  bar: {
    name: 'tenant-connection',
    repositories: {
      users: [{ id: 'user-123', firstName: 'first', lastName: 'last', email: 'first-last@mail.com' }],
    },
  },
};

export const TENANT_CONNECTION = Symbol('TENANT_CONNECTION');

@Module({
  providers: [
    {
      provide: TENANT_CONNECTION,
      inject: [REQUEST],
      scope: Scope.REQUEST,
      useFactory: async (request) => {
        const tenant = MockConnection.master.repositories.tenants.find(t => t.host === request?.req.headers.host);

        if (!tenant) {
          throw new InternalServerErrorException('Tenant not found');
        }

        return Promise.resolve(MockConnection[tenant.name]);
      },
    },
  ],
  exports: [TENANT_CONNECTION],
})
export class TenantModule {}
