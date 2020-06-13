import React from 'react';
import ReactDOM from 'react-dom';
import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA784Tid_INB_R1gCbsVXtHtP3DI9E0g0w",
  authDomain: "chat-8cd5b.firebaseapp.com",
  databaseURL: "https://chat-8cd5b.firebaseio.com"
})

const base = Rebase.createClass(firebase.database())

export {firebaseApp}

export default base