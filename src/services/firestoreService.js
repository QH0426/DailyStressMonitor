import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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
      'A signed-in user is required.'
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

function getChallengeFeedbackCollection(
  userId
) {
  return collection(
    db,
    'users',
    userId,
    'challengeFeedback'
  );
}

function isSameLocalDay(
  firstDateValue,
  secondDateValue
) {
  const firstDate =
    new Date(firstDateValue);

  const secondDate =
    new Date(secondDateValue);

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
  return;
}

export async function saveStressEntry(
  score,
  answers,
  mood = null,
  note = ''
) {
  const userId = getCurrentUserId();

  const date =
    new Date().toISOString();

  const newReflection = {
    date,

    createdAt: serverTimestamp(),

    questionnaireVersion: 2,

    score: Number(score),

    anxiety:
      Number(answers.anxiety),

    panic:
      Number(answers.panic),

    sleep:
      Number(answers.sleep),

    workload:
      Number(answers.workload),

    energy:
      Number(answers.energy),

    mood: mood || null,

    note: note.trim(),
  };

  const documentReference =
    await addDoc(
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

  const snapshot =
    await getDocs(
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
  const entries =
    await getStressEntries();

  const now = new Date();

  return (
    entries.find((entry) =>
      isSameLocalDay(
        entry.date,
        now
      )
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

  const snapshot =
    await getDocs(
      getReflectionsCollection(
        userId
      )
    );

  if (snapshot.empty) {
    return;
  }

  const batch =
    writeBatch(db);

  snapshot.docs.forEach(
    (reflectionDocument) => {
      batch.delete(
        reflectionDocument.ref
      );
    }
  );

  await batch.commit();
}

export async function savePositiveProfile(
  profile
) {
  const userId = getCurrentUserId();

  const profileReference = doc(
    db,
    'users',
    userId,
    'wellbeingProfile',
    'positiveProfile'
  );

  const profileData = {
    importantPerson:
      profile.importantPerson?.trim() ||
      '',

    happyMemory:
      profile.happyMemory?.trim() ||
      '',

    calmingPlace:
      profile.calmingPlace?.trim() ||
      '',

    favouriteActivity:
      profile.favouriteActivity?.trim() ||
      '',

    favouriteMusic:
      profile.favouriteMusic?.trim() ||
      '',

    achievement:
      profile.achievement?.trim() ||
      '',

    lookingForwardTo:
      profile.lookingForwardTo?.trim() ||
      '',

    updatedAt:
      serverTimestamp(),
  };

  await setDoc(
    profileReference,
    profileData,
    {
      merge: true,
    }
  );
}

export async function getPositiveProfile() {
  const userId = getCurrentUserId();

  const profileReference = doc(
    db,
    'users',
    userId,
    'wellbeingProfile',
    'positiveProfile'
  );

  const snapshot =
    await getDoc(
      profileReference
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,

    ...snapshot.data(),
  };
}

export async function saveChallengeFeedback({
  score,
  stressLevel,
  challengeType,
  challengeTitle,
  profileSource,
  feedback,
}) {
  const userId = getCurrentUserId();

  const feedbackData = {
    date:
      new Date().toISOString(),

    createdAt:
      serverTimestamp(),

    score:
      Number(score),

    stressLevel:
      stressLevel || '',

    challengeType:
      challengeType || '',

    challengeTitle:
      challengeTitle || '',

    profileSource:
      profileSource || 'General',

    feedback:
      feedback || '',
  };

  const documentReference =
    await addDoc(
      getChallengeFeedbackCollection(
        userId
      ),
      feedbackData
    );

  return documentReference.id;
}

export async function getChallengeFeedback() {
  const userId = getCurrentUserId();

  const feedbackQuery = query(
    getChallengeFeedbackCollection(
      userId
    ),
    orderBy('date', 'desc')
  );

  const snapshot =
    await getDocs(
      feedbackQuery
    );

  return snapshot.docs.map(
    (feedbackDocument) => ({
      id: feedbackDocument.id,

      ...feedbackDocument.data(),
    })
  );
}