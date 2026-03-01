import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { InsuranceTypeService } from './insurance-type.service';
import { CreateInsuranceTypeDto } from './dto/create-insurance-type.dto';
import { UpdateInsuranceTypeDto } from './dto/update-insurance-type.dto';
import { GetInsuranceTypeDto } from './dto/get-insurance-type.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('cloud/insuranceType')
@UseInterceptors(ClassSerializerInterceptor)
export class InsuranceTypeController {
  constructor(private readonly insuranceTypeService: InsuranceTypeService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllInsuranceTypes(
    @Req() request: RequestWithUser,
    @Query() query: GetInsuranceTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.insuranceTypeService.getAllInsuranceTypes(
        query,
        user,
      );
      return new ResponseSuccess('GET_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getInsuranceTypeById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.insuranceTypeService.getInsuranceTypeById(
        id,
        user,
      );
      return new ResponseSuccess('GET_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createInsuranceType(
    @Req() request: RequestWithUser,
    @Body() insuranceType: CreateInsuranceTypeDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.insuranceTypeService.createInsuranceType(
        insuranceType,
        user,
      );
      return new ResponseSuccess('CREATE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateInsuranceType(
    @Param() { id }: FindOneParams,
    @Body() insuranceType: UpdateInsuranceTypeDto,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.insuranceTypeService.updateInsuranceType(
        id,
        insuranceType,
        user,
      );
      return new ResponseSuccess('UPDATE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteInsuranceType(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.insuranceTypeService.deleteInsuranceType(
        id,
        user,
      );
      return new ResponseSuccess('DELETE_INSURANCE_TYPE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
