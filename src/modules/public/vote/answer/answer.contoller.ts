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
import { VoteAnswerService } from './answer.service';
import { CreateVoteAnswerDto } from './dto/create-answer.dto';
import { UpdateVoteAnswerDto } from './dto/update-answer.dto';
import { GetVoteAnswerDto } from './dto/get-answer.dto';
import FindOneParams from '@utils/find-one-params';

import { ResponseSuccess } from '../../../../utils/dto/response.dto';
import { IResponse } from '../../../../utils/interfaces/response.interface';
import JwtAuthenticationGuard from '../../../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '../../../authentication/interface/request-with-user.interface';

@Controller('public-vote-answer')
@UseInterceptors(ClassSerializerInterceptor)
export class VoteAnswerController {
  constructor(private readonly voteQuestionService: VoteAnswerService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllVoteAnswer(@Query() query: GetVoteAnswerDto): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.getAllVoteAnswer(query);
      return new ResponseSuccess('GET_VOTE_ANSWERS.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getVoteAnswerById(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.getVoteAnswerById(id);
      return new ResponseSuccess('GET_ANSWER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async createVoteAnswer(
    @Req() request: RequestWithUser,
    @Body() voteAnswer: CreateVoteAnswerDto,
  ): Promise<IResponse> {
    try {
      const { user } = request;
      const data = await this.voteQuestionService.createVoteAnswer(
        voteAnswer,
        user,
      );
      return new ResponseSuccess('CREATE_ANSWER.SUCCESS', data);
    } catch (error) {
      console.log('------------------>', error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async updateVoteAnswer(
    @Param() { id }: FindOneParams,
    @Body() voteAnswer: UpdateVoteAnswerDto,
  ): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.updateVoteAnswer(
        id,
        voteAnswer,
      );
      return new ResponseSuccess('UPDATE_ANSWER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async deleteVoteAnswer(@Param() { id }: FindOneParams): Promise<IResponse> {
    try {
      const data = await this.voteQuestionService.deleteVoteAnswer(id);
      return new ResponseSuccess('DELETE_ANSWER.SUCCESS', data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
