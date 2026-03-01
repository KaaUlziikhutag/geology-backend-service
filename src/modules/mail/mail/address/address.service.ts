import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { EntityManager } from 'typeorm';
import Address from './address.entity';
import AddressNotFoundException from './exception/address-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class AddressService {
  /**
   * @ignore
   */
  constructor(private moduleRef: ModuleRef) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getAddressByMailId(mailId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(Address, {
      where: { mailId },
    });
    if (items) {
      return items;
    }
    throw new AddressNotFoundException();
  }

  /**
   *
   * @param Address createAddresss
   *
   */
  async createAddress(address: CreateAddressDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newAddress = entityManager.create(Address, address);
    await entityManager.save(newAddress);
    return newAddress;
  }
}
