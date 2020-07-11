import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBnR0Em-SjeCYjCgKpV1jhVmfiRc2yBczg",
    authDomain: "fir-reactcloud.firebaseapp.com",
    databaseURL: "https://fir-reactcloud.firebaseio.com",
    projectId: "fir-reactcloud",
    storageBucket: "fir-reactcloud.appspot.com",
    messagingSenderId: "639009031745",
    appId: "1:639009031745:web:4e568f3b09eeaadb0c68c0",
    measurementId: "G-L05V168DNL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection('favs')

export function updateDb(array,uid){
    return db.doc(uid).set({array})
}

export function getFavs(uid){
    return db.doc(uid).get()
    .then(snap=>{
        //console.log("Data: "+snap.data().array)
        return snap.data().array
    })
}

export function loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider()
    //const provider = firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
        .then(snap => snap.user)
}

export function logoutWithGoogle(){
    firebase.auth().signOut()
}
