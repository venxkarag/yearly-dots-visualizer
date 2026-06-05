// Pure date utilities for building the yearly dot grid.

export type DayStatus = "past" | "today" | "future";

export interface DayCell {
  /** 1-based day of the year (1..365/366) */
  dayOfYear: number;
  /** The actual calendar date for this dot */
  date: Date;
  /** 0-based month index (0 = January) */
  month: number;
  /** 1-based day of the month */
  dayOfMonth: number;
  status: DayStatus;
}

export interface MonthGroup {
  month: number;
  label: string;
  days: DayCell[];
}

export interface YearModel {
  year: number;
  totalDays: number;
  dayOfYear: number; // 1-based index of "today" within the year
  daysPassed: number;
  daysRemaining: number;
  percentComplete: number;
  isLeapYear: boolean;
  months: MonthGroup[];
}

const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Strip time-of-day so comparisons are by calendar date only (local time). */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Build the full model for a given year relative to `now`.
 * All comparisons use local calendar dates.
 */
export function buildYear(now: Date): YearModel {
  const today = startOfDay(now);
  const year = today.getFullYear();
  const leap = isLeapYear(year);
  const totalDays = leap ? 366 : 365;

  const yearStart = new Date(year, 0, 1);
  const todayTime = today.getTime();

  const months: MonthGroup[] = MONTH_LABELS.map((label, m) => ({
    month: m,
    label,
    days: [],
  }));

  let dayOfYear = 0; // index of today within the year (1-based); 0 if not found

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, 0, 1 + i);
    const cellTime = date.getTime();

    let status: DayStatus;
    if (cellTime < todayTime) status = "past";
    else if (cellTime === todayTime) status = "today";
    else status = "future";

    if (status === "today") dayOfYear = i + 1;

    months[date.getMonth()].days.push({
      dayOfYear: i + 1,
      date,
      month: date.getMonth(),
      dayOfMonth: date.getDate(),
      status,
    });
  }

  // If "now" is outside the rendered year (e.g. viewing a past/future year),
  // derive a sensible dayOfYear for the stats.
  if (dayOfYear === 0) {
    if (todayTime < yearStart.getTime()) {
      dayOfYear = 0; // year hasn't started
    } else {
      dayOfYear = totalDays; // year is fully in the past
    }
  }

  const daysPassed = Math.max(0, dayOfYear - 1);
  const daysRemaining = totalDays - dayOfYear < 0 ? 0 : totalDays - dayOfYear;
  const percentComplete = (dayOfYear / totalDays) * 100;

  return {
    year,
    totalDays,
    dayOfYear,
    daysPassed,
    daysRemaining,
    percentComplete,
    isLeapYear: leap,
    months,
  };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`;
}
