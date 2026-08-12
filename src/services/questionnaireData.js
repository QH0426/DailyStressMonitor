const questionnaireData = [
  {
    id: 'anxiety',
    question: 'How anxious have you felt today?',
    options: [
      { label: 'Not at all', value: 1 },
      { label: 'Slightly', value: 2 },
      { label: 'Moderately', value: 3 },
      { label: 'Very', value: 4 },
      { label: 'Extremely', value: 5 },
    ],
  },

  {
    id: 'panic',
    question:
      'Have you experienced feelings of panic or being overwhelmed today?',
    options: [
      { label: 'Not at all', value: 1 },
      { label: 'Rarely', value: 2 },
      { label: 'Sometimes', value: 3 },
      { label: 'Often', value: 4 },
      { label: 'Very often', value: 5 },
    ],
  },

  {
    id: 'sleep',
    question:
      'How would you describe your sleep last night?',
    options: [
      { label: 'Very poor', value: 1 },
      { label: 'Poor', value: 2 },
      { label: 'Average', value: 3 },
      { label: 'Good', value: 4 },
      { label: 'Very good', value: 5 },
    ],
  },

  {
    id: 'workload',
    question:
      'How demanding did your responsibilities feel today?',
    options: [
      { label: 'Very light', value: 1 },
      { label: 'Light', value: 2 },
      { label: 'Moderate', value: 3 },
      { label: 'Demanding', value: 4 },
      { label: 'Very demanding', value: 5 },
    ],
  },

  {
    id: 'energy',
    question:
      'How would you describe your energy level today?',
    options: [
      { label: 'Very low', value: 1 },
      { label: 'Low', value: 2 },
      { label: 'Moderate', value: 3 },
      { label: 'High', value: 4 },
      { label: 'Very high', value: 5 },
    ],
  },
];

export default questionnaireData;