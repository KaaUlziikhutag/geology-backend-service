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
import { PublicVoteService } from './vote.service';
import { CreatePublicVoteDto } from './dto/create-vote.dto';
import { UpdatePublicVoteDto } from './dto/update-vote.dto';
import { GetPublicVoteDto } from './dto/get-vote.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../utils/dto/response.dto';
import { IResponse } from '../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('public-vote')
@UseInterceptors(ClassSerializerInterceptor)
export class PublicVoteController {
  constructor(private readonly publicVoteService: PublicVoteService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllVote(@Query() query: GetPublicVoteDto): Promise<IResponse> {
    try {
      const data = await this.publicVoteService.getAllVote(query);
      return new ResponseSuccess('GET_VOTES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getVoteById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicVoteService.getVoteById(id);
      return new ResponseSuccess('GET_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createVote(
    @Req() request: RequestWithUser,
    @Body() vote: CreatePublicVoteDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.publicVoteService.createVote(vote, user);
      return new ResponseSuccess('CREATE_VOTE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateVote(
    @Param() { id }: FindOneParams,
    @Body() vote: UpdatePublicVoteDto,
  ): Promise<IResponse> {
    try {
      const data = await this.publicVoteService.updateVote(id, vote);
      return new ResponseSuccess('UPDATE_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteVote(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.publicVoteService.deleteVote(id);
      return new ResponseSuccess('DELETE_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
