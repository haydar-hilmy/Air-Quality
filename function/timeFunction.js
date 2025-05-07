const diffMinute = (getOldTime) => {
  const oldTime = new Date(getOldTime);

  if (isNaN(oldTime.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();
  const diffInMs = now.getTime() - oldTime.getTime();
  return diffInMs / (1000 * 60);
};

function toIsoWithOffset(date) {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ":00"
  );
}

function toIsoWithOffsetRoundedToHour(date) {
  date.setMinutes(0, 0, 0); // Buang menit, detik, dan ms
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ":00"
  );
}

function toUtcRoundedIso(date) {
  date.setUTCMinutes(0, 0, 0);
  return date.toISOString().replace(/\.\d{3}Z$/, "Z"); // hapus milidetik
}

export {
  diffMinute,
  toIsoWithOffset,
  toIsoWithOffsetRoundedToHour,
  toUtcRoundedIso,
};
