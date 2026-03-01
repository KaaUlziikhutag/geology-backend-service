import moment from 'moment';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { GetRangeDateDto } from './dto/get-date.dto';

export const formatDate = (date: Date): string => {
  moment.locale('mn');
  return moment(date).format('YYYY-MM-DD');
};
export const formatFullDate = (date: Date): string => {
  moment.locale('mn');
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};
export const formatYearMonth = (date: Date): string => {
  moment.locale('mn');
  return moment(date).format('YYYY оны MM-р сар');
};
export const formatMonth = (date: Date): string => {
  moment.locale('mn');
  return moment(date).format('MMMM');
};
export const getCode = (title: string, counter: number): string => {
  const nowDate = new Date();
  title +=
    '-' + formatDate(nowDate) + '/' + counter.toString().padStart(4, '0');
  return title;
};
export const generatePdf = async (content: string): Promise<Uint8Array> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(content);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF: ', error);
    throw new Error('Failed to generate PDF');
  }
};
export const imageToBase64 = (imagePath: string): string => {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
};
/** Өнөөдрийн хугацааг */
export const today = (): GetRangeDateDto => {
  const startAt = new Date();
  startAt.setHours(0, 0, 0, 0);
  const endAt = new Date();
  endAt.setHours(23, 59, 59, 999);
  return { startAt, endAt };
};
/** Сарын хугацааг авах функц */
export const getMonthDates = (date: Date): GetRangeDateDto => {
  date.setDate(1);
  const startAt = date;
  startAt.setHours(0, 0, 0, 0);
  const endAt = new Date(startAt);
  endAt.setMonth(endAt.getMonth() + 1, 0);
  endAt.setHours(23, 59, 59, 999);
  return { startAt, endAt };
};
/** Улиралын хугацааг авах функц */
export const getQuarterDates = (date: Date): GetRangeDateDto => {
  const year = date.getFullYear();
  const month = date.getMonth();
  let startAt: Date;
  let endAt: Date;

  /** Тухайн сар дээр үндэслэн улирлыг тодорхойл */
  if (month >= 0 && month <= 2) {
    // 1-р улирал: January 1 to March 31
    startAt = new Date(year, 0, 1);
    endAt = new Date(year, 2, 31, 23, 59, 59, 999); // 23:59:59.999 to include the last millisecond of the quarter
  } else if (month >= 3 && month <= 5) {
    // 2-р улирал: April 1 to June 30
    startAt = new Date(year, 3, 1);
    endAt = new Date(year, 5, 30, 23, 59, 59, 999);
  } else if (month >= 6 && month <= 8) {
    // 3-р улирал: July 1 to September 30
    startAt = new Date(year, 6, 1);
    endAt = new Date(year, 8, 30, 23, 59, 59, 999);
  } else {
    // 4-р улирал: October 1 to December 31
    startAt = new Date(year, 9, 1);
    endAt = new Date(year, 11, 31, 23, 59, 59, 999);
  }
  return { startAt, endAt };
};
/** Хагас жилийн хугацааг авах функц */
export const getHalfYearDates = (date: Date): GetRangeDateDto => {
  const year = date.getFullYear();
  const month = date.getMonth();
  let startAt: Date;
  let endAt: Date;
  if (month >= 0 && month <= 5) {
    startAt = new Date(year, 0, 1, 0, 0, 0, 0);
    endAt = new Date(year, 5, 30);
  } else {
    startAt = new Date(year, 6, 1, 0, 0, 0, 0);
    endAt = new Date(year, 11, 31, 23, 59, 59, 999);
  }
  return { startAt, endAt };
};
/** Жилийн хугацааг авах функц */
export const getYearDates = (date: Date): GetRangeDateDto => {
  const year = date.getFullYear();
  const startAt = new Date(year, 0, 1, 0, 0, 0, 0);
  const endAt = new Date(year, 11, 31, 23, 59, 59, 999);
  return { startAt, endAt };
};
