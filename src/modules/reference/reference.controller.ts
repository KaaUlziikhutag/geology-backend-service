import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard.js';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from '../../utils/interfaces/response.interface.js';
import { ResponseSuccess } from '../../utils/dto/response.dto.js';
import GetReferenceDto from './dto/get-reference.dto.js';
import FindOneParams from '../../utils/find-one-params.js';

import { SectionCustomerService } from './section-customer/section-customer.service.js';
import { DirectionService } from './direction/direction.service.js';
import { LaboratoryService } from './laboratory/laboratory.service.js';
import { MineralTypeService } from './mineral-type/mineral-type.service.js';
import { AddressService } from './address/address.service.js';
import { ClassificationService } from './classification/classification.service.js';
import { ElementService } from './element/element.service.js';
import { TechnologyService } from './technology/technology.service.js';
import { DiscountService } from './discount/discount.service.js';
import { AdditionService } from './addition/addition.service.js';
import GetDiscountDto from './discount/dto/get-discount.dto.js';
import { SectionProductService } from './section-product/section-product.service.js';
import { MeasurementService } from './measurement/measurement.service.js';

@Controller('reference')
@ApiTags('reference')
export class ReferenceController {
  constructor(
    private readonly directionService: DirectionService,
    private readonly laboratoryService: LaboratoryService,
    private readonly mineralTypeService: MineralTypeService,
    private readonly addressService: AddressService,
    private readonly classficationService: ClassificationService,
    private readonly elementService: ElementService,
    private readonly technologyService: TechnologyService,
    private readonly discountService: DiscountService,
    private readonly additionService: AdditionService,
    private readonly sectionCustomerService: SectionCustomerService,
    private readonly sectionProductService: SectionProductService,
    private readonly measurementService: MeasurementService,
  ) {}

  @Get('section-customer')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSection(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.sectionCustomerService.getAllSection(query);
      return new ResponseSuccess('GET_SECTION', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get('direction')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDirection(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.directionService.getAllDirection(query);
      return new ResponseSuccess('GET_DIRECTION', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get('laboratory')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllLaboratory(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.laboratoryService.getAllLaboratory(query);
      return new ResponseSuccess('GET_LABORATORY', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  @Get('mineral-type')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMineralType(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.mineralTypeService.getAllMineralType(query);
      return new ResponseSuccess('GET_MINERAL_TYPE', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('province')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllProvince(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.addressService.getAllProvince(query);
      return new ResponseSuccess('GET_ADDRESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('district/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getDistrictByProvinceId(
    @Param() { id }: FindOneParams,
  ): Promise<IResponse> {
    try {
      const data = await this.addressService.getDistrictByProvinceId(id);
      return new ResponseSuccess('GET_ADDRESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('classification')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllClassification(
    @Query() query: GetReferenceDto,
  ): Promise<IResponse> {
    try {
      const data = await this.classficationService.getAllClassification(query);
      return new ResponseSuccess('GET_ADDRESS', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('element')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllElement(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.elementService.getAllElement(query);
      return new ResponseSuccess('GET_ELEMENT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('technology')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllTechnology(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.technologyService.getAllTechnology(query);
      return new ResponseSuccess('GET_TECHNOLOGY', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('section-product')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllSectionProduct(
    @Query() query: GetReferenceDto,
  ): Promise<IResponse> {
    try {
      const data = await this.sectionProductService.getAllSection(query);
      return new ResponseSuccess('GET_TECHNOLOGY', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('discount')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllDiscount(@Query() query: GetDiscountDto): Promise<IResponse> {
    try {
      const data = await this.discountService.getAllDiscount(query);
      return new ResponseSuccess('GET_DISCOUNT', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('addition')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllAddition(): Promise<IResponse> {
    try {
      const data = await this.additionService.getAllAddition();
      return new ResponseSuccess('GET_ADDITION', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('measurement')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async getAllMeasure(@Query() query: GetReferenceDto): Promise<IResponse> {
    try {
      const data = await this.measurementService.getAllMeasure(query);
      return new ResponseSuccess('GET_MEASURE', data);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
