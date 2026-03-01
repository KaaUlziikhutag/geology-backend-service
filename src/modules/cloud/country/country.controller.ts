import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { GetCountryDto } from './dto/get-country.dto';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import FindOneParams from '../../../utils/findOneParams';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloud/country')
@UseInterceptors(ClassSerializerInterceptor)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllCountries(@Query() query: GetCountryDto): Promise<IResponse> {
    try {
      const data = await this.countryService.getAllCountries(query);
      return new ResponseSuccess('GET_COUNTRY.SUCCESS', data);
    } catch (error) {
      console.log('=================>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getCountryById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.countryService.getCountryById(id);
      return new ResponseSuccess('GET_COUNTRY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createCountry(@Body() country: CreateCountryDto): Promise<IResponse> {
    try {
      const data = await this.countryService.createCountry(country);
      return new ResponseSuccess('CREATE_COUNTRY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateCountry(
    @Param() { id }: FindOneParams,

    @Body() country: UpdateCountryDto,
  ): Promise<IResponse> {
    try {
      const data = await this.countryService.updateCountry(id, country);
      return new ResponseSuccess('UPDATE_COUNTRY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteCountry(@Param() { id }: FindOneParams) {
    try {
      const data = await this.countryService.deleteCountry(id);
      return new ResponseSuccess('DELETE_COUNTRY.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
