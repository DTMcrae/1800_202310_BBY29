function insertNameFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
     // Go to to the firestore and go to the document of the user
      currentUser = db.collection("users").doc(user.uid); 
      currentUser.get().then((userDoc) => {
        //get the user name and profile picture URL 
        var userName = userDoc.data().name;
        var userPicURL = userDoc.data().pfpURL;
        
        //$("#name-goes-here").text(userName); //jquery
        document.getElementById("username").innerText =
          userName.split(" ")[0] + "!";

        //If no profile picture URL is available, set to default image
        if (userPicURL != null) {
          var image = document.getElementById("profile-image");
          image.setAttribute(
            "src",
            userPicURL || "/img/placeholder-profile.png"
          );
        }
      });
    }
  });
}
insertNameFromFirestore();
