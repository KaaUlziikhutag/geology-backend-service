import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { EntityManager } from 'typeorm';
import Files from './file.entity';
import FileNotFoundException from './exception/file-not-found.exception';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../../cloud/user/dto/get-user.dto';

@Injectable()
export class FileService {
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
  async getFileByMailId(mailId: number, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const items = await entityManager.find(Files, {
      where: { mailId },
    });
    if (items) {
      return items;
    }
    throw new FileNotFoundException();
  }

  /**
   *
   * @param File createFile
   *
   */
  async createFile(file: CreateFileDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newFile = entityManager.create(Files, file);
    await entityManager.save(newFile);
    return newFile;
  }
}
