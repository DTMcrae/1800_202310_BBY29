var firebaseConfig = {
  apiKey: "AIzaSyBWoK61C_LwEt-1lgdqwNnzvFVUaWyX2dc",
  authDomain: "request-f3da5.firebaseapp.com",
  projectId: "request-f3da5",
  storageBucket: "request-f3da5.appspot.com",
  messagingSenderId: "356892671605",
  appId: "1:356892671605:web:1dd92589a767c6981f823c"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

