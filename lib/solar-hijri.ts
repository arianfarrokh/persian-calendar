import {
  format as formatJalali,
  getYear,
  getMonth,
  getDate,
} from "date-fns-jalali"

// تعریف نوع تاریخ شمسی
export interface PersianDate {
  year: number
  month: number // 1-12
  day: number   // 1-31
}

// گرفتن تاریخ امروز به شمسی
export function getCurrentPersianDate(): PersianDate {
  const now = new Date()
  return {
    year: getYear(now),
    month: getMonth(now) + 1, // getMonth صفرمبناست
    day: getDate(now),
  }
}

// فرمت تاریخ شمسی
export function formatPersianDate(
  date: Date | PersianDate,
  includeWeekday = false
): string {
  let jsDate: Date

  if ("year" in date) {
    // اگر PersianDate دادیم
    jsDate = new Date(date.year, date.month - 1, date.day)
  } else {
    jsDate = date
  }

  // فرمت‌دهی
  return formatJalali(
    jsDate,
    includeWeekday ? "EEEE، d MMMM yyyy" : "d MMMM yyyy"
  )
}

// تبدیل از PersianDate به Date
export function persianToJsDate(pDate: PersianDate): Date {
  return new Date(pDate.year, pDate.month - 1, pDate.day)
}

// تبدیل از Date به PersianDate
export function jsDateToPersian(jsDate: Date): PersianDate {
  return {
    year: getYear(jsDate),
    month: getMonth(jsDate) + 1,
    day: getDate(jsDate),
  }
}

// تبدیل عدد انگلیسی به فارسی
export function formatPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  return num.toString().replace(/\d/g, (d) => persianDigits[+d])
}
