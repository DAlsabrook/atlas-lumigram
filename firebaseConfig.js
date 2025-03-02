import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBpoNRzjvExwaEzFvRIQ8_kVvOYFUOAtKM',
  authDomain: 'lumigram-d7718.web.app',
  projectId: 'lumigram-d7718',
  storageBucket: 'gs://lumigram-d7718.firebasestorage.app',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, storage, firestore };
