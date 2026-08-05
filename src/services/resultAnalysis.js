const factorDefinitions = {
  stress: {
    label: 'Stress',
    type: 'negative',
    weight: 30,
  },
  anxiety: {
    label: 'Anxiety',
    type: 'negative',
    weight: 20,
  },
  panic: {
    label: 'Panic-related symptoms',
    type: 'negative',
    weight: 15,
  },
  sleep: {
    label: 'Sleep',
    type: 'positive',
    weight: 15,
  },
  workload: {
    label: 'Workload',
    type: 'negative',
    weight: 10,
  },
  energy: {
    label: 'Energy',
    type: 'positive',
    weight: 5,
  },
  lifestyle: {
    label: 'Lifestyle',
    type: 'positive',
    weight: 5,
  },
};

function getRatingDescription(key, value) {
  const descriptions = {
    stress: [
      '',
      'Very low',
      'Low',
      'Moderate',
      'High',
      'Very high',
    ],
    anxiety: [
      '',
      'Not at all',
      'Slightly',
      'Moderately',
      'Very',
      'Extremely',
    ],
    panic: [
      '',
      'Not at all',
      'Rarely',
      'Sometimes',
      'Often',
      'Very often',
    ],
    sleep: [
      '',
      'Very poor',
      'Poor',
      'Average',
      'Good',
      'Very good',
    ],
    workload: [
      '',
      'Very light',
      'Light',
      'Moderate',
      'Heavy',
      'Very heavy',
    ],
    energy: [
      '',
      'Very low',
      'Low',
      'Moderate',
      'High',
      'Very high',
    ],
    lifestyle: [
      '',
      'Very poorly',
      'Poorly',
      'Moderately',
      'Well',
      'Very well',
    ],
  };

  return descriptions[key]?.[value] || `Rating ${value}`;
}

function calculateImpact(key, value) {
  const factor = factorDefinitions[key];

  if (factor.type === 'positive') {
    return ((5 - value) / 4) * factor.weight;
  }

  return ((value - 1) / 4) * factor.weight;
}

export function getFactorBreakdown(answers) {
  return Object.keys(factorDefinitions).map((key) => {
    const definition = factorDefinitions[key];
    const value = Number(answers[key]);

    return {
      key,
      label: definition.label,
      value,
      description: getRatingDescription(key, value),
      type: definition.type,
      weight: definition.weight,
      impact: calculateImpact(key, value),
    };
  });
}

export function getMainContributors(answers) {
  return getFactorBreakdown(answers)
    .filter((factor) => factor.impact > 0)
    .sort((first, second) => second.impact - first.impact)
    .slice(0, 3);
}

export function getPositiveFactors(answers) {
  return getFactorBreakdown(answers)
    .filter(
      (factor) =>
        factor.type === 'positive' &&
        factor.value >= 4
    )
    .sort((first, second) => second.value - first.value);
}

export function getSuggestions(answers) {
  const suggestions = [];

  if (answers.sleep <= 2) {
    suggestions.push(
      'Consider creating a consistent evening routine and allowing enough time for rest.'
    );
  }

  if (answers.workload >= 4) {
    suggestions.push(
      'Try dividing demanding tasks into smaller steps and taking short regular breaks.'
    );
  }

  if (answers.anxiety >= 4) {
    suggestions.push(
      'A short breathing or grounding exercise may help you pause and refocus.'
    );
  }

  if (answers.panic >= 4) {
    suggestions.push(
      'If panic-related symptoms continue or become difficult to manage, consider speaking with a qualified healthcare professional.'
    );
  }

  if (answers.energy <= 2) {
    suggestions.push(
      'Consider rest, hydration and gentle movement if these are appropriate for you.'
    );
  }

  if (answers.lifestyle <= 2) {
    suggestions.push(
      'Choose one small wellbeing action today, such as eating regularly, moving gently or taking time away from screens.'
    );
  }

  if (answers.stress >= 4) {
    suggestions.push(
      'Try identifying one immediate pressure that can be reduced, delayed or discussed with someone you trust.'
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Continue monitoring your wellbeing and maintain the routines that appear to be supporting you.'
    );
  }

  return suggestions.slice(0, 4);
}