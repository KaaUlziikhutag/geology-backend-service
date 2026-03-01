import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { IResponse } from '../../utils/interfaces/response.interface';
import GetCustomerDto from './dto/get-customer.dto';
import { ResponseSuccess } from '../../utils/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import FindOneParams from '../../utils/find-one-params';
import FindOneRegno from '../../utils/find-one-regno';
import { ApiPaginatedResponse } from '../../utils/api-paginated-response.decorator';
import CreateCustomerDto from './dto/create-customer.dto';
import UpdateCustomerDto from './dto/update-customer.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../authentication/interface/request-with-user.interface';

@Controller('customer')
@ApiTags('customer')
@UseInterceptors(ClassSerializerInterceptor)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  @ApiPaginatedResponse(GetCustomerDto)
  async getAllCustomer(@Query() query: GetCustomerDto): Promise<IResponse> {
    try {
      const data = await this.customerService.getAllCustomer(query);
      return new ResponseSuccess('GET_CUSTOMER', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCustomerById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.customerService.getCustomerById(id);
      return new ResponseSuccess('GET_CUSTOMER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Get('by-regno/:regno')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCustomerByRegno(
    @Param() { regno }: FindOneRegno,
  ): Promise<IResponse> {
    try {
      const data = await this.customerService.getCustomerByRegno(regno);
      return new ResponseSuccess('GET_CUSTOMER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCustomer(
    @Req() { user }: RequestWithUser,
    @Body() customer: CreateCustomerDto,
  ): Promise<IResponse> {
    try {
      const data = await this.customerService.createCustomer(user, customer);
      return new ResponseSuccess('CREATE_CUSTOMER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateCustomer(
    @Req() { user }: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Body() customer: UpdateCustomerDto,
  ): Promise<IResponse> {
    try {
      const data = await this.customerService.updateCustomer(
        user,
        id,
        customer,
      );
      return new ResponseSuccess('UPDATE_CUSTOMER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteCustomer(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.customerService.deleteCustomer(id);
      return new ResponseSuccess('DELETE_CUSTOMER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
