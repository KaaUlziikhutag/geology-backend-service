import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ModuleService } from './modules.service';
import { CreateModuleDto } from './dto/create-modules.dto';
import { UpdateModuleDto } from './dto/update-modules.dto';
import { GetModuleDto } from './dto/get-modules.dto';
import FindOneParams from '../../../utils/findOneParams';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloud/module')
@UseInterceptors(ClassSerializerInterceptor)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllModules(@Query() query: GetModuleDto): Promise<IResponse> {
    try {
      const data = await this.moduleService.getAllModules(query);
      return new ResponseSuccess('GET_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getModuleById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.moduleService.getModuleById(id);
      return new ResponseSuccess('GET_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createModule(@Body() module: CreateModuleDto): Promise<IResponse> {
    try {
      const data = await this.moduleService.createModule(module);
      return new ResponseSuccess('CREATE_MODULES.SUCCESS', data);
    } catch (error) {
      console.log('aldaa======>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateModule(
    @Param() { id }: FindOneParams,
    @Body() module: UpdateModuleDto,
  ): Promise<IResponse> {
    try {
      const data = await this.moduleService.updateModule(id, module);
      return new ResponseSuccess('UPDATE_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteModule(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.moduleService.deleteModule(id);
      return new ResponseSuccess('DELETE_MODULES.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
