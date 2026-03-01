import {
  Req,
  Controller,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  HttpStatus,
  HttpCode,
  Body,
  BadRequestException,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { HumanResourceService } from './hunam-resource.service';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import RequestWithUser from '../authentication/interface/request-with-user.interface';
import { HumanResourceDto } from './dto/human-resource.dto';
import { GetHumanResourceDto } from './dto/get-human-resource.dto';
import FindOneParams from '../../utils/findOneParams';

@Controller('human-resource')
@UseInterceptors(ClassSerializerInterceptor)
export class HumanResourceController {
  constructor(private readonly humanResourceService: HumanResourceService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  @HttpCode(HttpStatus.CREATED)
  async createHumanResource(
    @Req() request: RequestWithUser,
    @Body() humanResource: HumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.createHumanResource(
        user,
        humanResource,
      );
      return new ResponseSuccess('CREATE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      console.log('==============>error', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateHumanResource(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() humanResource: HumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.updateHumanResource(
        id,
        user,
        humanResource,
      );
      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Get('check')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHumanResourceCheck(
    @Req() request: RequestWithUser,
    @Query() query: GetHumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.getAllHumanResourceCheck(
        user,
        query,
      );
      return new ResponseSuccess('GET_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHumanResource(
    @Req() request: RequestWithUser,
    @Query() query: GetHumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.getAllHumanResource(
        user,
        query,
      );
      return new ResponseSuccess('GET_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Get('history')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllHistoryDepartment(
    @Req() request: RequestWithUser,
    @Query() query: GetHumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.getAllHistoryDepartment(
        user,
        query,
      );
      return new ResponseSuccess('GET_HUMAN_RESOURCE_HISTOTY.SUCCESS', data);
    } catch (error) {
      console.log('----------------------------->', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getHumanResourceById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.getHumanResourceById(
        id,
        user,
      );
      return new ResponseSuccess('GET_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('ids/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateTypeHumanResource(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() humanResource: HumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.humanResourceService.updateTypeHumanResource(
        idArray,
        user,
        humanResource,
      );

      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Patch('system/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateSystemHumanResource(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() humanResource: HumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.humanResourceService.updateSystemHumanResource(
        idArray,
        user,
        humanResource,
      );

      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Patch('structure/:ids')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateStructureHumanResource(
    @Param('ids') ids: string,
    @Req() request: RequestWithUser,
    @Body() humanResource: HumanResourceDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const idArray = ids.split(',').map((id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        return parsedId;
      });
      const data = await this.humanResourceService.updateStructureHumanResource(
        idArray,
        user,
        humanResource,
      );

      return new ResponseSuccess('UPDATE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message || 'Invalid Request');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteHumanResource(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.humanResourceService.deleteHumanResource(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_HUMAN_RESOURCE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
