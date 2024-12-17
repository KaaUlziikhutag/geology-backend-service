import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  HttpStatus,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service.js';
import RegisterDto from './dto/register.dto.js';
import RequestWithUser from './interface/request-with-user.interface.js';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard.js';
import { UsersService } from '../users/users.service.js';
import JwtRefreshGuard from './guard/jwt-refresh.guard.js';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import LogInDto from './dto/log-in.dto.js';
import ChangePassworDto from './dto/change-password.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthenticationGuard } from './guard/local-authentication.guard.js';
import FindOneParams from '../../utils/find-one-params.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';

@Controller('authentication')
@ApiTags('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @UseGuards(AuthGuard('api-key'))
  async register(@Body() registrationData: RegisterDto): Promise<IResponse> {
    try {
      const data = await this.authenticationService.register(registrationData);
      return new ResponseSuccess('USER_REGISTER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @UseGuards(AuthGuard('api-key'))
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithUser): Promise<IResponse> {
    try {
      const { user } = request;
      const accessToken = this.authenticationService.getJwtAccessToken(user.id);
      const refreshToken = this.authenticationService.getJwtRefreshToken(
        user.id,
      );
      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
      const data = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return new ResponseSuccess('LOGIN.SUCCESS', data);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async logOut(@Req() request: RequestWithUser): Promise<IResponse> {
    try {
      await this.usersService.removeRefreshToken(request.user.id);
      request.res.setHeader(
        'Set-Cookie',
        this.authenticationService.getCookiesForLogOut(),
      );
      return new ResponseSuccess('LOGOUT.SUCCESS', '');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @UseGuards(AuthGuard('api-key'))
  async changePassword(
    @Body(new ValidationPipe()) changePassword: ChangePassworDto,
  ): Promise<IResponse> {
    try {
      const user =
        await this.authenticationService.getUserFromAuthenticationToken(
          changePassword.token,
        );
      this.usersService.changePassword(user.id, changePassword.password);
      const accessToken = this.authenticationService.getJwtAccessToken(user.id);
      const refreshToken = this.authenticationService.getJwtRefreshToken(
        user.id,
      );
      const data = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return new ResponseSuccess('CHANGE_PASSWORD.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async authenticate(@Req() request: RequestWithUser): Promise<IResponse> {
    try {
      const { user } = request;
      const accessToken = this.authenticationService.getJwtAccessToken(user.id);
      const refreshToken = this.authenticationService.getJwtRefreshToken(
        user.id,
      );
      const data = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return new ResponseSuccess('AUTHENTICATION.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/profile/:id')
  @UseGuards(AuthGuard('api-key'))
  async getUserById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const user = await this.authenticationService.getUserById(Number(id));
      return new ResponseSuccess('GET_PROFILE.SUCCESS', user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('refresh/token')
  @UseGuards(JwtRefreshGuard)
  @UseGuards(AuthGuard('api-key'))
  async refresh(@Req() request: RequestWithUser): Promise<IResponse> {
    try {
      const accessTokenCookie = this.authenticationService.getJwtAccessToken(
        request.user.id,
      );
      const data = {
        user: request.user,
        accessToken: accessTokenCookie,
      };
      request.res.setHeader('Set-Cookie', accessTokenCookie);
      return new ResponseSuccess('REFRESH_TOKEN.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
