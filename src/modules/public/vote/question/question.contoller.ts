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
import { VoteQuestionService } from './question.service';
import { CreateVoteQuestionDto } from './dto/create-question.dto';
import { UpdateVoteQuestionDto } from './dto/update-question.dto';
import { GetVoteQuestionDto } from './dto/get-question.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

@Controller('public-vote-question')
@UseInterceptors(ClassSerializerInterceptor)
export class VoteQuestionController {
  constructor(private readonly voteQuestionService: VoteQuestionService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllVoteQuestion(
    @Req() request: RequestWithUser,
    @Query() query: GetVoteQuestionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.voteQuestionService.getAllVoteQuestion(query);
      return new ResponseSuccess('GET_VOTES.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getVoteQuestionById(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.getVoteQuestionById(id);
      return new ResponseSuccess('GET_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createVoteQuestion(
    @Req() request: RequestWithUser,
    @Body() voteQuestion: CreateVoteQuestionDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.voteQuestionService.createVoteQuestion(
        voteQuestion,
        user,
      );
      return new ResponseSuccess('CREATE_VOTE.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateVoteQuestion(
    @Param() { id }: FindOneParams,
    @Body() voteQuestion: UpdateVoteQuestionDto,
  ): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.updateVoteQuestion(
        id,
        voteQuestion,
      );
      return new ResponseSuccess('UPDATE_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteVoteQuestion(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.deleteVoteQuestion(id);
      return new ResponseSuccess('DELETE_VOTE.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
