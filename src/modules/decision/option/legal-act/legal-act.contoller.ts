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
  Req,
} from '@nestjs/common';
import { DecisionLegalActService } from './legal-act.service';
import { CreateLegalActDto } from './dto/create-legal-act.dto';
import { UpdateLegalActDto } from './dto/update-legal-act.dto';
import { GetLegalActDto } from './dto/get-legal-act.dto';
import FindOneParams from '@utils/find-one-params';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('decision-legal-act')
@UseInterceptors(ClassSerializerInterceptor)
export class DecisionLegalActController {
  constructor(private readonly legalActService: DecisionLegalActService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllLegalAct(
    @Req() request: RequestWithUser,
    @Query() query: GetLegalActDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.legalActService.getAllLegalActs(query, user);
      return new ResponseSuccess('GET_LegalActS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getLegalActById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.legalActService.getLegalActById(id, user);
      return new ResponseSuccess('GET_LegalAct.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createLegalAct(
    @Req() request: RequestWithUser,
    @Body() legalAct: CreateLegalActDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.legalActService.createLegalAct(legalAct, user);
      return new ResponseSuccess('CREATE_LegalAct.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateAccess(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
    @Body() legalAct: UpdateLegalActDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.legalActService.updateLegalAct(
        id,
        user,
        legalAct,
      );
      return new ResponseSuccess('UPDATE_LegalAct.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteAccess(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.legalActService.deleteLegalAct(id, user);
      return new ResponseSuccess('DELETE_LegalAct.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
