import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBNMGGIB7ivgTpsE84XdpUqgq5-vAyFdxo",
    authDomain: "fir-c829e.firebaseapp.com",
    projectId: "fir-c829e",
    storageBucket: "fir-c829e.appspot.com",
    messagingSenderId: "1044536600463",
    appId: "1:1044536600463:web:f6532ca1815d3f04a04dfa"
};

firebase.initializeApp(firebaseConfig)
var storage = firebase.storage();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, storage };

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user)
      const usuarioActivo ={
        email: user.email,
        uid: user.uid
      }
     store.dispatch('detectarUsuario', usuarioActivo)
     console.log(usuarioActivo)
    // ...
  } else {
    console.log(user)
    store.dispatch('detectarUsuario', user)
    // User is signed out
    // ...
  } 
});

createApp(App).use(store).use(router).mount('#app')
