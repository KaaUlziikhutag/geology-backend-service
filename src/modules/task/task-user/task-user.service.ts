import { InjectRepository } from '@nestjs/typeorm';
import TaskUser from './task-user.entity.js';
import { Repository } from 'typeorm';
import ITaskUser from './interface/task-user.interface.js';

export class TaskUserService {
  constructor(
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
  ) {}

  async createTaskUser(payload: ITaskUser): Promise<TaskUser> {
    const newTaskUser = this.taskUserRepository.create(payload);
    return await this.taskUserRepository.save(newTaskUser);
  }
}
