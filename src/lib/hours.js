// Opening hours, evaluated in Prague time whatever the visitor's timezone.
// Index 0 is Sunday, as in Date#getDay().
export const SCHEDULE = [
  { open: '11:30', close: '23:00' }, // neděle
  { open: '11:30', close: '23:00' }, // pondělí
  { open: '11:30', close: '23:30' }, // úterý
  { open: '11:30', close: '23:30' }, // středa
  { open: '11:30', close: '24:00' }, // čtvrtek
  { open: '11:30', close: '24:00' }, // pátek
  { open: '11:30', close: '24:00' }, // sobota
]

// Rows as printed on the restaurant's own site.
export const HOURS_ROWS = [
  { days: [1], time: '11:30–23:00' },
  { days: [2, 3], time: '11:30–23:30' },
  { days: [4, 5, 6], time: '11:30–24:00' },
  { days: [0], time: '11:30–23:00' },
]

export const TIMEZONE = 'Europe/Prague'

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Weekday (0–6) and minutes since midnight in Prague for a given instant. */
export function pragueClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

/**
 * Whether the restaurant is open at `date`, and the next change:
 * `{ open: true, until: '23:00' }` or `{ open: false, opensAt: '11:30', opensDay, today }`.
 */
export function openStatus(date = new Date()) {
  const { day, minutes } = pragueClock(date)
  const today = SCHEDULE[day]
  const open = toMin(today.open)
  const close = toMin(today.close)

  if (minutes >= open && minutes < close) {
    return { open: true, until: today.close === '24:00' ? '0:00' : today.close, day }
  }
  if (minutes < open) {
    return { open: false, opensAt: today.open, opensDay: day, today: true, day }
  }
  const next = (day + 1) % 7
  return { open: false, opensAt: SCHEDULE[next].open, opensDay: next, today: false, day }
}

/** Lunch menu is served Monday to Friday, 11:00–15:00. */
export function isLunchDay(date = new Date()) {
  const { day } = pragueClock(date)
  return day >= 1 && day <= 5
}
