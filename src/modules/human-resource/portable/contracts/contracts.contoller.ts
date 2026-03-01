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
import { ContractService } from './contracts.service';
import { CreateContractDto } from './dto/create-contracts.dto';
import { UpdateContractDto } from './dto/update-contracts.dto';
import { GetContractDto } from './dto/get-contracts.dto';
import FindOneParams from '../../../../utils/findOneParams';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('human-resource-contract')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllContracts(
    @Req() request: RequestWithUser,
    @Query() query: GetContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.getAllContracts(query, user);
      return new ResponseSuccess('GET_CONTRACT.SUCCESS', data);
    } catch (error) {
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
  async createContract(
    @Req() request: RequestWithUser,
    @Body() contract: CreateContractDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.contractService.createContract(contract, user);
      return new ResponseSuccess('CREATE_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateContract(
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
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteContract(
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
