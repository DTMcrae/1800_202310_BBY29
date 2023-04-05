var storageRef = firebase.storage().ref();

var currentUser;

var loadFile = function (event) {
  var image = document.getElementById("profile-image");
  file = event.target.files[0];

  if (
    (file !== undefined && file.type === "image/jpeg") ||
    file.type === "image/jpg" ||
    file.type === "image/png" ||
    file.type === "image/gif" 
  ) {
    image.src =
      URL.createObjectURL(event.target.files[0]) ||
      "/img/placeholder-profile.png";
    let fileName = file.name;
    firebase.auth().onAuthStateChanged((user) => {
      // Check if user is signed in:
      if (user) {
        let userID = user.uid;
        currentUser = db.collection("users").doc(user.uid);
        //Creates a new field for pfpURL
        currentUser
          .set(
            {
              pfpURL: "",
            },
            { merge: true }
          )
          .then(() => {
            // console.log("New field for pfpURL added!");
          });
        //Uploads file to Firebase storage under userID/images/filename
        storageRef
          .child(`${userID}/images/${fileName}`)
          .put(file)
          .then((snapshot) => {
            // console.log("Uploaded a file!");
            //Grabs download URL of image and stores it under pfpURL field in userDoc
            storageRef
              .child(`${userID}/images/${fileName}`)
              .getDownloadURL()
              .then((url) => {
                currentUser.update({
                  pfpURL: url,
                });
              });
          });
      } else {
        // No user is signed in.
        console.warn("No user is signed in");
      }
    });
  } else {
    alert("Not an image!");
  }
};
