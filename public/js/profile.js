var currentUser;   //put this right after you start script tag before writing any functions.

function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {

      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid)
      //get the document for current user.
      currentUser.get()
        .then(userDoc => { //userDoc is the input value to the callback function 
          //get the data fields of the user
          var userName = userDoc.data().name;
          var userEmail = userDoc.data().email;
          var userCity = userDoc.data().city;
          var userPhone = userDoc.data().number;
          var userPicURL = userDoc.data().pfpURL;

          //if the data fields are not empty, then write them in to the form.
          if (userName != null) {
            document.getElementById("username").innerText = userName;
            document.getElementById("card-username").innerText = userName;
          }
          if (userEmail != null) {
            document.getElementById("email").innerHTML = userEmail;
          }
          if (userCity != null) {
            document.getElementById("location").innerHTML = userCity;
            document.getElementById("card-location").innerHTML = userCity;
          }
          if (userPhone != null) {
            document.getElementById("phone").innerHTML = userPhone;
          }
          if (userPicURL != null){
            var image = document.getElementById("profile-image");
            image.setAttribute('src', userPicURL || "/img/placeholder-profile.png");
          }
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it 
populateUserInfo();


