firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("main");
  } else {
    console.log("No user detected.");
  }
});