import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { DataSensitivity } from '../../logger/enums/data-sensitivity.enum';
import { CustomLogger } from '../../logger/interfaces/logger.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter, GqlExceptionFilter {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(AllExceptionsFilter.name);
  }
  catch(err: unknown, host: ArgumentsHost) {
    // TODO: change after host.getType() will distinguish HTTP and GraphQL contexts
    // https://github.com/nestjs/nest/issues/1581#issuecomment-513918814

    const graphQLContext = !(host.getArgs().length === 3);

    if (!graphQLContext) {
      // HTTP context, Not found errors or other REST?? errors
      const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          { sensitivity: DataSensitivity.LOW, err, meta: { requestType: 'REST', requestPath: request.path } },
          'Some unknown error occurred',
        );
      }

      response.status(status).json({
        statusCode: status,
        path: request.url,
      });
    } else {
      // GraphQL context
      if (err instanceof UnauthorizedException) {
        throw new AuthenticationError('Unauthenticated');
      }

      if (err instanceof ForbiddenException) {
        throw new ForbiddenError('Unauthorized');
      }
      if (err instanceof BadRequestException) {
        throw new UserInputError('Bad user input');
      }

      if (err instanceof NotFoundException) {
        throw new ApolloError('Not found');
      }

      // Log only unknown errors

      this.logger.error(
        { sensitivity: DataSensitivity.LOW, err, meta: { requestType: 'GraphQL' } },
        'Some unknown error occurred',
      );
      throw new ApolloError('Internal server error');
    }
  }
}
