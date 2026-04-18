import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Validates connection to Firestore.
 * Helpful for debugging environment setup.
 */
async function testConnection() {
  try {
    // Attempting to read a public document to verify connectivity.
    // This doc doesn't have to exist; the absence of a permission error confirms connection.
    await getDocFromServer(doc(db, 'test_connection_internal', 'ping'));
    console.log('Firebase connection initialized');
  } catch (error: any) {
    // Both 'permission-denied' and 'Missing or insufficient permissions' indicate connectivity
    const isPermissionError = 
      error.code === 'permission-denied' || 
      (error.message && error.message.toLowerCase().includes('permissions'));

    if (isPermissionError) {
        console.log('Firebase connection verified (permission denied as expected)');
    } else {
        console.error("Firebase connection test failed:", error);
    }
  }
}

testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  const user = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType,
    path,
    authInfo: {
      userId: user?.uid || 'anonymous',
      email: user?.email || 'N/A',
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || true,
      providerInfo: user?.providerData || [],
    }
  };
  console.error("Firestore Error:", errorInfo);
  throw new Error(JSON.stringify(errorInfo));
}
