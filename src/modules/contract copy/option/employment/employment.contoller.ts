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
import { EmploymentContractService } from './employment.service';
import { CreateEmploymentContractDto } from './dto/create-employment.dto';
import { UpdateEmploymentContractDto } from './dto/update-employment.dto';
import { GetEmploymentContractDto } from './dto/get-employment.dto';
import FindOneParams from '../../../../utils/findOneParams';
import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('employment-contract')
@UseInterceptors(ClassSerializerInterceptor)
export class EmploymentContractController {
  constructor(
    private readonly employmentContractService: EmploymentContractService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllEmploymentContract(
    @Req() request: RequestWithUser,
    @Query() query: GetEmploymentContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data =
        await this.employmentContractService.getAllEmploymentContracts(
          query,
          user,
        );
      return new ResponseSuccess('GET_EMPLOYMENT_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getEmploymentContractById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data =
        await this.employmentContractService.getEmploymentContractById(
          id,
          user,
        );
      return new ResponseSuccess('GET_EMPLOYMENT_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createAccess(
    @Req() request: RequestWithUser,
    @Body() access: CreateEmploymentContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data =
        await this.employmentContractService.createEmploymentContract(
          access,
          user,
        );
      return new ResponseSuccess('CREATE_EMPLOYMENT_CONTRACT.SUCCESS', data);
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
    @Body() EmploymentContract: UpdateEmploymentContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data =
        await this.employmentContractService.updateEmploymentContract(
          id,
          user,
          EmploymentContract,
        );
      return new ResponseSuccess('UPDATE_EMPLOYMENT_CONTRACT.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
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
      const data =
        await this.employmentContractService.deleteEmploymentContract(id, user);
      return new ResponseSuccess('DELETE_EMPLOYMENT_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
