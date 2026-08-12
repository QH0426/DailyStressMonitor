const weights = {
  anxiety: 0.25,
  panic: 0.20,
  sleep: 0.20,
  workload: 0.20,
  energy: 0.15,
};

function convertNegativeFactor(value) {
  return ((value - 1) / 4) * 100;
}

function convertPositiveFactor(value) {
  return ((5 - value) / 4) * 100;
}

export function calculateStressScore(answers) {
  const weightedScore =
    convertNegativeFactor(answers.anxiety) *
      weights.anxiety +
    convertNegativeFactor(answers.panic) *
      weights.panic +
    convertPositiveFactor(answers.sleep) *
      weights.sleep +
    convertNegativeFactor(answers.workload) *
      weights.workload +
    convertPositiveFactor(answers.energy) *
      weights.energy;

  return Math.round(weightedScore);
}

export function getStressCategory(score) {
  if (score <= 20) {
    return {
      label: 'Low',
      colour: '#22C55E',
      message:
        'Your responses indicate a relatively low estimated stress level today.',
    };
  }

  if (score <= 40) {
    return {
      label: 'Mild',
      colour: '#84CC16',
      message:
        'Your responses indicate a mild estimated stress level today.',
    };
  }

  if (score <= 60) {
    return {
      label: 'Moderate',
      colour: '#F59E0B',
      message:
        'Your responses indicate a moderate estimated stress level today.',
    };
  }

  if (score <= 80) {
    return {
      label: 'High',
      colour: '#F97316',
      message:
        'Your responses indicate a high estimated stress level today.',
    };
  }

  return {
    label: 'Very High',
    colour: '#EF4444',
    message:
      'Your responses indicate a very high estimated stress level today.',
  };
}