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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { GetContractDto } from './dto/get-contract.dto';
import FindOneParams from '../../utils/findOneParams';

import { ResponseSuccess } from '../../utils/dto/response.dto';
import { IResponse } from '../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../authentication/interface/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('contract')
@ApiTags('Энгийн гэрээ')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllContract(
    @Req() request: RequestWithUser,
    @Query() query: GetContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.getAllContracts(query, user);
      return new ResponseSuccess('GET_CONTRACTS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getContractById(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.getContractById(id, user);
      return new ResponseSuccess('GET_CONTRACT.SUCCESS', data);
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
    @Body() access: CreateContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.createContract(access, user);
      return new ResponseSuccess('CREATE_CONTRACT.SUCCESS', data);
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
    @Body() contract: UpdateContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.updateContract(
        id,
        user,
        contract,
      );
      return new ResponseSuccess('UPDATE_CONTRACT.SUCCESS', data);
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
      const data = await this.contractService.deleteContract(id, user);
      return new ResponseSuccess('DELETE_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
