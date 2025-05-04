const diffMinute = (getOldTime) => {
  const oldTime = new Date(getOldTime);

  if (isNaN(oldTime.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();
  const diffInMs = now.getTime() - oldTime.getTime();
  return diffInMs / (1000 * 60);
};

export { diffMinute }
