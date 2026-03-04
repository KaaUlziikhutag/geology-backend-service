import { Controller, Get, Query } from '@nestjs/common';
import { RegionsService } from './regions.service';
import FindRegionDto from './dto/find-region.dto';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionsService) {}

  @Get()
  findAll(@Query() query: FindRegionDto) {
    return this.regionService.findAll(query);
  }
}
