import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './Components/Auth';
import ImageRepo from './Components/ImageRepo';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function App() {
  // Setting an observer on the Auth object
  // Firebase Authentication State Change Listener
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      ReactDOM.render(<ImageRepo />,document.getElementById("App"));
    } else {
      ReactDOM.render(<Auth />,document.getElementById("App"));
    }
  });
  return (
    <div className="App" id="App"></div>
  );
}

export default App;
