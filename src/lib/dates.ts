import { format, isAfter, isBefore, parseISO } from "date-fns";

export function dateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function todayKey(timeZone: string) {
  return dateKeyInTimeZone(new Date(), timeZone);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return format(date, "yyyy-MM-dd");
}

export function zonedDateTimeToUtcIso(
  dateKey: string,
  timeValue: string | undefined,
  timeZone: string,
) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour = 0, minute = 0] = (timeValue || "00:00").split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utcGuess);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  const asUtc = Date.UTC(
    getPart("year"),
    getPart("month") - 1,
    getPart("day"),
    getPart("hour"),
    getPart("minute"),
    getPart("second"),
  );
  const offset = asUtc - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offset).toISOString();
}

export function isIsoOnDateKey(isoDate: string | null, dateKey: string, timeZone: string) {
  if (!isoDate) {
    return false;
  }

  return dateKeyInTimeZone(parseISO(isoDate), timeZone) === dateKey;
}

export function isIsoBeforeDateKey(isoDate: string | null, dateKey: string, timeZone: string) {
  if (!isoDate) {
    return false;
  }

  return dateKeyInTimeZone(parseISO(isoDate), timeZone) < dateKey;
}

export function isIsoBetweenDateKeys(
  isoDate: string | null,
  startKey: string,
  endKey: string,
  timeZone: string,
) {
  if (!isoDate) {
    return false;
  }

  const key = dateKeyInTimeZone(parseISO(isoDate), timeZone);
  return key >= startKey && key <= endKey;
}

export function formatDateTime(isoDate: string | null, timeZone: string) {
  if (!isoDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    timeZone,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parseISO(isoDate));
}

export function formatDateOnly(isoDate: string | null, timeZone: string) {
  if (!isoDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parseISO(isoDate));
}

export function formatReadableDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function greetingFor(timeZone: string) {
  const hour = Number(
    new Intl.DateTimeFormat("en", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function hasExplicitTime(isoDate: string | null, timeZone: string) {
  if (!isoDate) {
    return false;
  }

  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(parseISO(isoDate));

  return formatted !== "00:00";
}

export function dateInputValue(isoDate: string | null, timeZone: string) {
  if (!isoDate) {
    return "";
  }

  return dateKeyInTimeZone(parseISO(isoDate), timeZone);
}

export function timeInputValue(isoDate: string | null, timeZone: string) {
  if (!isoDate || !hasExplicitTime(isoDate, timeZone)) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(parseISO(isoDate));
}

export function sortIsoAsc(a: string | null, b: string | null) {
  if (!a && !b) {
    return 0;
  }

  if (!a) {
    return 1;
  }

  if (!b) {
    return -1;
  }

  const left = parseISO(a);
  const right = parseISO(b);

  if (isBefore(left, right)) {
    return -1;
  }

  if (isAfter(left, right)) {
    return 1;
  }

  return 0;
}
