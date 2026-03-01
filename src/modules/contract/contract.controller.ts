import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../authentication/interface/request-with-user.interface';
import { IResponse } from '../../utils/interfaces/response.interface';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import FindOneParams from '../../utils/find-one-params';
import CreateContractDto from './dto/create-contract.dto';
import GetContractDto from './dto/get-contract.dto';
import UpdateContractDto from './dto/update-contract.dto';
import { GetValidContractDto } from './dto/get-valid-contract.dto';

@Controller('contract')
@ApiTags('contract')
@UseInterceptors(ClassSerializerInterceptor)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createContract(
    @Req() { user }: RequestWithUser,
    @Body() contract: CreateContractDto,
  ): Promise<IResponse> {
    try {
      const data = await this.contractService.createContract(user, contract);
      return new ResponseSuccess('CREATE_CONTRACT.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllContract(@Query() query: GetContractDto): Promise<IResponse> {
    try {
      const data = await this.contractService.getAllContract(query);
      return new ResponseSuccess('GET_CONTRACT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get(':id/detail')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getContractById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.contractService.getContractById(id);
      return new ResponseSuccess('GET_CONTRACT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('valid')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getValidContract(
    @Query() query: GetValidContractDto,
  ): Promise<IResponse> {
    try {
      const data = await this.contractService.getValidContract(query);
      return new ResponseSuccess('GET_CONTRACT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateContract(
    @Req() { user }: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Body() contract: UpdateContractDto,
  ): Promise<IResponse> {
    try {
      const data = await this.contractService.updateContract(
        user,
        id,
        contract,
      );
      return new ResponseSuccess('UPDATE_CONTRACT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
