// Solar Hijri (Persian) calendar utilities
export interface PersianDate {
  year: number
  month: number
  day: number
}

export interface GregorianDate {
  year: number
  month: number
  day: number
}

// Persian month names
export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

// Persian weekday names
export const PERSIAN_WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

// Check if a Persian year is leap
export function isPersianLeapYear(year: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
  ]

  let jp = breaks[0]
  let jump = 0
  for (let j = 1; j <= breaks.length; j++) {
    const jm = breaks[j]
    jump = jm - jp
    if (year < jm) break
    jp = jm
  }

  let n = year - jp
  if (n < jump) {
    if (jump - n < 6) n = n - jump + ((jump + 4) / 6) * 6
    let leap = ((n + 1) % 33) % 4
    if (jump === 33 && leap === 1) leap = 0
    return leap === 1
  }
  return false
}

// Get number of days in a Persian month
export function getPersianMonthDays(year: number, month: number): number {
  if (month <= 6) return 31
  if (month <= 11) return 30
  return isPersianLeapYear(year) ? 30 : 29
}

// Convert Gregorian date to Persian date
export function gregorianToPersian(gDate: GregorianDate): PersianDate {
  let { year: gy, month: gm, day: gd } = gDate

  let jy: number, jm: number, jd: number

  if (gy <= 1600) {
    jy = 0
    gy -= 621
  } else {
    jy = 979
    gy -= 1600
  }

  let gy2: number
  if (gm > 2) {
    gy2 = gy + 1
  } else {
    gy2 = gy
  }

  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][gm - 1]

  jy += 33 * Math.floor(days / 12053)
  days %= 12053

  jy += 4 * Math.floor(days / 1461)
  days %= 1461

  if (days >= 366) {
    jy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }

  if (days < 186) {
    jm = 1 + Math.floor(days / 31)
    jd = 1 + (days % 31)
  } else {
    jm = 7 + Math.floor((days - 186) / 30)
    jd = 1 + ((days - 186) % 30)
  }

  return { year: jy, month: jm, day: jd }
}

// Convert Persian date to Gregorian date
export function persianToGregorian(pDate: PersianDate): GregorianDate {
  let { year: jy, month: jm, day: jd } = pDate

  let gy: number, gm: number, gd: number

  if (jy <= 979) {
    gy = 1600
    jy += 621
  } else {
    gy = 621
    jy -= 979
  }

  let days: number
  if (jm < 7) {
    days = (jm - 1) * 31
  } else {
    days = (jm - 7) * 30 + 186
  }

  days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + days

  gy += 400 * Math.floor(days / 146097)
  days %= 146097

  let leap = true
  if (days >= 36525) {
    days--
    gy += 100 * Math.floor(days / 36524)
    days %= 36524
    if (days >= 365) days++
    else leap = false
  }

  gy += 4 * Math.floor(days / 1461)
  days %= 1461

  if (days >= 366) {
    leap = false
    days--
    gy += Math.floor(days / 365)
    days = days % 365
  }

  gd = days + 1

  const salA = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  gm = 0
  while (gm < 13 && gd > salA[gm]) {
    gd -= salA[gm]
    gm++
  }

  return { year: gy, month: gm, day: gd }
}

// Get current Persian date
export function getCurrentPersianDate(): PersianDate {
  const now = new Date()
  return gregorianToPersian({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  })
}

// Format Persian date as string
export function formatPersianDate(date: PersianDate, includeWeekday = false): string {
  const { year, month, day } = date
  const monthName = PERSIAN_MONTHS[month - 1]

  if (includeWeekday) {
    const gDate = persianToGregorian(date)
    const jsDate = new Date(gDate.year, gDate.month - 1, gDate.day)
    const weekdayIndex = (jsDate.getDay() + 1) % 7 // Adjust for Persian week starting on Saturday
    const weekdayName = PERSIAN_WEEKDAYS[weekdayIndex]
    return `${weekdayName}، ${day} ${monthName} ${year}`
  }

  return `${day} ${monthName} ${year}`
}

// Get Persian date from JavaScript Date object
export function jsDateToPersian(jsDate: Date): PersianDate {
  return gregorianToPersian({
    year: jsDate.getFullYear(),
    month: jsDate.getMonth() + 1,
    day: jsDate.getDate(),
  })
}

// Convert Persian date to JavaScript Date object
export function persianToJsDate(pDate: PersianDate): Date {
  const gDate = persianToGregorian(pDate)
  return new Date(gDate.year, gDate.month - 1, gDate.day)
}

export function formatPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  return num.toString().replace(/\d/g, (digit) => persianDigits[Number.parseInt(digit)])
}
