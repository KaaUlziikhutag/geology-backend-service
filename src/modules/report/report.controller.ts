import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { AuthGuard } from '@nestjs/passport';
import FindOneParams from '../../utils/find-one-params';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';
import { InvoiceDto } from './dto/invoice.dto';
import { ReportService } from './report.service';
import type { Response } from 'express';
import { GetSectionDto } from './dto/get-section.dto';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('appointment/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async reportAppointment(@Param() { id }: FindOneParams) {
    try {
      return await this.reportService.reportAppointment(id);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('invoice')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async reportInvoice(
    @Req() { user }: RequestWithUser,
    @Query() invoice: InvoiceDto,
  ) {
    try {
      return await this.reportService.reportInvoice(user, invoice);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('section-product')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async reportSectionProduct(@Query() query: GetSectionDto) {
    try {
      return await this.reportService.reportSectionProduct(query);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('section-customer')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async reportSectionCustomer(@Query() query: GetSectionDto) {
    try {
      return await this.reportService.reportSectionCustomer(query);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('pdf-appointment/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async pdfAppointment(
    @Param() { id }: FindOneParams,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const pdfBuffer = await this.reportService.pdfAppointment(id);
      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${Math.floor(new Date().getTime() / 1000)}-appointment.pdf`,
      });
      return new StreamableFile(pdfBuffer);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('pdf-invoice')
  @UseGuards(JwtAuthenticationGuard)
  @UseGuards(AuthGuard('api-key'))
  async pdfInvoice(
    @Req() { user }: RequestWithUser,
    @Query() invoice: InvoiceDto,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.reportService.pdfInvoice(user, invoice);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${Math.floor(new Date().getTime() / 1000)}-invoice.pdf`,
      });
      return new StreamableFile(pdfBuffer);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
  @Get('pdf-job-performance')
  // @UseGuards(JwtAuthenticationGuard)
  // @UseGuards(AuthGuard('api-key'))
  async pdfJobPerformance(@Res() res: Response) {
    try {
      const pdfBuffer = await this.reportService.pdfJobPerformance();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${Math.floor(new Date().getTime() / 1000)}-job-performance.pdf`,
      });
      return new StreamableFile(pdfBuffer);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }
}
