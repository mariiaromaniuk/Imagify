import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import SnackBar from './SnackBar';

// Add Material-UI components:
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

// Add Firebase to the project:
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Styling of the components
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://content.foto.my.mail.ru/mail/vvv.mary/_myphoto/h-67.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'left',
  },
  palette: {
    primary: {
      main: '#fefbe3',
    },
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.grey[100],
  },
}));

export default function SignInSide(){
  const classes = useStyles();
  const [mode, setMode] = useState(true);
  const [msg, setMsg] = useState({
    disp: false
  });

  // Log in an user to the app
  function signIn(){
    // Display linear progress bar while DOM is rendering
    ReactDOM.render(<LinearProgress />, document.getElementById("progress"));
    // Firebase authenticate using password-based accounts
    firebase.auth().signInWithEmailAndPassword(
      // retrieve email
      document.getElementById("email").value, 
      // retrieve password
      document.getElementById("password").value)
      .catch(function(error){
      // handle errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      // progress bar
      setMsg({
        disp: true,
        message: errorMessage,
        severity: "error"
      });
      ReactDOM.render("", document.getElementById("progress"));
    });
  }

  // Sign up a user for the app
  function register(){
    // Check if passwords match
    if (document.getElementById("password").value !== document.getElementById("password1").value){
      setMsg({
        disp: true,
        severity: "error",
        message: "The passwords don't match!"
      });
      return;
    }
    // Display linear progress bar while DOM is rendering
    ReactDOM.render(<LinearProgress />, document.getElementById("progress"));
    // Firebase authenticate using password-based accounts
    firebase.auth().createUserWithEmailAndPassword(
      // retrieve email
      document.getElementById("email").value, 
      // retrieve password
      document.getElementById("password").value).catch(function(error){
      // handle Errors here
      var errorCode = error.code;
      var errorMessage = error.message;
      setMsg({
        disp: true,
        message: errorMessage,
        severity: "error"
      });
      ReactDOM.render("", document.getElementById("progress"));
    });
  }

  // UI controller 
  function signUp(){
    // mode true => sign in
    if (mode) setMode(false);
    // mode false => sign up
    else setMode(true);
  }

  return (
    <div>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>

          <Typography variant="h6" gutterBottom>
            {"Welcome to your personal image library!"}
          </Typography>

          <Avatar className={classes.avatar}>
            <Typography component="h1" variant="h5">
            </Typography>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {mode && "Sign In"}
            {!mode && "Sign Up"}
          </Typography>
          
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            { !mode && <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password1"
              autoComplete="current-password"
            />}
            <div id="progress"></div>
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={mode ? signIn : register}
            >
              {mode && "Sign In"}
              {!mode && "Sign Up"}
            </Button>
            
            <Grid item>
                <Link onClick={signUp} variant="body2">
                  {mode && "Don't have an account? Sign Up"}
                  {!mode && "Sign In instead!"}
                </Link>
              </Grid>
          </form>
        </div>
      </Grid>
    </Grid>

    {/* Snackbar provide brief messages about app 
    processes at the bottom of the screen. */}
    {msg.disp && <SnackBar message={msg.message} severity={msg.severity} onHome={() => {setMsg({disp: false})}} />}
    </div>
  );
}
