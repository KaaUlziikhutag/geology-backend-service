import { AdminJSOptions } from 'adminjs';
import CustomerResource from './customer/customer.resource.js';
import UserResource from './company/user.resource.js';
import FileResource from './reference/local-file.resource.js';
import DirectionResource from './customer/direction.resource.js';
import SectionCustomerResource from './customer/section.resource.js';
import WarehouseResource from './customer/warehouse.resource.js';
import LaboratoryResource from './product/laboratory.resource.js';
import MineralTypeResource from './product/mineral-type.resource.js';
import MineralResource from './customer/mineral.resource.js';
import AppointmentResource from './customer/appointment.resource.js';
import CompanyResource from './company/company.resource.js';
import ProvinceResource from './reference/province.resource.js';
import DistrictResource from './reference/district.resource.js';
import PaymentResource from './payment/payment.resource.js';
import PaymentDtlResource from './payment/payment-dtl.resource.js';
import ClassificationResource from './reference/classification.resource.js';
import PriceResource from './product/price.resource.js';
import ElementResource from './product/element.resource.js';
import TechnologyResource from './product/technology.resource.js';
import ProductResource from './product/product.resource.js';
import OrderResource from './customer/order.resource.js';
import ContractResource from './company/contract.resource.js';
import DiscountResource from './company/discount.resource.js';
import AdditionResource from './company/addition.resource.js';
import SectionProductResource from './product/section-product.resource.js';
import DecisionResource from './company/decision.resource.js';
import MeasurementResource from './product/measure.resource.js';
import IndicatorResource from './product/indicator.resource.js';

const resources: AdminJSOptions['resources'] = [
  // company
  CompanyResource,
  UserResource,
  DecisionResource,
  ContractResource,
  DiscountResource,
  AdditionResource,
  // reference
  ProvinceResource,
  DistrictResource,
  ClassificationResource,
  FileResource,
  // product
  LaboratoryResource,
  ElementResource,
  MineralTypeResource,
  SectionProductResource,
  ProductResource,
  TechnologyResource,
  PriceResource,
  MeasurementResource,
  IndicatorResource,
  // customer
  SectionCustomerResource,
  DirectionResource,
  CustomerResource,
  WarehouseResource,
  AppointmentResource,
  MineralResource,
  OrderResource,
  // payment
  PaymentResource,
  PaymentDtlResource,
];
export default resources;
