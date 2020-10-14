# Imagify
Welcome to Imagify, your own library of images, which helps you to add, delete and classify images into groups. The App is built using React.js, Node.js, Firebase Database and Authentication, Tesseract.js, Tensorflow.js, and Material-UI.  
![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo.png)

## Algorithm/Features
- The images chosen by a user are uploaded to Firebase Storage - Google Cloud Platform storage buckets. To choose an image, hover to the cloud button at the bottom right position.
- The Image is passed through [TesseractJS](https://tesseract.projectnaptha.com/) to identify characters (OCR).
- The Image is then passed through [TensorflowJS's MobileNet Image Classification model](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) to get labels related to the image.
- The data collected from the above two steps is uploaded to Firestore database (NoSQL).
- To search image labels, type a search term in the search box (multiple queries, should be comma separated, eg: "cat, grass" with no trailing commas).
- A list of identified labels appears on the left sidebar, which on clicking, shows the images corresponding to the clicked label.
- The images can also searched on the basis of another chosen image, to those the image query, click on the camera button next to the search bar.
- The images can be deleted from the library by clicking the `Delete` button corresponding to an image.
- Information about images can be retreived by clicking the `Details` button corresponding to an image.

## Use a production Version
The production version is hosted [here](https://image-repository-15136.web.app/)

## Use the development Version
- Make sure, the latest version of Node and NPM are installed.
- Clone the project.
- Install the necessary NPM dependencies using `npm install`.
- [Create](https://firebase.google.com/docs/web/setup) a Firebase project and integrate the App with the Firebase project.
- Place the Firebase config in Image-Repository/FirebaseConfig.js in the following format:
```js
var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};

export default firebaseConfig;
```
- To start the project, use `npm start`.

## Screenshots
| ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo1.png)  | ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo2.png)  |
|---|---|
| ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo3.png)  | ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo4.png)  |  
|---|---|
| ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo5.png)  | ![](https://github.com/mariiaromaniuk/Image-Repository/blob/master/images/demo6.png)  | 


### Notes!
- The app uses TensorflowJS MobileNet's pretrained model which only use browser resources instead of a GPU, so the performance may be a bit lower, as compared to **paid** cloud solutions like Google Cloud Vision, Amazon Rekognition or Azure Computer Vision.
- **Only for the users testing the development version** - While running `npm run build`, The user may face issues in the production version (not the currently hosted version), please refer [this](https://github.com/tensorflow/tfjs/issues/3384#issuecomment-667607535) to fix the Tensorflow issue.
