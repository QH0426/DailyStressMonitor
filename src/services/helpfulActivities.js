function isHelpfulFeedback(feedback) {
  const helpfulResponses = [
    'Yes, a lot',
    'A little',
    'Much calmer',
    'A little calmer',
    'A little better',
  ];

  return helpfulResponses.includes(feedback);
}

function getSourceLabel(profileSource) {
  if (!profileSource) {
    return 'General activity';
  }

  return profileSource;
}

export function analyseHelpfulActivities(
  feedbackEntries = []
) {
  if (
    !Array.isArray(feedbackEntries) ||
    feedbackEntries.length === 0
  ) {
    return {
      totalFeedback: 0,
      activities: [],
      mostHelpful: null,
      hasEnoughData: false,
    };
  }

  const groupedActivities = {};

  feedbackEntries.forEach((entry) => {
    const source = getSourceLabel(
      entry.profileSource
    );

    if (!groupedActivities[source]) {
      groupedActivities[source] = {
        profileSource: source,
        totalResponses: 0,
        helpfulResponses: 0,
      };
    }

    groupedActivities[source].totalResponses += 1;

    if (isHelpfulFeedback(entry.feedback)) {
      groupedActivities[source].helpfulResponses += 1;
    }
  });

  const activities = Object.values(
    groupedActivities
  )
    .map((activity) => {
      const helpfulPercentage = Math.round(
        (
          activity.helpfulResponses /
          activity.totalResponses
        ) * 100
      );

      return {
        ...activity,
        helpfulPercentage,
      };
    })
    .sort((firstActivity, secondActivity) => {
      if (
        secondActivity.helpfulPercentage !==
        firstActivity.helpfulPercentage
      ) {
        return (
          secondActivity.helpfulPercentage -
          firstActivity.helpfulPercentage
        );
      }

      if (
        secondActivity.helpfulResponses !==
        firstActivity.helpfulResponses
      ) {
        return (
          secondActivity.helpfulResponses -
          firstActivity.helpfulResponses
        );
      }

      return (
        secondActivity.totalResponses -
        firstActivity.totalResponses
      );
    });

  const totalFeedback =
    feedbackEntries.length;

  const hasEnoughData =
    totalFeedback >= 3;

  const mostHelpful =
    hasEnoughData &&
    activities.length > 0
      ? activities[0]
      : null;

  return {
    totalFeedback,
    activities,
    mostHelpful,
    hasEnoughData,
  };
}