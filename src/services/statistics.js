export function getTotalEntries(entries) {
  return entries.length;
}

export function getAverageScore(entries) {
  if (entries.length === 0) {
    return 0;
  }

  const totalScore = entries.reduce(
    (total, entry) => total + Number(entry.score),
    0
  );

  return Math.round(totalScore / entries.length);
}

export function getHighestScore(entries) {
  if (entries.length === 0) {
    return 0;
  }

  return Math.max(
    ...entries.map((entry) => Number(entry.score))
  );
}

export function getLowestScore(entries) {
  if (entries.length === 0) {
    return 0;
  }

  return Math.min(
    ...entries.map((entry) => Number(entry.score))
  );
}

export function getLatestScore(entries) {
  if (entries.length === 0) {
    return 0;
  }

  return Number(entries[0].score);
}

export function getStatistics(entries) {
  return {
    totalEntries: getTotalEntries(entries),
    averageScore: getAverageScore(entries),
    highestScore: getHighestScore(entries),
    lowestScore: getLowestScore(entries),
    latestScore: getLatestScore(entries),
  };
}