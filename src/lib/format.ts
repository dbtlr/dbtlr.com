const LONG = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
const SHORT = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });

/** "May 28, 2026" — home rows, article kicker, search subs */
export const fmtLong = (date: Date) => LONG.format(date);

/** "May 28" — writing index rows (year comes from the group marker) */
export const fmtShort = (date: Date) => SHORT.format(date);

/** "6 min read" at ~200 wpm */
export const readingTime = (body: string) =>
  `${Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))} min read`;
