import * as firebase from "firebase";

import { firebaseConfig } from "./keys";
firebase.initializeApp(firebaseConfig);

const databaseRef = firebase.database().ref();
export const prayerRequestRef = databaseRef.child("prayerRequests");
export const activeRef = databaseRef.child("prayerRequests/active");
export const firebaseAuth = firebase.auth;

export const signIn = (password) => {
    const email = "forbon@saron.se"
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
    // Handle Errors here.
    console.log(error);
    /*
    var errorCode = error.code;
    var errorMessage = error.message;
    */
    });
}