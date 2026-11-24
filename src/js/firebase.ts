import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  throw error;
}

/**
 * Autentica al usuario de forma anónima
 * @returns Promise con el usuario autenticado
 */
export async function authenticateUser(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    console.log('✅ Usuario autenticado:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    throw error;
  }
}

/**
 * Escucha cambios en el estado de autenticación
 * @param callback Función que se ejecuta cuando cambia el estado
 */
export function onAuthChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, callback);
}

/**
 * Obtiene el usuario actual
 * @returns Usuario actual o null
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export { auth, db };
