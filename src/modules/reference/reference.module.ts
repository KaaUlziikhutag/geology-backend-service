import { Module } from '@nestjs/common';
import { DirectionModule } from './direction/direction.module';
import { SectionCustomerModule } from './section-customer/section-customer.module';
import { ReferenceController } from './reference.controller';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { MineralTypeModule } from './mineral-type/mineral-type.module';
import { AddressModule } from './address/address.module';
import { ClassificationModule } from './classification/classification.module';
import { ElementModule } from './element/element.module';
import { TechnologyModule } from './technology/technology.module';
import { DiscountModule } from './discount/discount.module';
import { AdditionModule } from './addition/addition.module';
import { SectionProductModule } from './section-product/section-product.module';
import { MeasurementModule } from './measurement/measurement.module';
import { RegionsModule } from './region/regions.module';

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
    RegionsModule,
  ],
  controllers: [ReferenceController],
})
export class ReferenceModule {}
