import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  enableNetwork,
  disableNetwork,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// Firebase configuration
// Note: Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

export const initializeFirebase = (): FirebaseApp => {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  return app;
};

// Export instances (initialize on first import)
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

export const getFirestoreDb = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
};

// Network status management for offline support
export const goOnline = async (): Promise<void> => {
  const firestore = getFirestoreDb();
  await enableNetwork(firestore);
};

export const goOffline = async (): Promise<void> => {
  const firestore = getFirestoreDb();
  await disableNetwork(firestore);
};

// Auth helpers
export interface AuthCredentials {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: AuthCredentials): Promise<User> => {
  const authInstance = getFirebaseAuth();
  const result = await signInWithEmailAndPassword(authInstance, email, password);
  return result.user;
};

export const signUp = async ({ email, password }: AuthCredentials): Promise<User> => {
  const authInstance = getFirebaseAuth();
  const result = await createUserWithEmailAndPassword(authInstance, email, password);
  return result.user;
};

export const signOutUser = async (): Promise<void> => {
  const authInstance = getFirebaseAuth();
  await signOut(authInstance);
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  const authInstance = getFirebaseAuth();
  return onAuthStateChanged(authInstance, callback);
};

// Firestore helpers
export interface FirestoreDocument {
  id: string;
  [key: string]: unknown;
}

export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const firestore = getFirestoreDb();
  const docRef = await addDoc(collection(firestore, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  const firestore = getFirestoreDb();
  await updateDoc(doc(firestore, collectionName, docId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const firestore = getFirestoreDb();
  await deleteDoc(doc(firestore, collectionName, docId));
};

export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const firestore = getFirestoreDb();
  const docSnap = await getDoc(doc(firestore, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as unknown as T;
  }
  return null;
};

export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  userId?: string
): Promise<T[]> => {
  const firestore = getFirestoreDb();
  let q = query(collection(firestore, collectionName));

  if (userId) {
    q = query(collection(firestore, collectionName), where('userId', '==', userId));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as T[];
};

export const subscribeToCollection = <T extends DocumentData>(
  collectionName: string,
  userId: string,
  callback: (docs: T[]) => void
): (() => void) => {
  const firestore = getFirestoreDb();
  const q = query(
    collection(firestore, collectionName),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[];
    callback(docs);
  });
};

// Storage helpers
export const uploadFile = async (
  path: string,
  file: Blob | Uint8Array
): Promise<string> => {
  const storageInstance = getFirebaseStorage();
  const storageRef = ref(storageInstance, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (path: string): Promise<void> => {
  const storageInstance = getFirebaseStorage();
  const storageRef = ref(storageInstance, path);
  await deleteObject(storageRef);
};

export const getFileUrl = async (path: string): Promise<string> => {
  const storageInstance = getFirebaseStorage();
  const storageRef = ref(storageInstance, path);
  return getDownloadURL(storageRef);
};

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PEOPLE: 'people',
  GIFTS: 'gifts',
  OCCASIONS: 'occasions',
} as const;

export default {
  initializeFirebase,
  getFirebaseApp,
  getFirestoreDb,
  getFirebaseAuth,
  getFirebaseStorage,
  goOnline,
  goOffline,
  signIn,
  signUp,
  signOutUser,
  subscribeToAuthChanges,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  subscribeToCollection,
  uploadFile,
  deleteFile,
  getFileUrl,
  COLLECTIONS,
};
