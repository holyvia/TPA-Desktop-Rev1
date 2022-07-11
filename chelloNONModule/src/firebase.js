import firebase from "firebase/compat/app"
import {getApp, initializeApp} from "firebase/app"
import {getStorage} from "firebase/storage"
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig  =({
  apiKey: "AIzaSyDrnXRKuGV4nvgPF0-8yMaQeIltU-Prwas",
  authDomain: "newchello-1dcbe.firebaseapp.com",
  projectId: "newchello-1dcbe",
  storageBucket: "newchello-1dcbe.appspot.com",
  messagingSenderId: "563861028484",
  appId: "1:563861028484:web:ca1d092327b854c2fcccd1"
})

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app
export const auth = getAuth(app)
export const storage = getStorage(); 