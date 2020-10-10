import React,{useState, createContext} from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const ToggleApp = createContext();

export const ToggleAppProvider = props => {
    const [disp,setDisp]=useState(false);

    const firebaseConfig = {
        apiKey: "AIzaSyBLNNTFx1dnqvvLgaNUsQLfzfxkCGfXFFI",
        authDomain: "image-repository-15136.firebaseapp.com",
        databaseURL: "https://image-repository-15136.firebaseio.com",
        projectId: "image-repository-15136",
        storageBucket: "image-repository-15136.appspot.com",
        messagingSenderId: "455859015304",
        appId: "1:455859015304:web:b84140c698cf5d15fd193d",
        measurementId: "G-BFBR6YEGF4"
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        var user = firebase.auth().currentUser;
        if (user) {
            // User is signed in.
             setDisp(true);
        } 
        else
            //User is signed out
            setDisp(false);
        }

    return(
    <ToggleApp.Provider value={[disp,setDisp]}>{props.children}</ToggleApp.Provider>
    )
}