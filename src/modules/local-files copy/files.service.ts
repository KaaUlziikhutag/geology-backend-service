import { Injectable, NotFoundException } from '@nestjs/common';
import { getEntityManagerToken, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as fs from 'fs';
import LocalFileDto from './local-file.dto';
import LocalFile from './local-file.entity';
import GlobalFile from './global-file.entity';
import { ModuleRef } from '@nestjs/core';
import GetUserDto from '../cloud/user/dto/get-user.dto';
@Injectable()
class LocalFilesService {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(GlobalFile)
    private globalFileRepository: Repository<GlobalFile>,
  ) {}

  private async loadEntityManager(systemId: string): Promise<EntityManager> {
    return this.moduleRef.get(getEntityManagerToken(`ioffice_${systemId}`), {
      strict: false,
    });
  }

  async saveLocalFileData(user: GetUserDto, fileData: LocalFileDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newLocalFile = entityManager.create(LocalFile, fileData);
    await entityManager.save(LocalFile, newLocalFile);
    return newLocalFile;
  }

  async saveGlobalFileData(fileData: LocalFileDto) {
    const newFile = this.globalFileRepository.create(fileData);
    await this.globalFileRepository.save(newFile);
    return newFile;
  }

  async getGlobalFileById(fileId: number): Promise<GlobalFile> {
    const file = await this.globalFileRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async getFileById(user: GetUserDto, fileId: number): Promise<LocalFileDto> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const file = await entityManager.findOne(LocalFile, {
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async deleteGlobalFile(fileId: number): Promise<void> {
    const file = await this.globalFileRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException(`File is not found ${fileId}`);
    }
    try {
      fs.unlinkSync(file.path);
      console.log(`File deleted: ${file.path}`);
    } catch (error) {
      console.error(`Error deleting file: ${file.path}`, error);
    }
    await this.globalFileRepository.remove(file);
  }

  async deleteFile(user: GetUserDto, fileId: number): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const file = await entityManager.findOne(LocalFile, {
      where: { id: fileId },
    });
    try {
      fs.unlinkSync(file.path);
      console.log(`File deleted: ${file.path}`);
    } catch (error) {
      console.error(`Error deleting file: ${file.path}`, error);
    }
    const deleteResponse = await entityManager.delete(LocalFile, fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`File is not found ${fileId}`);
    }
  }
}

export default LocalFilesService;
