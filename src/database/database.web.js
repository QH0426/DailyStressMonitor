const STORAGE_KEY = 'stress_entries';

export async function initialiseDatabase() {
  const existingEntries = localStorage.getItem(STORAGE_KEY);

  if (!existingEntries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  console.log('Web local storage initialised successfully.');
}

export async function saveStressEntry(score, answers) {
  const existingEntries = await getStressEntries();

  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    score,
    stress: answers.stress,
    anxiety: answers.anxiety,
    panic: answers.panic,
    sleep: answers.sleep,
    workload: answers.workload,
    energy: answers.energy,
    lifestyle: answers.lifestyle,
  };

  const updatedEntries = [newEntry, ...existingEntries];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));

  console.log('Web stress entry saved:', newEntry);

  return newEntry.id;
}

export async function getStressEntries() {
  const storedEntries = localStorage.getItem(STORAGE_KEY);

  if (!storedEntries) {
    return [];
  }

  try {
    return JSON.parse(storedEntries);
  } catch (error) {
    console.error('Unable to read stored web entries:', error);
    return [];
  }
}