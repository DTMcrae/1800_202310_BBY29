var storageRef = firebase.storage().ref();


var loadFile = function (event) {
  var image = document.getElementById("profile-image");
  image.src = URL.createObjectURL(event.target.files[0]);
  file = event.target.files[0];
  let fileName = file.name;

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      let userID = user.uid;
      storageRef.child(`${userID}/images/${fileName}`).put(file).then((snapshot) => {
        console.log("Uploaded a file!");
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
};

