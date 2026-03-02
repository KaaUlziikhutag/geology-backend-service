import { Request } from 'express';
import IUser from '@modules/cloud/user/interface/user.interface';

interface RequestWithUser extends Request {
  user: IUser;
}

export default RequestWithUser;
