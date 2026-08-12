import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../firebase/firebaseConfig';

function getCurrentUserId() {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error(
      'A signed-in user is required to access reflections.'
    );
  }

  return userId;
}

function getReflectionsCollection(userId) {
  return collection(
    db,
    'users',
    userId,
    'reflections'
  );
}

function isSameLocalDay(
  firstDateValue,
  secondDateValue
) {
  const firstDate = new Date(firstDateValue);
  const secondDate = new Date(secondDateValue);

  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
}

export async function initialiseDatabase() {
  /*
    Firestore does not require tables or collections
    to be created in advance.

    The user's reflections collection is created
    automatically when their first reflection is saved.
  */

  return;
}

export async function saveStressEntry(
  score,
  answers,
  mood = null,
  note = ''
) {
  const userId = getCurrentUserId();
  const date = new Date().toISOString();

  const newReflection = {
    date,

    createdAt: serverTimestamp(),

    /*
      Version 2 represents the shortened five-question
      daily reflection introduced after supervisor feedback.
    */
    questionnaireVersion: 2,

    score: Number(score),

    anxiety: Number(answers.anxiety),

    panic: Number(answers.panic),

    sleep: Number(answers.sleep),

    workload: Number(answers.workload),

    energy: Number(answers.energy),

    mood: mood || null,

    note: note.trim(),
  };

  const documentReference = await addDoc(
    getReflectionsCollection(userId),
    newReflection
  );

  return documentReference.id;
}

export async function getStressEntries() {
  const userId = getCurrentUserId();

  const reflectionsQuery = query(
    getReflectionsCollection(userId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(
    reflectionsQuery
  );

  return snapshot.docs.map(
    (reflectionDocument) => ({
      id: reflectionDocument.id,

      ...reflectionDocument.data(),
    })
  );
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
  const todayEntry =
    await getTodayStressEntry();

  return Boolean(todayEntry);
}

export async function deleteStressEntry(
  entryId
) {
  const userId = getCurrentUserId();

  await deleteDoc(
    doc(
      db,
      'users',
      userId,
      'reflections',
      String(entryId)
    )
  );
}

export async function clearStressEntries() {
  const userId = getCurrentUserId();

  const snapshot = await getDocs(
    getReflectionsCollection(userId)
  );

  if (snapshot.empty) {
    return;
  }

  const batch = writeBatch(db);

  snapshot.docs.forEach(
    (reflectionDocument) => {
      batch.delete(
        reflectionDocument.ref
      );
    }
  );

  await batch.commit();
}