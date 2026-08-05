import * as SQLite from 'expo-sqlite';

let database = null;

async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('DailyStress.db');
  }

  return database;
}

function isSameLocalDay(firstDateValue, secondDateValue) {
  const firstDate = new Date(firstDateValue);
  const secondDate = new Date(secondDateValue);

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
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

  return result.lastInsertRowId;
}

export async function getStressEntries() {
  const db = await getDatabase();

  return db.getAllAsync(`
    SELECT *
    FROM stress_entries
    ORDER BY date DESC
  `);
}

export async function getTodayStressEntry() {
  const entries = await getStressEntries();
  const now = new Date();

  return (
    entries.find((entry) =>
      isSameLocalDay(entry.date, now)
    ) || null
  );
}

export async function hasCompletedCheckInToday() {
  const todayEntry = await getTodayStressEntry();

  return Boolean(todayEntry);
}

export async function deleteStressEntry(entryId) {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM stress_entries
      WHERE id = ?
    `,
    entryId
  );
}

export async function clearStressEntries() {
  const db = await getDatabase();

  await db.runAsync(`
    DELETE FROM stress_entries
  `);
}