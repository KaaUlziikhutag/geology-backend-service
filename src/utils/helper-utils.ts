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
    // throw new Error('Failed to generate PDF');
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

function getMinutesDifference(
  a: string | undefined | null,
  b: string | undefined | null,
): number {
  if (!a || !b) return 0;
  const [aHours, aMinutes] = a.split(':').map(Number);
  const [bHours, bMinutes] = b.split(':').map(Number);
  return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
}

function toTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
export function calculateAttendanceStatus(
  time1: string | null,
  time2: string | null,
  startTime: string,
  endTime: string,
) {
  const result = {
    lateMinutes: 0,
    leftEarlyMinutes: 0,
    overTimeMinutes: 0,
    isAbsent: false,
    lostTime1: '00:00',
    lostTime2: '00:00',
    overTime1: '00:00',
    overTime2: '00:00',
  };

  if (!time1 || !time2) {
    result.isAbsent = true;
    return result;
  }

  const late = getMinutesDifference(time1, startTime); // хоцорсон
  const leftEarly = getMinutesDifference(endTime, time2); // эрт явсан
  const overTimeAfter = getMinutesDifference(time2, endTime); // ажлын дараа
  const overTimeBefore = getMinutesDifference(startTime, time1); // ажлын өмнө

  if (late > 0) {
    result.lateMinutes = late;
    result.lostTime1 = toTimeString(late);
  }

  if (leftEarly > 0) {
    result.leftEarlyMinutes = leftEarly;
    result.lostTime2 = toTimeString(leftEarly);
  }

  if (overTimeAfter > 0) {
    result.overTimeMinutes += overTimeAfter;
    result.overTime2 = toTimeString(overTimeAfter);
  }

  if (overTimeBefore > 0) {
    result.overTimeMinutes += overTimeBefore;
    result.overTime1 = toTimeString(overTimeBefore);
  }

  return result;
}
export function extractBirthDateFromRegNumber(
  regNumber: string,
): string | null {
  const numericRegNumber = regNumber.replace(/\D/g, '');
  if (!/^\d{8,10}$/.test(numericRegNumber)) {
    return null; // Invalid format
  }
  const yearFragment = parseInt(numericRegNumber.slice(0, 2), 10);
  let month = parseInt(numericRegNumber.slice(2, 4), 10);
  const day = parseInt(numericRegNumber.slice(4, 6), 10);

  if (month > 12) {
    month -= 20;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null; // Invalid date
  }

  const currentYear = new Date().getFullYear();
  const fullYear =
    yearFragment + (yearFragment <= currentYear % 100 ? 2000 : 1900);

  // Format the date as "YYYY-MM-DD"
  return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
}
