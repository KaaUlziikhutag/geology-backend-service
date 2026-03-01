import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicFileDto } from './dto/create-file.dto';
import { UpdatePublicFileDto } from './dto/update-file.dto';
import { GetPublicFileDto } from './dto/get-file.dto';
import { EntityManager, Equal, FindManyOptions, IsNull, Raw } from 'typeorm';
import PublicFiles from './file.entity';
import PublicFileNotFoundException from './exceptions/file-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import LocalFile from '../../local-files/local-file.entity';
import { FileType } from '../../../utils/globalUtils';
import PublicViewUser from '../view-users/view-users.entity';

@Injectable()
export class PublicFileService {
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
  async getAllFiles(query: GetPublicFileDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<PublicFiles>['where'] = {};
    if (query.name) {
      where.name = Equal(query.name);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.share) {
      where.share = Equal(query.share);
    }
    if (query.viewUserId) {
      where.viewUsers = { userId: query.viewUserId };
    }
    if (query.state) {
      where.fileIds = Raw(
        (alias) => `${alias} @> '[{"state": "${query.state}"}]'`,
      );
    }
    if (query.isDeleted) {
      where.isDeleted = Equal(query.isDeleted);
    }
    where.mid = IsNull();
    if (query.isFavourite) {
      where.isFavourite = Equal(query.isFavourite);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await entityManager.findAndCount(PublicFiles, {
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['children', 'viewUsers.worker.humans'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getAllFilesDeletePhotos(query: GetPublicFileDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);

    if (!query.folderId) {
      throw new BadRequestException('Folder ID is required');
    }

    const folder = await entityManager.findOne(PublicFiles, {
      where: { id: query.folderId },
      relations: ['children'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${query.folderId} not found`);
    }

    if (!query.fileIds) {
      throw new BadRequestException('File IDs are required');
    }

    const fileIdsArray = query.fileIds
      .toString()
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (fileIdsArray.length === 0) {
      throw new BadRequestException(`Invalid fileIds: ${query.fileIds}`);
    }

    await entityManager.delete(LocalFile, fileIdsArray);

    // if (!deleteResult.affected) {
    //   throw new NotFoundException(`Files with IDs ${fileIdsArray} not found`);
    // }
    if (query.type == FileType.Folder) {
      for (const child of folder.children) {
        if (Array.isArray(child.fileIds)) {
          const updatedFileIds = child.fileIds.filter(
            (fileIdObject) => !fileIdsArray.includes(fileIdObject.id),
          );
          child.fileIds = updatedFileIds;
          await entityManager.update(PublicFiles, child.id, {
            fileIds: updatedFileIds,
          });
        }
      }
    } else if (query.type == FileType.File) {
      if (Array.isArray(folder.fileIds)) {
        const updatedFolderFileIds = folder.fileIds.filter(
          (fileIdObject) => !fileIdsArray.includes(fileIdObject.id),
        );
        folder.fileIds = updatedFolderFileIds;
        await entityManager.update(PublicFiles, folder.id, {
          fileIds: updatedFolderFileIds,
        });
      }
    }
    const result = await entityManager.save(folder);
    return result;
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getFileById(fileId: number, user: GetUserDto): Promise<PublicFiles> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const file = await entityManager.findOne(PublicFiles, {
      where: { id: fileId },
      relations: ['children'],
    });
    if (file) {
      return file;
    }
    throw new PublicFileNotFoundException(fileId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createFile(file: CreatePublicFileDto, user: GetUserDto) {
    file.authorId = user.workerId;
    file.author = {
      lastName: `${user.lastName}`,
      firstName: `${user.firstName}`,
    };
    const entityManager = await this.loadEntityManager(user.dataBase);
    const newFile = entityManager.create(PublicFiles, file);
    await entityManager.save(newFile);
    if (file.viewUserIds && file.viewUserIds.length > 0) {
      const fileViewUsers = file.viewUserIds.map((id) => {
        return entityManager.create(PublicViewUser, {
          fileId: newFile.id,
          userId: id,
        });
      });
      await entityManager.save(PublicViewUser, fileViewUsers);
    }
    return newFile;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateFile(
    id: number,
    user: GetUserDto,
    file: UpdatePublicFileDto,
  ): Promise<PublicFiles> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (file.viewUserIds && file.viewUserIds.length > 0) {
      await entityManager.delete(PublicViewUser, { fileId: id });
      const fileViewUsers = file.viewUserIds.map((workerId) => {
        return entityManager.create(PublicViewUser, {
          fileId: id,
          userId: workerId,
        });
      });
      await entityManager.save(PublicViewUser, fileViewUsers);
    }
    await entityManager.update(PublicFiles, id, file);
    const updatedFile = await entityManager.findOne(PublicFiles, {
      where: { id: id },
    });
    if (updatedFile) {
      return updatedFile;
    }
    throw new PublicFileNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteFileById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteFile(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteFile(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const findDeletePhoto = await entityManager.findOne(PublicFiles, {
      where: { id: id },
      relations: ['children'],
    });

    if (!findDeletePhoto) {
      throw new NotFoundException(`PublicFile with id ${id} not found`);
    }

    if (findDeletePhoto.fileIds && findDeletePhoto.fileIds.length > 0) {
      for (const fileDto of findDeletePhoto.fileIds) {
        await entityManager.delete(LocalFile, fileDto.id);
      }
    }
    if (findDeletePhoto.children && findDeletePhoto.children.length > 0) {
      for (const child of findDeletePhoto.children) {
        if (child.fileIds && child.fileIds.length > 0) {
          for (const fileDto of child.fileIds) {
            await entityManager.delete(LocalFile, fileDto.id);
          }
        }
        await entityManager.softDelete(PublicFiles, child.id);
      }
    }
    const deleteResponse = await entityManager.softDelete(PublicFiles, id);
    if (!deleteResponse.affected) {
      throw new PublicFileNotFoundException(id);
    }
  }
}
