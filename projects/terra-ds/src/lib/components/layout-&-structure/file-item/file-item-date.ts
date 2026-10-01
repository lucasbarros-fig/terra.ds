const DD_MM_YY = /^(\d{2})\/(\d{2})\/(\d{2})$/;
const DD_MM_YYYY = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toTwoDigitYear(year: number): number {
  return year % 100;
}

function fromParts(day: number, month: number, year: number): string | null {
  const twoDigitYear = year < 100 ? year : toTwoDigitYear(year);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    twoDigitYear < 0 ||
    twoDigitYear > 99
  ) {
    return null;
  }

  return `${pad2(day)}/${pad2(month)}/${pad2(twoDigitYear)}`;
}

function fromDate(value: Date): string | null {
  if (Number.isNaN(value.getTime())) {
    return null;
  }
  return fromParts(value.getDate(), value.getMonth() + 1, value.getFullYear());
}

export function formatFileItemDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return fromDate(value) ?? '';
  }

  const raw = String(value).trim();
  if (!raw) {
    return '';
  }

  const ddMmYy = DD_MM_YY.exec(raw);
  if (ddMmYy) {
    return (
      fromParts(Number(ddMmYy[1]), Number(ddMmYy[2]), Number(ddMmYy[3])) ?? raw
    );
  }

  const ddMmYyyy = DD_MM_YYYY.exec(raw);
  if (ddMmYyyy) {
    return (
      fromParts(
        Number(ddMmYyyy[1]),
        Number(ddMmYyyy[2]),
        Number(ddMmYyyy[3]),
      ) ?? raw
    );
  }

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (isoDate) {
    return (
      fromParts(Number(isoDate[3]), Number(isoDate[2]), Number(isoDate[1])) ??
      ''
    );
  }

  const parsed = new Date(raw);
  return fromDate(parsed) ?? raw;
}
