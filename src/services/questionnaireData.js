const questionnaireData = [
  {
    id: 'stress',
    question: 'How stressed do you feel today?',
    options: [
      { label: 'Very low', value: 1, emoji: '😌' },
      { label: 'Low', value: 2, emoji: '🙂' },
      { label: 'Moderate', value: 3, emoji: '😐' },
      { label: 'High', value: 4, emoji: '😟' },
      { label: 'Very high', value: 5, emoji: '😫' },
    ],
  },
  {
    id: 'anxiety',
    question: 'How anxious have you felt today?',
    options: [
      { label: 'Not at all', value: 1, emoji: '😌' },
      { label: 'Slightly', value: 2, emoji: '🙂' },
      { label: 'Moderately', value: 3, emoji: '😐' },
      { label: 'Very', value: 4, emoji: '😟' },
      { label: 'Extremely', value: 5, emoji: '😫' },
    ],
  },
  {
    id: 'panic',
    question: 'Have you experienced panic-related symptoms today?',
    options: [
      { label: 'Not at all', value: 1, emoji: '😌' },
      { label: 'Rarely', value: 2, emoji: '🙂' },
      { label: 'Sometimes', value: 3, emoji: '😐' },
      { label: 'Often', value: 4, emoji: '😟' },
      { label: 'Very often', value: 5, emoji: '😫' },
    ],
  },
  {
    id: 'sleep',
    question: 'How would you describe your sleep last night?',
    options: [
      { label: 'Very poor', value: 1, emoji: '😫' },
      { label: 'Poor', value: 2, emoji: '😟' },
      { label: 'Average', value: 3, emoji: '😐' },
      { label: 'Good', value: 4, emoji: '🙂' },
      { label: 'Very good', value: 5, emoji: '😌' },
    ],
  },
  {
    id: 'workload',
    question: 'How demanding was your workload today?',
    options: [
      { label: 'Very light', value: 1, emoji: '😌' },
      { label: 'Light', value: 2, emoji: '🙂' },
      { label: 'Moderate', value: 3, emoji: '😐' },
      { label: 'Heavy', value: 4, emoji: '😟' },
      { label: 'Very heavy', value: 5, emoji: '😫' },
    ],
  },
  {
    id: 'energy',
    question: 'How would you describe your energy level today?',
    options: [
      { label: 'Very low', value: 1, emoji: '😫' },
      { label: 'Low', value: 2, emoji: '😟' },
      { label: 'Moderate', value: 3, emoji: '😐' },
      { label: 'High', value: 4, emoji: '🙂' },
      { label: 'Very high', value: 5, emoji: '😌' },
    ],
  },
  {
    id: 'lifestyle',
    question: 'How well did you look after your wellbeing today?',
    options: [
      { label: 'Very poorly', value: 1, emoji: '😫' },
      { label: 'Poorly', value: 2, emoji: '😟' },
      { label: 'Moderately', value: 3, emoji: '😐' },
      { label: 'Well', value: 4, emoji: '🙂' },
      { label: 'Very well', value: 5, emoji: '😌' },
    ],
  },
];

export default questionnaireData;