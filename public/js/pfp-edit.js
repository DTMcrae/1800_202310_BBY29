var storageRef = firebase.storage().ref();

var currentUser;

var loadFile = function (event) {
  var image = document.getElementById("profile-image");
  file = event.target.files[0];
  
  if (file !== undefined && file.type === ("image/png" || "image/jpeg" || "image/jpg")) {

    image.src = URL.createObjectURL(event.target.files[0]);
    let fileName = file.name;
    firebase.auth().onAuthStateChanged(user => {
      // Check if user is signed in:
      if (user) {
        let userID = user.uid;
        currentUser = db.collection("users").doc(user.uid);
        currentUser.set({
          pfpURL: ""
        }, {merge: true})
        .then(()=>{ console.log("New field for pfpURL added!");
      })
        storageRef.child(`${userID}/images/${fileName}`).put(file).then((snapshot) => {
          console.log("Uploaded a file!");
          storageRef.child(`${userID}/images/${fileName}`).getDownloadURL().then((url) => {
            currentUser.update({         
              pfpURL: url
            })
          })
        });
      } else {
        // No user is signed in.
        console.log("No user is signed in");
      }
    });
  } else {
    alert("Not an image!");
  }
};

