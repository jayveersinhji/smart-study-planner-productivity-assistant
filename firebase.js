// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// 🔥 Replace with YOUR Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAil6-jjQ5Yjc17LgcNqGHMG8YfmnONBzw",
  authDomain: "smart-study-planner-f7a93.firebaseapp.com",
  projectId: "smart-study-planner-f7a93",
  storageBucket: "smart-study-planner-f7a93.firebasestorage.app",
  messagingSenderId: "41385686550",
  appId: "1:41385686550:web:7187a9955ec72c621d2737"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Auth helpers ---
async function signup(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCredential.user.uid), {
    name,
    email,
    createdAt: Timestamp.now(),
    studyStreak: 0
  });
  return userCredential.user;
}

async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// --- Task helpers ---
async function addTask(userId, subjectId, taskTitle, deadline, estimatedHours, priorityScore = 0) {
  await addDoc(collection(db, "tasks"), {
    userId,
    subjectId,
    taskTitle,
    deadline,
    estimatedHours,
    isCompleted: false,
    priorityScore,
    createdAt: Timestamp.now()
  });
}

// Get today's tasks (incomplete + ordered by priority)
async function getTodaysTasks(userId) {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get subjects
async function getSubjects(userId) {
  const q = query(collection(db, "subjects"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export { auth, db, signup, login, addTask, getTodaysTasks, getSubjects };
