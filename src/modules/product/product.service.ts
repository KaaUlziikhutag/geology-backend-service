import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './product.entity.js';
import { Equal, FindManyOptions, ILike, In, Repository } from 'typeorm';
import CreateProductDto from './dto/create-product.dto.js';
import ProductNotFoundException from './exceptions/product-not-found.exceptioin.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import PageProductDto from './dto/page-product.dto.js';
import PageMetaDto from '../../utils/dto/page-meta.dto.js';
import PageDto from '../../utils/dto/page.dto.js';
import GetProductDto from './dto/get-product.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return await newProduct.save();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (product) {
      return product;
    }
    throw new ProductNotFoundException(id);
  }

  async updateProduct(id: number, product: UpdateProductDto): Promise<Product> {
    this.productRepository.update(id, product);
    return await this.getProductById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    const deleteResponse = await this.productRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new ProductNotFoundException(id);
    }
  }

  async getAllProduct(query: PageProductDto) {
    const { page, skip, limit, order } = query;
    let where: FindManyOptions<Product>['where'] = {};
    if (query.classificationId) {
      where.classificationId = Equal(query.classificationId);
    }
    if (query.taxType) {
      where.taxType = Equal(query.taxType);
    }
    if (query.type) {
      where.type = Equal(query.type);
    }
    if (query.sectionId) {
      where.sectionId = Equal(query.sectionId);
    }
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike(`%${query.search}%`) },
      ];
    }
    const [items, itemCount] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: order },
    });
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }
  async getProducts(query: GetProductDto): Promise<Product[]> {
    const where: FindManyOptions<Product>['where'] = {};
    if (query.type) {
      where.type = Equal(query.type);
    }
    if (query.sectionId) {
      where.sectionId = Equal(query.sectionId);
    }
    if (query.ids) {
      where.id = In(query.ids);
    }
    return await this.productRepository.find({ where });
  }
}
