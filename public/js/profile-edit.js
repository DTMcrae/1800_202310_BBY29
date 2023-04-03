import { showSuccessModal } from "./app/modal.js";

var currentUser; //put this right after you start script tag before writing any functions.

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //userDoc is the input value to the callback function
        //get the data fields of the user
        var userName = userDoc.data().name;
        var userEmail = userDoc.data().email;
        var userCity = userDoc.data().city;
        var userPhone = userDoc.data().number;

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("first-name").value = userName.split(" ")[0];
          document.getElementById("last-name").value = userName.split(" ")[1];
        }
        if (userEmail != null) {
          document.getElementById("email").value = userEmail;
        }
        if (userCity != null) {
          document.getElementById("location").value = userCity;
        }
        if (userPhone != null) {
          document.getElementById("phone").value = userPhone;
        }
      });
    } else {
      // No user is signed in.
      console.warn("No user is signed in");
    }
  });
}
//call the function to run it
populateUserInfo();

var btn = document.getElementById("save-changes");

btn.addEventListener("click", saveUserInfoAndRedirect);

function saveUserInfoAndRedirect() {
  //enter code here
  var nameReg = /^[A-Za-z',-]+$/;
  var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  var phoneReg = /^([0-9]{3})+\-([0-9]{3})+\-([0-9]{4})$/;
  var locationReg = /^[A-Za-z0-9',-\s]+$/;
  //a) get user entered values
  let userFirstName = document.getElementById("first-name").value;
  let userLastName = document.getElementById("last-name").value;
  let userEmail = document.getElementById("email").value;
  let userPhone = document.getElementById("phone").value;
  let userCity = document.getElementById("location").value;

  var firstNameValid = true;
  var lastNameValid = true;
  var emailValid = true;
  var phoneValid = true;
  var locationValid = true;

  if (userFirstName.length < 2) {
    document.getElementById("first-name").style.borderColor = "red";
    document.getElementById("first-name-error").innerHTML =
      "Please enter 2 characters minimum";
    firstNameValid = false;
  } else if (!nameReg.test(userFirstName)) {
    document.getElementById("first-name").style.borderColor = "red";
    document.getElementById("first-name-error").innerHTML =
      "Please enter a valid name";
    firstNameValid = false;
  } else {
    document.getElementById("first-name").style.borderColor = "green";
  }

  if (userLastName.length < 2) {
    document.getElementById("last-name").style.borderColor = "red";
    document.getElementById("last-name-error").innerHTML =
      "Please enter 2 characters minimum";
    lastNameValid = false;
  } else if (!nameReg.test(userLastName)) {
    document.getElementById("last-name").style.borderColor = "red";
    document.getElementById("last-name-error").innerHTML =
      "Please enter a valid name";
    lastNameValid = false;
  } else {
    document.getElementById("last-name").style.borderColor = "green";
  }

  if (!userEmail) {
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("email-error").innerHTML =
      "Please fill in this field";
    emailValid = false;
  } else if (!emailReg.test(userEmail)) {
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("email-error").innerHTML =
      "Please enter a valid email";
    emailValid = false;
  } else {
    document.getElementById("email").style.borderColor = "green";
  }

  if (!phoneReg.test(userPhone)) {
    document.getElementById("phone").style.borderColor = "red";
    document.getElementById("phone-error").innerHTML =
      "Please enter a phone number in the format xxx-xxx-xxxx";
    phoneValid = false;
  } else {
    document.getElementById("phone").style.borderColor = "green";
  }

  if (!userCity.match(locationReg)) {
    document.getElementById("location").style.borderColor = "red";
    document.getElementById("location-error").innerHTML =
      "Please enter a valid address";
    document
      .getElementById("autocomplete-container")
      .appendChild(document.getElementById("location-error"));
    locationValid = false;
  } else {
    document.getElementById("location").style.borderColor = "green";
  }

  if (
    !firstNameValid ||
    !lastNameValid ||
    !emailValid ||
    !phoneValid ||
    !locationValid
  ) {
    alert("Please correct the fields in red!");
    return;
  }

  //b) update user's document in Firestore
  currentUser
    .update({
      name: userFirstName + " " + userLastName,
      email: userEmail,
      number: userPhone,
      city: userCity,
    })
    .then(() => {
    //   console.log("Document updated");
      showSuccessModal({
        onClose: () => {
          window.location.href = "profile";
        },
      });
    });
}
