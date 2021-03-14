import firebase from 'firebase';
require("@firebase/firestore");

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyCnnOCz3i4Ray1dE6xumvx1fGGwtxgVc8Q",
    authDomain: "barter-system-fb45c.firebaseapp.com",
    projectId: "barter-system-fb45c",
    storageBucket: "barter-system-fb45c.appspot.com",
    messagingSenderId: "334812111498",
    appId: "1:334812111498:web:2caafc41e1fab43426c373"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();