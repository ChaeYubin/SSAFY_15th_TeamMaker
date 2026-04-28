const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function toKstDate(baseDate = new Date()) {
  return new Date(baseDate.getTime() + KST_OFFSET_MS);
}

function formatDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDisplayDate(date) {
  return {
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function getKstDateContext(baseDate = new Date()) {
  const todayKst = toKstDate(baseDate);
  const yesterdayKst = new Date(todayKst.getTime() - DAY_MS);

  return {
    todayKey: formatDateKey(todayKst),
    yesterdayKey: formatDateKey(yesterdayKst),
    displayDate: toDisplayDate(todayKst),
  };
}
