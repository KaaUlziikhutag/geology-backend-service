import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Province from './province.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import District from './district.entity';
import GetReferenceDto from '../dto/get-reference.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  async getAllProvince(query: GetReferenceDto): Promise<Province[]> {
    let where: FindManyOptions<Province>['where'] = {};
    if (query.search) {
      where = [
        { code: ILike(`%${query.search}%`) },
        { name: ILike('%' + query.search + '%') },
      ];
    }
    return this.provinceRepository.find({ where });
  }

  async getDistrictByProvinceId(provinceId: number): Promise<District[]> {
    return this.districtRepository.findBy({ provinceId });
  }
}
