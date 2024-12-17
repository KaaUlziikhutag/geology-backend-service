import { Module } from '@nestjs/common';
import { DirectionModule } from './direction/direction.module.js';
import { SectionCustomerModule } from './section-customer/section-customer.module.js';
import { ReferenceController } from './reference.controller.js';
import { LaboratoryModule } from './laboratory/laboratory.module.js';
import { MineralTypeModule } from './mineral-type/mineral-type.module.js';
import { AddressModule } from './address/address.module.js';
import { ClassificationModule } from './classification/classification.module.js';
import { ElementModule } from './element/element.module.js';
import { TechnologyModule } from './technology/technology.module.js';
import { DiscountModule } from './discount/discount.module.js';
import { AdditionModule } from './addition/addition.module.js';
import { SectionProductModule } from './section-product/section-product.module.js';
import { MeasurementModule } from './measurement/measurement.module.js';

@Module({
  imports: [
    DirectionModule,
    SectionCustomerModule,
    SectionProductModule,
    LaboratoryModule,
    MineralTypeModule,
    AddressModule,
    ClassificationModule,
    ElementModule,
    TechnologyModule,
    DiscountModule,
    AdditionModule,
    MeasurementModule,
  ],
  controllers: [ReferenceController],
})
export class ReferenceModule {}
