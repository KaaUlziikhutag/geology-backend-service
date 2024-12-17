import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import GetUsers from './dto/get-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { UsersService } from './users.service.js';
import { AuthGuard } from '@nestjs/passport';
import FindOneParams from '../../utils/find-one-params.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllUsers(@Query() query: GetUsers): Promise<IResponse> {
    try {
      const data = await this.usersService.getAllUsers(query);
      return new ResponseSuccess('GET_USERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateUser(
    @Param() { id }: FindOneParams,
    @Body() user: UpdateUsersDto,
  ): Promise<IResponse> {
    try {
      const data = await this.usersService.updateUser(id, user);
      return new ResponseSuccess('UPDATE_USERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteUser(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.usersService.deleteUser(Number(id));
      return new ResponseSuccess('DELETE_USERS.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
