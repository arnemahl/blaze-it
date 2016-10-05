import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCu8ts_aKTdGmrVzxn8nejJfnL84gEVs7Y",
    authDomain: "wooperate.firebaseapp.com",
    databaseURL: "https://wooperate.firebaseio.com",
    storageBucket: "wooperate.appspot.com",
    messagingSenderId: "152902163480"
};

export const FIREBASE_APP = firebase.initializeApp(config);
export const FIREBASE_REF = FIREBASE_APP.database().ref();
export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
