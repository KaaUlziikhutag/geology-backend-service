import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './interface/token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: await bcrypt.hash(registrationData.password, 10),
      });
      return createdUser;
    } catch (error) {
      // if (error?.code === PostgresErrorCode.UniqueViolation) {
      //   const user = await this.usersService.getByEmailNoIsActive(
      //     registrationData.email,
      //   );
      //   console.log(user);
      //   if (!user.isActive) {
      //     await this.otpService.sendOtp(user.id, user.username, 'Registration');
      //   }
      //   throw new BadRequestException('User with that email already exists');
      // } else if (error?.code === '23503') {
      //   throw new BadRequestException(error?.detail);
      // }
      throw new BadRequestException('Something went wrong');
    }
  }

  async getUserById(id: number) {
    return await this.usersService.getById(id);
  }

  public getJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_TOKEN_SECRET') || 'secret',
      {
        expiresIn:
          `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME').replace(',', '')}` ||
          '86400s',
      },
    );
    return accessToken;
  }

  public getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = jwt.sign(
      payload,
      this.configService.get('JWT_REFRESH_TOKEN_SECRET') || 'secret',
      {
        expiresIn:
          `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME').replace(',', '')}` ||
          '432000s',
      },
    );
    return token;
  }

  public verifyJwt(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return false;
    }
  }
  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      console.log('user ==========>', user);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      console.log('error ==========>', error);
      throw new BadRequestException('Authentication credentials provided');
    }
  }

  public async getAdminModuleAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      const accessToken = this.getJwtAccessToken(user.id);
      const refreshToken = this.getJwtRefreshToken(user.id);
      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
      const data = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return data;
    } catch (error) {
      throw new BadRequestException('Authentication credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    try {
      const payload = jwt.verify(
        token,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      );

      if (typeof payload === 'object' && 'userId' in payload) {
        if (payload.userId) {
          return this.usersService.getById(payload.userId);
        }
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('User confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
