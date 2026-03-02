import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ContractViewUser from './view-users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateViewUserDto from '@modules/decision/view-users/dto/create-view-user.dto';
import ViewUserNotFoundException from '@modules/decision/view-users/exception/view-user-not-found.exception';

@Injectable()
export class ViewUserService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(ContractViewUser)
    private readonly contractViewUserRepository: Repository<ContractViewUser>,
  ) {}

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getViewUsersByContractId(id: number) {
    const items = await this.contractViewUserRepository.find({
      where: { id },
    });
    if (items) {
      return items;
    }
    throw new ViewUserNotFoundException();
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getViewUsersByUserId(userId: number) {
    const items = await this.contractViewUserRepository.find({
      where: { userId },
    });
    if (items) {
      const contractIds = [];

      for await (const item of items) {
        contractIds.push(item.id);
      }
      return contractIds;
    }
    throw new ViewUserNotFoundException();
  }

  /**
   *
   * @param Contract createContract
   *
   */
  async createViewUser(viewUser: CreateViewUserDto) {
    const newViewUser = this.contractViewUserRepository.create(viewUser);
    await this.contractViewUserRepository.save(newViewUser);
    return newViewUser;
  }
}
