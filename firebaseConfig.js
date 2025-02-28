import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBpoNRzjvExwaEzFvRIQ8_kVvOYFUOAtKM',
  authDomain: 'lumigram-d7718.web.app',
  projectId: 'lumigram-d7718',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);

export { auth };
