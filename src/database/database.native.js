import * as SQLite from 'expo-sqlite';

let database = null;

async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('DailyStress.db');
  }

  return database;
}

export async function initialiseDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS stress_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      score INTEGER NOT NULL,
      stress INTEGER NOT NULL,
      anxiety INTEGER NOT NULL,
      panic INTEGER NOT NULL,
      sleep INTEGER NOT NULL,
      workload INTEGER NOT NULL,
      energy INTEGER NOT NULL,
      lifestyle INTEGER NOT NULL
    );
  `);

  console.log('SQLite database initialised successfully.');
}

export async function saveStressEntry(score, answers) {
  const db = await getDatabase();
  const date = new Date().toISOString();

  const result = await db.runAsync(
    `
      INSERT INTO stress_entries (
        date,
        score,
        stress,
        anxiety,
        panic,
        sleep,
        workload,
        energy,
        lifestyle
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    date,
    score,
    answers.stress,
    answers.anxiety,
    answers.panic,
    answers.sleep,
    answers.workload,
    answers.energy,
    answers.lifestyle
  );

  console.log('Native stress entry saved with ID:', result.lastInsertRowId);

  return result.lastInsertRowId;
}

export async function getStressEntries() {
  const db = await getDatabase();

  const entries = await db.getAllAsync(`
    SELECT *
    FROM stress_entries
    ORDER BY date DESC
  `);

  return entries;
}