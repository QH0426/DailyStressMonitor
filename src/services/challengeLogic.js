function getStressLevel(score) {
  if (score <= 20) {
    return 'Low';
  }

  if (score <= 40) {
    return 'Mild';
  }

  if (score <= 60) {
    return 'Moderate';
  }

  if (score <= 80) {
    return 'High';
  }

  return 'Very High';
}

function getProfileValue(profile, field) {
  if (!profile) {
    return '';
  }

  return profile[field]?.trim() || '';
}

function getPreferredSource(helpfulActivities) {
  if (
    !helpfulActivities ||
    !helpfulActivities.hasEnoughData ||
    !helpfulActivities.mostHelpful
  ) {
    return '';
  }

  return (
    helpfulActivities.mostHelpful.profileSource ||
    ''
  );
}

function addPreviousFeedbackMessage(
  challenge,
  preferredSource
) {
  if (
    !challenge ||
    !preferredSource ||
    challenge.profileSource !== preferredSource
  ) {
    return challenge;
  }

  return {
    ...challenge,
    previousFeedbackMessage:
      'This type of activity has received positive feedback from you before.',
  };
}

function createLowChallenge(
  source,
  values
) {
  if (
    source === 'Important person' &&
    values.importantPerson
  ) {
    return {
      stressLevel: 'Low',
      type: 'Support and Maintain',
      title: 'Share something positive',
      message:
        `Your stress level is low today. ` +
        `You said that ${values.importantPerson} is important to you. ` +
        `Think of something you appreciate about them and, ` +
        `if you would like to, tell them today.`,
      profileSource: 'Important person',
      feedbackQuestion:
        'Did this challenge help support your positive mood?',
      feedbackOptions: [
        'Yes, a lot',
        'A little',
        'No difference',
      ],
    };
  }

  if (
    source === 'Achievement' &&
    values.achievement
  ) {
    return {
      stressLevel: 'Low',
      type: 'Support and Maintain',
      title: 'Remember something you are proud of',
      message:
        `Your stress level is low today. ` +
        `Take a moment to think about something you are proud of: ` +
        `${values.achievement}. Think about what made this meaningful to you.`,
      profileSource: 'Achievement',
      feedbackQuestion:
        'Did this challenge help support your positive mood?',
      feedbackOptions: [
        'Yes, a lot',
        'A little',
        'No difference',
      ],
    };
  }

  return null;
}

function createMildChallenge(
  source,
  values
) {
  if (
    source === 'Happy memory' &&
    values.happyMemory
  ) {
    return {
      stressLevel: 'Mild',
      type: 'Positive Reinforcement',
      title: 'Return to a happy memory',
      message:
        `You told us about this positive memory: ` +
        `${values.happyMemory}. Take a few minutes to think about ` +
        `what made that moment special and how you felt at the time.`,
      profileSource: 'Happy memory',
      feedbackQuestion:
        'Did this challenge help support your positive mood?',
      feedbackOptions: [
        'Yes, a lot',
        'A little',
        'No difference',
      ],
    };
  }

  if (
    source === 'Looking forward to' &&
    values.lookingForwardTo
  ) {
    return {
      stressLevel: 'Mild',
      type: 'Positive Reinforcement',
      title: 'Focus on something positive ahead',
      message:
        `You said you are looking forward to ${values.lookingForwardTo}. ` +
        `Take a moment to think about what you are most ` +
        `looking forward to about it.`,
      profileSource: 'Looking forward to',
      feedbackQuestion:
        'Did this challenge help support your positive mood?',
      feedbackOptions: [
        'Yes, a lot',
        'A little',
        'No difference',
      ],
    };
  }

  return null;
}

function createModerateChallenge(
  source,
  values
) {
  if (
    source === 'Calming place' &&
    values.calmingPlace
  ) {
    return {
      stressLevel: 'Moderate',
      type: 'Calm and Redirect',
      title: 'Visit your calming place',
      message:
        `You said that ${values.calmingPlace} helps you feel calm. ` +
        `Take a quiet moment and imagine being there. ` +
        `Think of three things you would see, two things ` +
        `you would hear and one thing you would feel.`,
      profileSource: 'Calming place',
      feedbackQuestion:
        'How do you feel after this challenge?',
      feedbackOptions: [
        'Much calmer',
        'A little calmer',
        'About the same',
        'Worse',
      ],
    };
  }

  if (
    source === 'Favourite activity' &&
    values.favouriteActivity
  ) {
    return {
      stressLevel: 'Moderate',
      type: 'Calm and Redirect',
      title: 'Make time for something you enjoy',
      message:
        `You said that you enjoy ${values.favouriteActivity}. ` +
        `If possible, spend a few minutes doing it today, ` +
        `or think about when you could make time for it.`,
      profileSource: 'Favourite activity',
      feedbackQuestion:
        'How do you feel after this challenge?',
      feedbackOptions: [
        'Much calmer',
        'A little calmer',
        'About the same',
        'Worse',
      ],
    };
  }

  return null;
}

function createHighChallenge(
  source,
  values
) {
  if (
    source === 'Favourite music' &&
    values.favouriteMusic
  ) {
    return {
      stressLevel: 'High',
      type: 'Calm and Support',
      title: 'Take a short music break',
      message:
        `You said that you enjoy ${values.favouriteMusic}. ` +
        `If it feels helpful, take a few minutes to listen ` +
        `to some of this music without doing anything else. ` +
        `Afterwards, notice how you feel.`,
      profileSource: 'Favourite music',
      feedbackQuestion:
        'How do you feel after this challenge?',
      feedbackOptions: [
        'Much calmer',
        'A little calmer',
        'About the same',
        'Worse',
      ],
    };
  }

  if (
    source === 'Important person' &&
    values.importantPerson
  ) {
    return {
      stressLevel: 'High',
      type: 'Calm and Support',
      title: 'Connect with someone important',
      message:
        `You said that ${values.importantPerson} is important to you. ` +
        `Consider taking a moment to speak to them, send them ` +
        `a message or simply think about a positive moment ` +
        `you have shared together.`,
      profileSource: 'Important person',
      feedbackQuestion:
        'How do you feel after this challenge?',
      feedbackOptions: [
        'Much calmer',
        'A little calmer',
        'About the same',
        'Worse',
      ],
    };
  }

  return null;
}

function createVeryHighChallenge(
  source,
  values
) {
  if (
    source === 'Calming place' &&
    values.calmingPlace
  ) {
    return {
      stressLevel: 'Very High',
      type: 'Support First',
      title: 'Take a gentle pause',
      message:
        `Your self-reported stress level is very high today. ` +
        `You previously identified ${values.calmingPlace} as a place ` +
        `that helps you feel calm. If it feels comfortable, ` +
        `take a quiet moment to picture yourself there and ` +
        `focus on your surroundings.`,
      profileSource: 'Calming place',
      feedbackQuestion:
        'How do you feel after this activity?',
      feedbackOptions: [
        'A little better',
        'About the same',
        'Worse',
      ],
      showSupportInformation: true,
    };
  }

  return null;
}

export function getPersonalisedChallenge(
  score,
  profile,
  helpfulActivities = null
) {
  const stressLevel = getStressLevel(score);

  const values = {
    importantPerson: getProfileValue(
      profile,
      'importantPerson'
    ),

    happyMemory: getProfileValue(
      profile,
      'happyMemory'
    ),

    calmingPlace: getProfileValue(
      profile,
      'calmingPlace'
    ),

    favouriteActivity: getProfileValue(
      profile,
      'favouriteActivity'
    ),

    favouriteMusic: getProfileValue(
      profile,
      'favouriteMusic'
    ),

    achievement: getProfileValue(
      profile,
      'achievement'
    ),

    lookingForwardTo: getProfileValue(
      profile,
      'lookingForwardTo'
    ),
  };

  const preferredSource =
    getPreferredSource(helpfulActivities);

  let challenge = null;

  if (stressLevel === 'Low') {
    if (preferredSource) {
      challenge = createLowChallenge(
        preferredSource,
        values
      );
    }

    if (!challenge) {
      challenge =
        createLowChallenge(
          'Important person',
          values
        ) ||
        createLowChallenge(
          'Achievement',
          values
        );
    }
  }

  if (stressLevel === 'Mild') {
    if (preferredSource) {
      challenge = createMildChallenge(
        preferredSource,
        values
      );
    }

    if (!challenge) {
      challenge =
        createMildChallenge(
          'Happy memory',
          values
        ) ||
        createMildChallenge(
          'Looking forward to',
          values
        );
    }
  }

  if (stressLevel === 'Moderate') {
    if (preferredSource) {
      challenge =
        createModerateChallenge(
          preferredSource,
          values
        );
    }

    if (!challenge) {
      challenge =
        createModerateChallenge(
          'Calming place',
          values
        ) ||
        createModerateChallenge(
          'Favourite activity',
          values
        );
    }
  }

  if (stressLevel === 'High') {
    if (preferredSource) {
      challenge = createHighChallenge(
        preferredSource,
        values
      );
    }

    if (!challenge) {
      challenge =
        createHighChallenge(
          'Favourite music',
          values
        ) ||
        createHighChallenge(
          'Important person',
          values
        );
    }
  }

  if (stressLevel === 'Very High') {
    if (preferredSource) {
      challenge =
        createVeryHighChallenge(
          preferredSource,
          values
        );
    }

    if (!challenge) {
      challenge =
        createVeryHighChallenge(
          'Calming place',
          values
        );
    }
  }

  if (!challenge) {
    return getFallbackChallenge(
      stressLevel
    );
  }

  return addPreviousFeedbackMessage(
    challenge,
    preferredSource
  );
}

function getFallbackChallenge(stressLevel) {
  if (
    stressLevel === 'Low' ||
    stressLevel === 'Mild'
  ) {
    return {
      stressLevel,
      type: 'Support and Maintain',
      title: 'Notice something positive',
      message:
        `Take a moment to think of one thing that went ` +
        `well today or something that made you smile.`,
      profileSource: 'General',
      feedbackQuestion:
        'Did this challenge help support your positive mood?',
      feedbackOptions: [
        'Yes, a lot',
        'A little',
        'No difference',
      ],
    };
  }

  if (stressLevel === 'Very High') {
    return {
      stressLevel,
      type: 'Support First',
      title: 'Take a gentle pause',
      message:
        `Your self-reported stress level is very high today. ` +
        `Take a short pause somewhere you feel comfortable. ` +
        `You do not need to complete a difficult activity right now.`,
      profileSource: 'General',
      feedbackQuestion:
        'How do you feel after this activity?',
      feedbackOptions: [
        'A little better',
        'About the same',
        'Worse',
      ],
      showSupportInformation: true,
    };
  }

  return {
    stressLevel,
    type: 'Calm and Support',
    title: 'Take a short pause',
    message:
      `Take a few quiet minutes for yourself. ` +
      `Choose something simple that usually helps you ` +
      `feel comfortable or supported.`,
    profileSource: 'General',
    feedbackQuestion:
      'How do you feel after this challenge?',
    feedbackOptions: [
      'Much calmer',
      'A little calmer',
      'About the same',
      'Worse',
    ],
  };
}