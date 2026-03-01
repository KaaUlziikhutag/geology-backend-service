import Users from '../../../users/users.entity';

export default interface ITaskUser {
  taskId: number;
  userId: number;
  user: Users;
}
