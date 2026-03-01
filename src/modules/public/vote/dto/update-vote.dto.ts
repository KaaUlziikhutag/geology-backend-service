import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePublicVoteDto } from './create-vote.dto';

export class UpdatePublicVoteDto extends PartialType(CreatePublicVoteDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
