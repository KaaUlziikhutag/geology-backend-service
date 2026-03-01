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
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { GetProgramDto } from './dto/get-program.dto';
import FindOneParams from '../../../utils/findOneParams';
import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloud/program')
@UseInterceptors(ClassSerializerInterceptor)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllPrograms(@Query() query: GetProgramDto): Promise<IResponse> {
    try {
      const data = await this.programService.getAllPrograms(query);
      return new ResponseSuccess('GET_PROGRAM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getProgramById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.programService.getProgramById(id);
      return new ResponseSuccess('GET_PROGRAM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createProgram(@Body() program: CreateProgramDto): Promise<IResponse> {
    try {
      const data = await this.programService.createProgram(program);
      return new ResponseSuccess('CREATE_PROGRAM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateProgram(
    @Param() { id }: FindOneParams,

    @Body() program: UpdateProgramDto,
  ): Promise<IResponse> {
    try {
      const data = await this.programService.updateProgram(id, program);
      return new ResponseSuccess('UPDATE_PROGRAM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteProgram(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.programService.deleteProgram(id);
      return new ResponseSuccess('DELETE_PROGRAM.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
