import { Request } from 'express';
import Users from '../../users/users.entity.js';

interface RequestWithUser extends Request {
  user: Users;
}

export default RequestWithUser;
