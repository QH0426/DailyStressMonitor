const factorDefinitions = {
  anxiety: {
    label: 'Anxiety',
    type: 'negative',
    weight: 25,
  },

  panic: {
    label: 'Panic / overwhelm',
    type: 'negative',
    weight: 20,
  },

  sleep: {
    label: 'Sleep',
    type: 'positive',
    weight: 20,
  },

  workload: {
    label: 'Daily responsibilities',
    type: 'negative',
    weight: 20,
  },

  energy: {
    label: 'Energy',
    type: 'positive',
    weight: 15,
  },
};

function getRatingDescription(key, value) {
  const descriptions = {
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
      'Demanding',
      'Very demanding',
    ],

    energy: [
      '',
      'Very low',
      'Low',
      'Moderate',
      'High',
      'Very high',
    ],
  };

  return (
    descriptions[key]?.[value] ||
    `Rating ${value}`
  );
}

function calculateImpact(key, value) {
  const factor = factorDefinitions[key];

  if (!factor || !Number.isFinite(value)) {
    return 0;
  }

  if (factor.type === 'positive') {
    return ((5 - value) / 4) * factor.weight;
  }

  return ((value - 1) / 4) * factor.weight;
}

export function getFactorBreakdown(answers) {
  return Object.keys(factorDefinitions)
    .filter((key) => answers[key] !== undefined)
    .map((key) => {
      const definition = factorDefinitions[key];
      const value = Number(answers[key]);

      return {
        key,
        label: definition.label,
        value,
        description: getRatingDescription(
          key,
          value
        ),
        type: definition.type,
        weight: definition.weight,
        impact: calculateImpact(
          key,
          value
        ),
      };
    });
}

export function getMainContributors(answers) {
  return getFactorBreakdown(answers)
    .filter(
      (factor) =>
        factor.impact > 0 &&
        Number.isFinite(factor.value)
    )
    .sort(
      (first, second) =>
        second.impact - first.impact
    )
    .slice(0, 3);
}

export function getPositiveFactors(answers) {
  return getFactorBreakdown(answers)
    .filter(
      (factor) =>
        factor.type === 'positive' &&
        factor.value >= 4
    )
    .sort(
      (first, second) =>
        second.value - first.value
    );
}

export function getSuggestions(answers) {
  const suggestions = [];

  if (
    answers.sleep !== undefined &&
    answers.sleep <= 2
  ) {
    suggestions.push(
      'Consider creating a consistent evening routine and allowing enough time for rest.'
    );
  }

  if (
    answers.workload !== undefined &&
    answers.workload >= 4
  ) {
    suggestions.push(
      'Try breaking demanding responsibilities into smaller steps and taking short regular breaks.'
    );
  }

  if (
    answers.anxiety !== undefined &&
    answers.anxiety >= 4
  ) {
    suggestions.push(
      'A short breathing or grounding exercise may help you pause and refocus.'
    );
  }

  if (
    answers.panic !== undefined &&
    answers.panic >= 4
  ) {
    suggestions.push(
      'If feelings of panic or overwhelm continue or become difficult to manage, consider speaking with a qualified healthcare professional.'
    );
  }

  if (
    answers.energy !== undefined &&
    answers.energy <= 2
  ) {
    suggestions.push(
      'Consider rest, hydration and gentle movement if these are appropriate for you.'
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Continue monitoring your wellbeing and maintain the routines that appear to be supporting you.'
    );
  }

  return suggestions.slice(0, 4);
}