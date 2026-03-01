import { Module } from '@nestjs/common';
import { PublicGalleryService } from './gallery.service';
import { PublicGalleryController } from './gallery.contoller';
import PublicGallery from './gallery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([PublicGallery]), ConfigModule],
  controllers: [PublicGalleryController],
  providers: [PublicGalleryService],
  exports: [PublicGalleryService],
})
export class PublicGalleryModule {}
