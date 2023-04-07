firebase.auth().onAuthStateChanged((user) => {

  //If the user is logged in, redirect them to main
  if (user) {
    window.location.replace("main");
  } else {
    console.warn("No user detected.");
  }
});
