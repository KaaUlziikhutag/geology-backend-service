import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './product.entity';
import { Equal, FindManyOptions, ILike, In, Repository } from 'typeorm';
import GetProductDto from './dto/get-product.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import PageDto from '@utils/dto/page.dto';
import { CreateProductDto } from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { ProductType } from '@utils/enum-utils';
import ProductVariant from './variant/variant.entity';

@Injectable()
export default class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async getAll(query: GetProductDto): Promise<PageDto<Product>> {
    let where: FindManyOptions<Product>['where'] = {};
    const order: FindManyOptions<Product>['order'] = {};
    const { page, skip, limit } = query;
    // Base conditions
    if (query.categoryId) {
      // const childrenIds = await this.categoryService.getAllDescendantIds(query.categoryId);
      where.categories = {
        id: Equal(query.categoryId),
      };
    }
    if (query.attributeValueIds) {
      where.variants = {
        attributeValues: {
          attributeId: In(query.attributeValueIds.split(',')),
        },
      };
    }
    if (query.isFeature) {
      where.isFeature = Equal(query.isFeature);
    }
    // Improved search - combines with other conditions
    if (query.search) {
      where = [
        { ...where, name: ILike(`%${query.search}%`) },
        { ...where, description: ILike(`%${query.search}%`) },
      ];
    }

    // sorters
    if (query.sortParam) {
      order[query.sortParam] = query.order;
    }
    const [items, itemCount] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: [
        'categories',
        'brand',
        'mall',
        'variants.attributeValues.attribute',
        'images',
      ],
      order, // Added default sorting
    });

    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getById(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: [
        'categories',
        'brand',
        'mall',
        'variants.attributeValues.attribute',
        'images',
      ],
    });
  }

  async findById(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    if (dto.type == ProductType.variable) {
      const newProduct = this.productRepository.create({
        ...dto,
        // price: dto.variants[0].price,
        // discountPrice: dto.variants[0].discountPrice,
      });
      return await this.productRepository.save(newProduct);
    } else {
      const newProduct = this.productRepository.create({
        ...dto,
        variants: [
          this.variantRepository.create({
            name: dto.name,
            sku: dto.sku,
            attributeValues: dto.attributeValues,
          }),
        ],
      });
      return await this.productRepository.save(newProduct);
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['variants', 'variants.attributeValues'],
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(existingProduct, dto);
    if (dto.type == ProductType.variable) {
      // existingProduct.price = dto.variants[0].price;
      // existingProduct.discountPrice = dto.variants[0].discountPrice;
    } else {
      existingProduct.variants = [
        this.variantRepository.create({
          // imageId: dto.thumbnailId,
          name: dto.name,
          sku: dto.sku,
          attributeValues: dto.attributeValues,
        }),
      ];
    }
    return this.productRepository.save(existingProduct);
  }

  async remove(id: number) {
    const product = await this.getById(id);
    return this.productRepository.remove(product);
  }
}
