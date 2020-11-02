// import firebase from "firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAw6ySaqBVhhFCsQGHjAFjFsRYlosAVd4M",
  authDomain: "great-hayden-vineyard.firebaseapp.com",
  databaseURL: "https://great-hayden-vineyard.firebaseio.com",
  projectId: "great-hayden-vineyard",
  storageBucket: "great-hayden-vineyard.appspot.com",
  messagingSenderId: "432953732167",
  appId: "1:432953732167:web:afc8a96a97e85562fad562",
  measurementId: "G-8PNCZ9J8MY"
};
// Initialize Firebase
const init = firebase.initializeApp(firebaseConfig);

export const db = init.firestore();
export const auth = init.auth();
export const storageRef = firebase.storage().ref();
