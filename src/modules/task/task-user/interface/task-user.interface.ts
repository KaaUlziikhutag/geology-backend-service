import Users from '../../../users/users.entity.js';

export default interface ITaskUser {
  taskId: number;
  userId: number;
  user: Users;
}
