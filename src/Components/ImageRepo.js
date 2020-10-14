// Add useState and useEffect hooks to handle the state 
// and side effects in react functional component
import React, { useState, useEffect } from 'react';
import SnackBar from './SnackBar';
import Card from './Card';
import '../Image.css';

// Add Material-UI components:
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import ImageIcon from '@material-ui/icons/Image';
import TextField from '@material-ui/core/TextField';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

// Add Firebase to the project:
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Tesseract.js - text recognition library
import { createWorker } from 'tesseract.js';
// TensorFlow.js - object ricognition library
import * as mobilenet from '@tensorflow-models/mobilenet';
// Adds the CPU backend to the global backend registry
import '@tensorflow/tfjs-backend-cpu';

// Add utility for constructing className strings conditionally
import clsx from 'clsx';

// Image categories drawer panel width
const drawerWidth = 240;

// Classes for components styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  paper: {
    // height: 140,
    width: 300,
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // Necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  list: {
    width: 300,
  },
  fullList: {
    width: 'auto',
  },
}));


export default function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  // Check to see if the script is being run in a web-page inside a web-browser
  // if yes - display Image Categories panel in the body, if not - hide
  const container = window !== undefined ? () => window().document.body : undefined;


  // REACT STATE HOOKS
  // Let you use state and other React features without writing a class:

  // Declare new state variable mobileOpen and set it to false
  // 'True' indicates that app is opened on mobile device and will ajust the drawer
  // Use setMobileOpen to mutate the mobileOpen state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  // Declare new state variable anchorEl and set it to null
  // Used for drop menu for user to sign out, closed by default
  // Use setAnchorEl to mutate the anchorEl state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Data is for storing details of images:
  // categories stores the labels of left sidebar, 
  // state for right sidebar, 
  // progress -> progress bar, msg -> trigger snackbar 
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [state, setState] = useState({
    right: false,
  });
  const [progress, setProgress] = useState({
    disp: false
  })
  const [msg, setMsg] = useState({
    disp: false
  });

  // Right side slide drawer with image details show/hide 
  const toggleDrawer = (anchor, open, name, url, predictions, text) => (event) => {
    setState({
      right: open, 
      name: name, 
      url: url, 
      predictions: predictions, 
      text: text 
    });
  };
  

  // REACT EFFECT HOOK - similar to componentDidMount and componentDidUpdate:
  // Load user data after component loads
  useEffect(() => { 
    var db = firebase.firestore();
    var userId = firebase.auth().currentUser.uid;
    db.collection("images").doc(userId).get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          var tempCategories = [];
          for (var i = 0; i < doc.data().img.length; i++){
            tempCategories=tempCategories.concat(doc.data().img[i].predictions.split(', '));
          }
          tempCategories = Array.from(new Set(tempCategories));
          setCategories(tempCategories);
          setData(doc.data().img);
          var userId=firebase.auth().currentUser.uid;
          // register onChange listener
          db.collection("images").doc(userId)
            .onSnapshot(function(doc) {
              var tempCategories = [];
              for (var i = 0; i < doc.data().img.length; i++){
                tempCategories=tempCategories.concat(doc.data().img[i].predictions.split(', '));
              }
              tempCategories = Array.from(new Set(tempCategories));
              setCategories(tempCategories);
              setData(doc.data().img);
            });
      } else {
          console.log("No such document!");
          var userId = firebase.auth().currentUser.uid;
          db.collection("images").doc(userId).set({
            img: ""
          }).then(function(){
            // register onChange listener
            db.collection("images").doc(userId)
            .onSnapshot(function(doc) {
              var tempCategories = [];
              for (var i = 0; i < doc.data().img.length; i++){
                tempCategories = tempCategories.concat(doc.data().img[i].predictions.split(', '));
              }
              tempCategories = Array.from(new Set(tempCategories));
              setCategories(tempCategories);
              setData(doc.data().img);
            });
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  },[]); // If you keep array empty effect will only run in mount and unmount

  // Use setMobileOpen to mutate the mobileOpen state
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Use setAnchorEl to mutate sign out drop menu state
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Use setAnchorEl to mutate sign out drop menu state
  const handleClose = () => {
    setAnchorEl(null);
  };


  // Display list of Image Categories
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem button>
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary="Image Categories" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {categories.map((text, index) => (
          <ListItem 
            button key={text} 
            // List only the categories from search input
            onClick={() => {
              document.getElementById("search").value = text;
              document.getElementById("search").focus();
              search(text, true)
            }}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );


  // Display slider drawer with image details
  const list = (anchor) => (
    <div className={clsx(classes.list, {
      [classes.fullList]: anchor === 'top' || anchor === 'bottom',})}>
      <div className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',})}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
        <Divider />
        <List>
          <ListItem button>
            <img src={state.url} width="150px" height="150px" alt={state.name} style={{marginLeft: "60px", border: "2px solid black"}} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={"Name: " + state.name} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={"Predictions: " + state.predictions} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={"Text: " + state.text} />
          </ListItem>
        </List>
      </div>
      <Divider />
      <ListItem button>
        <a href={state.url} target="_blank" rel="noopener noreferrer">
          <ListItemText primary="View Image" />
        </a>
      </ListItem>
    </div>
  );


  // Select file to upload
  function selectFiles(){
    var files = document.getElementById("selectFiles").files;
    for (var i = 0; i < files.length; i++){
        uploadFile(files[i]);
    }
  }


  // Upload file to the Firebase storage and call label() on it
  // label() will classify image and upload image data to db
  function uploadFile(file){
    setProgress({disp: true, msg: "Upload started..."});
    var userId = firebase.auth().currentUser.uid;
    var storageRef = firebase.storage().ref();
    var ImageRef = storageRef.child(userId + '/' + file.name);
    ImageRef.put(file).then(function(snapshot) {
      // console.log('Uploaded a blob or file!');
      ImageRef.getDownloadURL().then(function(url){
        // console.log(url);
        // label(url, file, "", true);
        ocr(url, file);
      })
    });
  }

  
  // Tesseract.js OCR (Optical character recognition) text recognition layer
  function ocr(url, file){
    setProgress({disp: true, msg: "Performing OCR on the image..."});
    console.log("url", url);
    console.log("hi from ocr()");
    const worker = createWorker({
      logger: m => console.log(m)
    });

    (async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // const { data: { text } } = await worker.recognize(url);
    await worker.terminate();
    
    label(url, file, "", true);
    })();
  }

  
  // Label an image using Tensorflow mobilenet model and upload/search by its keywords
  async function label(url, file, text, searchType) {
    setProgress({disp: true, msg: "Classifying the image..."});
    // console.log("hi from label()"); console.log(file);

    // Convert a File() to Image() for Tensorflow.js
    var ur = URL.createObjectURL(file),img = new Image();                         
    img.onload = function() {                    
        URL.revokeObjectURL(this.src);             
    };
    img.src = ur;  
    // Load mobilenet model
    const model = await mobilenet.load();
    // Classify the image
    const predictions = await model.classify(img);
    // console.log(predictions);

    if (!searchType)
      // If this is a search by image
      searchImage(predictions);
    else
      // if this is upload image - write data to Firebase db
      uploadData(url, file, text, predictions);
  }

  
  // Upload data to Firebase
  function uploadData(url, file, text, predictions){
    // console.log(url);console.log(text);console.log(predictions);

    // str is a string variable representing the class or 
    // space-separated classes of the predictions element.
    var str = predictions[0].className;
    for (var i = 1; i < predictions.length; i++)
      str = str + ", " + predictions[i].className;

    // Set up the date
    var d = new Date();
    var m = d.getMonth() + 1;
    d = d.getDate() + "-" + m + "-" + d.getFullYear();

    // Retrieve the image data
    const temp = {
      url: url,
      text: text,
      predictions: str,
      name: file.name,
      date: d
    };
    // Add new data to user data
    const tempData = [...data];
    tempData.push(temp);
    setData(tempData);

    // Add data to the Firebase
    var db = firebase.firestore();
    var userId = firebase.auth().currentUser.uid;
    db.collection("images").doc(userId).set({
      img: tempData
    }).then(function() {
      // console.log("Document successfully written!");
      setMsg({disp: true, severity: "success", message: "Data analysed successfully!"});
      setProgress({disp: false});
    })
    .catch(function(error) {
      // console.error("Error writing document: ", error);
      setMsg({disp: true, severity: "error", message: "Error analysing image!"});
      setProgress({disp: false});
    });
  }
  

  // Search image by predictions
  function searchImage(predictions){
    setProgress({disp: false});
    // console.log(predictions);
    var searchStr = predictions[0].className;
    for (var i = 1; i < predictions.length;i ++)
       searchStr += ", " + predictions[i].className;
    document.getElementById("search").value = searchStr;
    search(searchStr, false);
  }


  // Returns all the items or only searched items
  function search(text, searchType){
    // console.log(text);
    // returns an array-like object of all child elements of the given class
    var docs = document.getElementsByClassName("metadatasearch");
    var holder = document.getElementsByClassName("metadataholder");
    // console.log(docs);
    for (var i = 0; i < docs.length; i++){
      // textContent gets the content of all elements
      // innerText only shows “human-readable” elements
      var txtValue = docs[i].textContent || docs[i].innerText;
      var textArray = text.split(', ');
      var res = false;
      for (var j = 0; j < textArray.length; j++)
        // If searchType is true - check existing bata for each serch query
        if (searchType){
          if (txtValue.toLowerCase().includes(textArray[j].toLowerCase())){
            res = true;
          } else {
            res = false;
            break;
          }
        // If searchType is false - return all the data
        } else {
          if (txtValue.toLowerCase().includes(textArray[j].toLowerCase()))
            res = true;
        }
      if (res){
        holder[i].style.display = "";
      } else {
        holder[i].style.display = "none";
      }
    }
  }


  // Delete image from Firebase storage
  function deleteItem(index){
    // console.log("hi from delete");
    var temp = [...data];
    var tempData = temp[index].name;
    temp.splice(index,1);
    setData(temp);
    var db = firebase.firestore();
    var userId = firebase.auth().currentUser.uid;
    db.collection("images").doc(userId).set({
      img: temp
    }).then(function() {
      // console.log("Document successfully written!");
      firebase.storage().ref().child(userId + "/" + tempData).delete().then(function(){
        setMsg({disp: true, severity: "success", message: "Data deleted successfully!"});
      });
    })
    .catch(function(error) {
    // console.error("Error writing document: ", error);
      setMsg({disp: true, severity: "error", message: "Data deletion unsuccessful"});
    });
  }


  // Sign out
  function signOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful
    }).catch(function(error) {
      // An error happened
    });
  }


  return (
    <div>
      <div className={classes.root}>
        {/* CssBaseline component kickstarts consistent baseline to build upon. */}
        <CssBaseline />

        {/* App Bar */}
        <AppBar position="fixed" className={classes.appBar} >
          <Toolbar>
            {/* Menu button in the mobile view mode */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}>
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography variant="h5" noWrap>
              <i>imagify </i>
            </Typography>

            {/* User icon button for drop menu to sign out */}
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}>
                <MenuItem onClick={handleClose}>
                  {firebase.auth().currentUser.email}
                </MenuItem>
                <MenuItem onClick={signOut}>
                  Sign Out
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      
        {/* Image Categories Panel */}
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

          {/* In the mobile view -> temporary */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container} 
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // better open performance on mobile
              }}>
              {drawer} {/* displays list of Image Categories */}
            </Drawer>
          </Hidden>

          {/* In the web view -> permanent */}
          <Hidden xsDown implementation="css">
            <Drawer
             classes={{paper: classes.drawerPaper,}}
             variant="permanent"
             open>
              {drawer} {/* displays list of Image Categories */}
            </Drawer>
          </Hidden>
        </nav>

        {/* Main Field */}
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            {/* Search menu bar item (elevated box) */}
            <Paper>
              <div >
                <Grid container spacing={1} alignItems="flex-end" justify="center">

                  {/* 'Search image' icon grid item */}
                  <Grid item>
                    <ImageSearchIcon />
                  </Grid>

                  {/* 'Search by query' text field grid item */}
                  <Grid item>
                    <TextField 
                     id="search" 
                     label="Search" 
                     placeholder="Please enter a search query" 
                     InputLabelProps={{shrink: true,}} 
                     style={{width: "500px"}} 
                     onKeyUp={event => search(event.target.value, true)}/>
                    
                    {/* 'Search by image' input */}
                    <input 
                     accept="image/jpg, image/svg, image/jpeg, image/png" 
                     style={{display: "none"}} 
                     id="icon-button-file" 
                     type="file" 
                     onChange={event => label("", event.target.files[0], "", false)} />

                    {/* 'Search by image' button label */}
                    <label htmlFor="icon-button-file">
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <Tooltip title="Search similar images">
                          <PhotoCamera />
                        </Tooltip>
                      </IconButton>
                    </label>
                  </Grid>
                    
                  {/* Info bar item */}
                  <Typography variant="h7" noWrap>
                    {"Please enter a search query in the search field (multiple queries should be comma-separated, eg: `cat, grass` with no trailing commas)"}
                  </Typography>
                </Grid>
              </div>
            </Paper>  
            <br/><br/>   

            {/* Progress bar item */}
            <Paper>
              {progress.disp && 
              <div>
                <LinearProgress color="secondary" />
                  <i>{progress.msg}</i>
              </div>
              }
            </Paper>      
            <br/>

            {/* Image card items list */}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                {data.length ? data.map((inputfield, index) => (
                  <Grid key={index} item className="metadataholder">
                    <Paper className={classes.paper} >
                      <Card 
                        name={inputfield.name} 
                        url={inputfield.url} 
                        date={inputfield.date} 
                        predictions={inputfield.predictions} 
                        text={inputfield.text} 
                        onHome={()=>deleteItem(index)} 
                        onDetails={toggleDrawer("right", true, inputfield.name, inputfield.url, inputfield.predictions, inputfield.text)} />
                    </Paper>
                  </Grid>
                  )) : <p>No Images found</p>
                }
              </Grid>
            </Grid>
            
            {/* Select file to upload */}
            <input 
             type="file" 
             id="selectFiles" 
             accept="image/jpg, image/svg, image/jpeg, image/png" 
             style={{display: "none"}} 
             onChange={() => selectFiles(this)} />

            {/* Cloud icon for upload */}
            <Fab 
             color="primary" 
             aria-label="add" 
             id="upload" 
             onClick={() => {document.getElementById("selectFiles").click()}}>
              <CloudUploadIcon /> 
            </Fab>        
          </Typography>
        </main>

        {/* Slider drawer with image details */}
        <Drawer 
         anchor={"right"} 
         open={state["right"]} 
         onClose={toggleDrawer("right", false)}>
          {list("right")}
        </Drawer>
      </div>

      {/* Snackbar provide brief messages about app 
      processes at the bottom of the screen. */}
      {msg.disp && 
      <SnackBar 
       message={msg.message} 
       severity={msg.severity} 
       onHome={() => {setMsg({disp: false})}} />}
    </div>
  );
};