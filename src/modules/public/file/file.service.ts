import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicFileDto } from './dto/create-file.dto';
import { UpdatePublicFileDto } from './dto/update-file.dto';
import { GetPublicFileDto } from './dto/get-file.dto';
import {
  EntityManager,
  Equal,
  FindManyOptions,
  IsNull,
  Raw,
  Repository,
} from 'typeorm';
import PublicFiles from './file.entity';
import PublicFileNotFoundException from './exceptions/file-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import LocalFile from '../../local-files/local-file.entity';
import { FileType } from '@utils/enum-utils';
import PublicViewUser from '../view-users/view-users.entity';
import IUser from '@modules/users/interface/user.interface';

@Injectable()
export class PublicFileService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(PublicFiles)
    private readonly publicFileRepository: Repository<PublicFiles>,
    @InjectRepository(PublicViewUser)
    private readonly publicViewUserRepository: Repository<PublicViewUser>,
    @InjectRepository(LocalFile)
    private readonly localFileRepository: Repository<LocalFile>,
  ) {}

  /**
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllFiles(query: GetPublicFileDto) {
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
    const [items, count] = await this.publicFileRepository.findAndCount({
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

  async getAllFilesDeletePhotos(query: GetPublicFileDto) {
    if (!query.folderId) {
      throw new BadRequestException('Folder ID is required');
    }

    const folder = await this.publicFileRepository.findOne({
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

    await this.publicFileRepository.delete(fileIdsArray);

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
          await this.publicFileRepository.update(child.id, {
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
        await this.publicFileRepository.update(folder.id, {
          fileIds: updatedFolderFileIds,
        });
      }
    }
    const result = await this.publicFileRepository.save(folder);
    return result;
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getFileById(fileId: number): Promise<PublicFiles> {
    const file = await this.publicFileRepository.findOne({
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
  async createFile(file: CreatePublicFileDto, user: IUser) {
    file.authorId = user.id;

    const newFile = this.publicFileRepository.create(file);
    await this.publicFileRepository.save(newFile);
    if (file.viewUserIds && file.viewUserIds.length > 0) {
      const fileViewUsers = file.viewUserIds.map((id) => {
        return this.publicViewUserRepository.create({
          fileId: newFile.id,
          userId: id,
        });
      });
      await this.publicViewUserRepository.save(fileViewUsers);
    }
    return newFile;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateFile(
    id: number,
    file: UpdatePublicFileDto,
  ): Promise<PublicFiles> {
    if (file.viewUserIds && file.viewUserIds.length > 0) {
      await this.publicViewUserRepository.delete({ fileId: id });
      const fileViewUsers = file.viewUserIds.map((workerId) => {
        return this.publicViewUserRepository.create({
          fileId: id,
          userId: workerId,
        });
      });
      await this.publicViewUserRepository.save(fileViewUsers);
    }
    await this.publicFileRepository.update(id, file);
    const updatedFile = await this.publicFileRepository.findOne({
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
  async deleteFileById(id: number): Promise<void> {
    return this.deleteFile(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteFile(id: number): Promise<void> {
    const findDeletePhoto = await this.publicFileRepository.findOne({
      where: { id: id },
      relations: ['children'],
    });

    if (!findDeletePhoto) {
      throw new NotFoundException(`PublicFile with id ${id} not found`);
    }

    if (findDeletePhoto.fileIds && findDeletePhoto.fileIds.length > 0) {
      for (const fileDto of findDeletePhoto.fileIds) {
        await this.localFileRepository.delete(fileDto.id);
      }
    }
    if (findDeletePhoto.children && findDeletePhoto.children.length > 0) {
      for (const child of findDeletePhoto.children) {
        if (child.fileIds && child.fileIds.length > 0) {
          for (const fileDto of child.fileIds) {
            await this.localFileRepository.delete(fileDto.id);
          }
        }
        await this.publicFileRepository.softDelete(child.id);
      }
    }
    const deleteResponse = await this.publicFileRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new PublicFileNotFoundException(id);
    }
  }
}
