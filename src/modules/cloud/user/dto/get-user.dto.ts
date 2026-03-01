import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';
import { PartialType } from '@nestjs/mapped-types';

export class GetUserDto extends PartialType(PageOptionsDto) {
  id: number;
  workerId: number;
  companyId: number;
  email: string;
  firstName: string;
  lastName: string;
  profileId?: number;
  isEmailConfirmed: boolean;
  dataBase: string;
  company?: any;
}

export default GetUserDto;
