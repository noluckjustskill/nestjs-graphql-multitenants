import { BadRequestException, ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from '../common/interfaces/token-payload.interface';
import { TenantService } from '../tenants/decorators/tenants-service.decorator';
import { TENANT_CONNECTION } from '../tenants/tenants.module';
import { IToken } from '../users/interfaces/token-interface';
import { ITokenOptions } from '../users/interfaces/token-options.interface';
import { AuthUserType } from '../users/types/auth-user.type';
import { UserType } from '../users/types/user.type';
import { SignInInput } from './inputs/sign-in.input';
import { IConnection } from '../tenants/interfaces/connection.interface';

@TenantService()
export class AuthService {
  private tokenOptions: ITokenOptions;
  private refreshTokenOptions: ITokenOptions;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TENANT_CONNECTION)
    private readonly connection: IConnection,
  ) {
    this.tokenOptions = {
      algorithm: 'HS512',
      expiresIn: Number(this.configService.get<string>('JWT_EXPIRES_IN')),
    };

    this.refreshTokenOptions = {
      algorithm: 'HS512',
      expiresIn: Number(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
    };
  }

  async signIn(credentials: SignInInput): Promise<AuthUserType> {
    const usersRepository = this.connection.repositories['users'];
    const user = usersRepository.find(u => u.email === credentials.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      lastLogin: user.lastLogin,
      token: token.token,
      tokenExpires: token.expires,
      refreshToken: refreshToken.token,
    };
  }

  generateAccessToken(user: UserType): IToken {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Secret not set');
    }

    const expires = new Date(Date.now() + Number(this.tokenOptions.expiresIn) * 1000);
    const token = jwt.sign(
      {
        ...({ id: user.id, tenantId: this.connection.name } as ITokenPayload),
        aud: this.configService.get<string>('JWT_AUDIENCE') || 'http://hr.bkz',
        iss: this.configService.get<string>('JWT_ISSUER') || 'http://hr.bkz',
      },
      secret,
      this.tokenOptions,
    );

    return { token, expires };
  }

  async generateRefreshToken(user: UserType): Promise<IToken> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('Refresh secret not set');
    }

    const token = jwt.sign({ id: user.id }, secret, this.refreshTokenOptions);
    const expires = new Date(Date.now() + Number(this.refreshTokenOptions.expiresIn) * 1000);
    const tokenData = {
      user,
      token,
      issued: new Date(),
      expires,
    };

    return { token, expires };
  }
}
