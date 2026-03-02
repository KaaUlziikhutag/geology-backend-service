import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';
import { ReportService } from '../report/report.service';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export default class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly reportService: ReportService,
  ) {}

  async sendMail(user: IUser, mail: SendMailDto) {
    const payload = {
      to: mail.to,
      subject: '',
      template: './info',
      attachments: [],
    };
    if (mail.type == 'appointment') {
      payload.subject = 'Эрхэм үйлчлүүлэгч тань руу захиалгын хуудас илгээлээ.';
      const buffer = await this.reportService.pdfAppointment(
        mail.appointmentId,
      );
      payload.attachments.push({
        fliename: 'Order-page.pdf',
        contentType: 'application/pdf',
        content: buffer,
      });
    } else if (mail.type == 'invoice') {
      if (mail.orderIds.length === 0) {
        throw new Error('Үйлчилгээ сонгож өгнө үү.');
      }
      payload.subject = 'Эрхэм үйлчлүүлэгч тань руу захиалгын хуудас илгээлээ.';
      const buffer = await this.reportService.pdfInvoice(user, {
        appointmentId: mail.appointmentId,
        orderIds: mail.orderIds,
      });
      payload.attachments.push({
        fliename: 'Invoice-page.pdf',
        contentType: 'application/pdf',
        content: buffer,
      });
    }
    return this.mailerService.sendMail(payload);
  }

  // async sendUserEmailPassword(
  //   to: string,
  //   payload: { password: string; email: string },
  // ) {
  //   try {
  //     const data = await this.mailerService.sendMail({
  //       to,
  //       subject: 'Таны нэвтрэх мэдээлэл.',
  //       template: './login',
  //       context: payload,
  //       attachments: [new Blob()],
  //     });
  //     return data;
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     throw error; // Rethrow the error to propagate it further if needed
  //   }
  // }
}
