import { Injectable } from '@nestjs/common';
import { CreatePublicGalleryDto } from './dto/create-gallery.dto';
import { UpdatePublicGalleryDto } from './dto/update-gallery.dto';
import { GetPublicGalleryDto } from './dto/get-gallery.dto';
import { EntityManager, Equal, FindManyOptions } from 'typeorm';
import PublicGallery from './gallery.entity';
import PublicFileNotFoundException from './exceptions/gallery-not-found.exception';
import { PageDto } from '../../../utils/dto/page.dto';
import { PageMetaDto } from '../../../utils/dto/pageMeta.dto';
import { ModuleRef } from '@nestjs/core';
import { getEntityManagerToken } from '@nestjs/typeorm';
import GetUserDto from '../../cloud/user/dto/get-user.dto';
import PublicViewUser from '../view-users/view-users.entity';

@Injectable()
export class PublicGalleryService {
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
  async getAllGallery(query: GetPublicGalleryDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const where: FindManyOptions<PublicGallery>['where'] = {};
    if (query.exp) {
      where.exp = Equal(query.exp);
    }
    if (query.authorId) {
      where.authorId = Equal(query.authorId);
    }
    if (query.isFavourite) {
      where.isFavourite = Equal(query.isFavourite);
    }
    if (query.isDeleted) {
      where.isDeleted = Equal(query.isDeleted);
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
    const [items, count] = await entityManager.findAndCount(PublicGallery, {
      where,
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
  async getGalleryById(
    galleryId: number,
    user: GetUserDto,
  ): Promise<PublicGallery> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const gallery = await entityManager.findOne(PublicGallery, {
      where: { id: galleryId },
    });
    if (gallery) {
      return gallery;
    }
    throw new PublicFileNotFoundException(galleryId);
  }

  /**
   *
   * @param SystemMail createSystemMail
   *
   */
  async createGallery(gallery: CreatePublicGalleryDto, user: GetUserDto) {
    const entityManager = await this.loadEntityManager(user.dataBase);
    gallery.authorId = user.workerId;
    const newGallery = entityManager.create(PublicGallery, gallery);
    await entityManager.save(newGallery);
    if (gallery.viewUserIds && gallery.viewUserIds.length > 0) {
      const galleryViewUsers = gallery.viewUserIds.map((id) => {
        return entityManager.create(PublicViewUser, {
          galleryId: newGallery.id,
          userId: id,
        });
      });
      await entityManager.save(PublicViewUser, galleryViewUsers);
    }
    return newGallery;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateSystemMailDto} to see a list of required properties
   */
  async updateFile(
    id: number,
    user: GetUserDto,
    gallery: UpdatePublicGalleryDto,
  ): Promise<PublicGallery> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    if (gallery.viewUserIds && gallery.viewUserIds.length > 0) {
      await entityManager.delete(PublicViewUser, { galleryId: id });
      const galleryViewUsers = gallery.viewUserIds.map((workerId) => {
        return entityManager.create(PublicViewUser, {
          galleryId: id,
          userId: workerId,
        });
      });
      await entityManager.save(PublicViewUser, galleryViewUsers);
    }
    await entityManager.update(PublicGallery, id, gallery);
    const updatedGallery = await entityManager.findOne(PublicGallery, {
      where: { id: id },
    });
    if (updatedGallery) {
      return updatedGallery;
    }
    throw new PublicFileNotFoundException(id);
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteGalleryById(id: number, user: GetUserDto): Promise<void> {
    return this.deleteGallery(id, user);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteGallery(id: number, user: GetUserDto): Promise<void> {
    const entityManager = await this.loadEntityManager(user.dataBase);
    const deleteResponse = await entityManager.delete(PublicGallery, id);
    if (!deleteResponse.affected) {
      throw new PublicFileNotFoundException(id);
    }
  }
}
