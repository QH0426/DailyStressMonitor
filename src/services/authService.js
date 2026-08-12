import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function logoutUser() {
  return signOut(auth);
}