import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import LocalFileDto from './dto/local-file.dto.js';
import LocalFile from './local-file.entity.js';
import { GetLocalFileDto } from './dto/get-local-file.dto.js';
import * as fs from 'fs';

@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.localFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async getAllFile(query: GetLocalFileDto): Promise<LocalFile[]> {
    const where: FindManyOptions<LocalFile>['where'] = {};
    if (query.ids) {
      where.id = In(query.ids);
    }
    return await this.localFilesRepository.find({ where });
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.localFilesRepository.findOne({
      where: { id },
    });
    try {
      fs.unlinkSync(file.path);
      console.log(`File deleted: ${file.path}`);
    } catch (error) {
      console.error(`Error deleting file: ${file.path}`, error);
    }
    const deleteResponse = await this.localFilesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`File is not found ${id}`);
    }
  }
}

export default LocalFilesService;
