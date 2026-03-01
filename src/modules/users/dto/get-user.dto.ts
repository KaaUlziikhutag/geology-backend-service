import { Role } from '../../../utils/enum-utils';

export class GetUserDto {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  address: string;
}

export default GetUserDto;
