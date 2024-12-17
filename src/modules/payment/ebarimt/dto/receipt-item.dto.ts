import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
/** Борлуулсан бүтээгдэхүүн, үйлчилгээний жагсаалт */
export class ReceiptItemDto {
  @IsOptional()
  @IsString()
  name: string; // Бүтээгдэхүүн, үйлчилгээний нэр

  @IsOptional()
  @IsString()
  barCode?: string; // Бүтээгдэхүүний зураасан код

  @IsOptional()
  @IsString()
  @IsIn(['UNDEFINED', 'GS1', 'ISBN'])
  barCodeType: 'UNDEFINED' | 'GS1' | 'ISBN'; // Зураасан кодын төрөл UNDEFINED GS1 ISBN

  @IsOptional()
  @IsNumberString()
  @Length(7)
  classificationCode: string; // Бүтээгдэхүүн, үйлчилгээний ангиллын код

  @IsOptional()
  @IsString()
  @Length(3)
  taxProductCode: string; // taxType талбарын утга нь VAT_FREE, VAT_ZERO үед татварын харгалзах 3 оронтой тоон кодыг оруулана.

  @IsOptional()
  @IsString()
  measureUnit: string; // Хэмжих нэгж

  @IsOptional()
  @IsNumber()
  qty: number; // Борлуулсан тоо, хэмжээ

  @IsOptional()
  @IsNumber()
  unitPrice: number; // Нэгж үнэ Бүх төрлийн татвар шингэсэн дүн

  @IsOptional()
  @IsNumber()
  totalVAT: number; // Бүтээгдэхүүн, үйлчилгээний НӨАТ-н нийт дүн

  @IsOptional()
  @IsNumber()
  totalCityTax: number; // Бүтээгдэхүүн, үйлчилгээний НХАТ-н нийт дүн

  @IsOptional()
  @IsNumber()
  totalAmount: number; // Бүтээгдэхүүн, үйлчилгээний гүйлгээний нийт дүн Бүх төрлийн татвар шингэсэн дүн
}
