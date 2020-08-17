import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { Level } from 'pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { requestIdGenerator } from './logger/utils/request-id-generator.util';
import { requestSerializer } from './logger/utils/request-serializer.util';
import { TenantModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          useLevel: configService.get<string>('LOG_LEVEL') as Level,
          autoLogging: configService.get<string>('LOG_LEVEL') === 'debug',
          useLevelLabels: true,
          genReqId: requestIdGenerator,
          serializers: {
            req: requestSerializer,
          },
        },
      }),
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        context: ({ req }) => ({ req }),
        debug: configService.get('NODE_ENV') !== 'production',
        playground: configService.get('NODE_ENV') !== 'production',
        autoSchemaFile: 'schema.gql',
        path: '/api/graphql',
      }),
    }),
    // TypeOrm module with with connection to <private_schema>.<users_table>
    CommonModule,
    TenantModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
