import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AttributeService from './attribute.service';
import { AuthGuard } from '@nestjs/passport';
import GetAttributeDto from './dto/get-attribute.dto';
import { IResponse } from '@utils/interfaces/response.interface';
import { ResponseSuccess } from '@utils/dto/response.dto';
import CreateAttributeDto from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import PageAttributeDto from './dto/page-attribute.dto';
import FindOneParams from '@utils/find-one-params';

@ApiTags('Лавлах')
@Controller('attribute')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('api-key'))
export default class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get()
  async getAll(@Query() dto: GetAttributeDto): Promise<IResponse> {
    const data = await this.attributeService.getAll(dto);
    return new ResponseSuccess('GET_ATTRIBUTE.SUCCESS', data);
  }
  @Get('page')
  async getPage(@Query() dto: PageAttributeDto): Promise<IResponse> {
    const data = await this.attributeService.getPage(dto);
    return new ResponseSuccess('GET_ATTRIBUTE.SUCCESS', data);
  }

  @Post()
  async create(@Body() dto: CreateAttributeDto): Promise<IResponse> {
    const data = await this.attributeService.create(dto);
    return new ResponseSuccess('CREATE_ATTRIBUTE.SUCCESS', data);
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() dto: UpdateAttributeDto,
  ) {
    const data = await this.attributeService.update(id, dto);
    return new ResponseSuccess('UPDATE_ATTRIBUTE.SUCCESS', data);
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneParams) {
    const data = await this.attributeService.remove(id);
    return new ResponseSuccess('DELETE_ATTRIBUTE.SUCCESS', data);
  }
}
