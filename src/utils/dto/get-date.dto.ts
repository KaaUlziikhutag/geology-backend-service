import { Transform, Type } from 'class-transformer';
import { IsDate, IsDefined } from 'class-validator';

export class GetRangeDateDto {
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  startAt: Date;

  @IsDefined()
  @Type(() => Date)
  @Transform(({ value }) => {
    const endAt = new Date(value);
    endAt.setHours(23, 59, 59, 999);
    return endAt;
  })
  @IsDate()
  endAt: Date;
}
