import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    return this.mailerService.sendMail(options);
  }

  sendUserEmail(to: string, payload: { otp: string }) {
    const data = this.mailerService.sendMail({
      to,
      subject: 'Танд баталгаажуулах код илгээгдлээ.',
      template: './auth',
      context: payload,
    });
    return data;
  }

  async sendUserForgotPassword(to: string, payload: { password: string }) {
    try {
      const data = await this.mailerService.sendMail({
        to,
        subject: 'Нууц үг сэргээх хүсэлт.',
        template: './forgot',
        context: payload,
      });
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Rethrow the error to propagate it further if needed
    }
  }

  async sendUserEmailPassword(
    to: string,
    payload: { password: string; email: string },
  ) {
    try {
      const data = await this.mailerService.sendMail({
        to,
        subject: 'Таны нэвтрэх мэдээлэл.',
        template: './login',
        context: payload,
      });
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Rethrow the error to propagate it further if needed
    }
  }
}
