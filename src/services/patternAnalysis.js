function getVersionTwoEntries(entries = []) {
  return entries.filter(
    (entry) =>
      entry.questionnaireVersion === 2 &&
      Number.isFinite(Number(entry.score))
  );
}

function getRecentEntries(entries, limit = 7) {
  return getVersionTwoEntries(entries)
    .slice(0, limit);
}

function getAverage(values) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) => sum + Number(value),
    0
  );

  return total / values.length;
}

function getFactorAverage(entries, key) {
  const values = entries
    .map((entry) => Number(entry[key]))
    .filter(Number.isFinite);

  return getAverage(values);
}

export function analyseRecentPatterns(entries = []) {
  const recentEntries =
    getRecentEntries(entries, 7);

  if (recentEntries.length < 3) {
    return {
      type: 'building',
      title: 'Your pattern is still developing',
      message:
        'Complete at least three daily reflections to begin seeing meaningful patterns in your wellbeing.',
      factor: null,
    };
  }

  const latestThree =
    recentEntries.slice(0, 3);

  const latestThreeScores =
    latestThree.map(
      (entry) => Number(entry.score)
    );

  const allRecentElevated =
    latestThreeScores.every(
      (score) => score >= 60
    );

  if (allRecentElevated) {
    return {
      type: 'warning',
      title:
        'Your recent stress estimates have remained elevated',
      message:
        'Your last three reflections have all produced higher estimated stress levels. Consider reviewing the factors that have appeared most often.',
      factor: null,
    };
  }

  if (recentEntries.length >= 4) {
    const orderedChronologically =
      [...recentEntries].reverse();

    const firstHalf =
      orderedChronologically.slice(
        0,
        Math.floor(
          orderedChronologically.length / 2
        )
      );

    const secondHalf =
      orderedChronologically.slice(
        Math.floor(
          orderedChronologically.length / 2
        )
      );

    const earlierAverage =
      getAverage(
        firstHalf.map(
          (entry) => Number(entry.score)
        )
      );

    const recentAverage =
      getAverage(
        secondHalf.map(
          (entry) => Number(entry.score)
        )
      );

    if (
      recentAverage - earlierAverage >= 8
    ) {
      return {
        type: 'warning',
        title:
          'Your recent estimates show an upward pattern',
        message: `Your more recent stress estimates are about ${Math.round(
          recentAverage - earlierAverage
        )}% higher on average than the earlier entries in this period.`,
        factor: null,
      };
    }
  }

  const highStressEntries =
    recentEntries.filter(
      (entry) => Number(entry.score) >= 60
    );

  if (highStressEntries.length >= 2) {
    const poorSleepCount =
      highStressEntries.filter(
        (entry) =>
          Number(entry.sleep) <= 2
      ).length;

    if (
      poorSleepCount >=
      Math.ceil(
        highStressEntries.length / 2
      )
    ) {
      return {
        type: 'pattern',
        title:
          'Poorer sleep often appears alongside higher stress',
        message:
          'In your recent higher-stress reflections, lower sleep ratings appeared frequently. This may be a useful pattern to keep monitoring.',
        factor: 'sleep',
      };
    }

    const highWorkloadCount =
      highStressEntries.filter(
        (entry) =>
          Number(entry.workload) >= 4
      ).length;

    if (
      highWorkloadCount >=
      Math.ceil(
        highStressEntries.length / 2
      )
    ) {
      return {
        type: 'pattern',
        title:
          'Daily responsibilities often appear in your higher results',
        message:
          'Higher workload ratings appeared frequently in your recent higher-stress reflections.',
        factor: 'workload',
      };
    }

    const highAnxietyCount =
      highStressEntries.filter(
        (entry) =>
          Number(entry.anxiety) >= 4
      ).length;

    if (
      highAnxietyCount >=
      Math.ceil(
        highStressEntries.length / 2
      )
    ) {
      return {
        type: 'pattern',
        title:
          'Higher anxiety ratings are appearing repeatedly',
        message:
          'Higher anxiety ratings were common in your recent higher-stress reflections.',
        factor: 'anxiety',
      };
    }
  }

  const sleepAverage =
    getFactorAverage(
      recentEntries,
      'sleep'
    );

  const workloadAverage =
    getFactorAverage(
      recentEntries,
      'workload'
    );

  const anxietyAverage =
    getFactorAverage(
      recentEntries,
      'anxiety'
    );

  if (sleepAverage <= 2.2) {
    return {
      type: 'pattern',
      title:
        'Sleep may be worth monitoring',
      message:
        'Your recent sleep ratings have generally been lower. Continue checking in to see whether this changes alongside your stress estimates.',
      factor: 'sleep',
    };
  }

  if (workloadAverage >= 3.8) {
    return {
      type: 'pattern',
      title:
        'Daily responsibilities are frequently demanding',
      message:
        'Your recent reflections show consistently higher ratings for daily responsibilities.',
      factor: 'workload',
    };
  }

  if (anxietyAverage >= 3.8) {
    return {
      type: 'pattern',
      title:
        'Anxiety has been a recurring factor',
      message:
        'Your recent reflections contain consistently higher anxiety ratings.',
      factor: 'anxiety',
    };
  }

  return {
    type: 'stable',
    title:
      'No strong recent warning pattern',
    message:
      'Your recent reflections do not currently show a clear repeated warning pattern. Continue checking in regularly to build a clearer picture over time.',
    factor: null,
  };
}