// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAKj4MYQkgvNtYrS3opg9HPUSQJDTFiFuQ",
	authDomain: "fir-social-app-fc924.firebaseapp.com",
	projectId: "fir-social-app-fc924",
	storageBucket: "fir-social-app-fc924.appspot.com",
	messagingSenderId: "907542944543",
	appId: "1:907542944543:web:c62b2591c1120fbfa42e2a",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
