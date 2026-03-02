import { Injectable } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { GetSignatureDto } from './dto/get-signature.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import Signature from './signature.entity';
import SystemMailNotFoundException from './exceptions/signature-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import SignatureNotFoundException from './exceptions/signature-not-found.exception';
import SignatureViewUser from './view-users/view-users.entity';
import { UpdateSignatureViewUserDto } from './view-users/dto/update-signature.dto';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class SignatureService {
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
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllSystemMails(query: GetSignatureDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<Signature>['where'] = {};
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const [items, count] = await entityManager.findAndCount(Signature, {
      where,
      relations: ['viewUsers'],
      order: {
        createdAt: 'DESC',
      },

      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getSignatureById(signatureId: number, user: IUser): Promise<Signature> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const signature = await entityManager.findOne(Signature, {
      where: { id: signatureId },
      relations: ['viewUsers'],
    });
    if (signature) {
      return signature;
    }
    throw new SystemMailNotFoundException(signatureId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createSignature(signature: CreateSignatureDto, user: IUser) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    signature.authorId = user.id;
    const newSignature = entityManager.create(Signature, { ...signature });
    await entityManager.save(newSignature);
    if (user.id) {
      const signatureViewUser = entityManager.create(SignatureViewUser, {
        signatureId: newSignature.id,
        userId: user.id,
        isActive: signature.isActive,
      });
      await entityManager.save(signatureViewUser);
    }
    return newSignature;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateSignature(
    id: number,
    user: IUser,
    signature: UpdateSignatureDto,
  ): Promise<Signature> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(Signature, id, signature);
    const updatedSignature = await entityManager.findOne(Signature, {
      where: { id: id },
    });
    if (updatedSignature) {
      return updatedSignature;
    }
    throw new SignatureNotFoundException(id);
  }

  async updateSignatureVewUser(
    id: number,
    user: IUser,
    signatureViewUser: UpdateSignatureViewUserDto,
  ): Promise<SignatureViewUser> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    await entityManager.update(SignatureViewUser, id, signatureViewUser);
    const updatedSignatureViewUser = await entityManager.findOne(
      SignatureViewUser,
      {
        where: { id: id },
      },
    );
    if (updatedSignatureViewUser) {
      return updatedSignatureViewUser;
    }
    throw new SignatureNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteSignatureById(id: number, user: IUser): Promise<void> {
    return this.deleteSignature(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteSignature(id: number, user: IUser): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(Signature, id);
    if (!deleteResponse.affected) {
      throw new SignatureNotFoundException(id);
    }
  }
}
