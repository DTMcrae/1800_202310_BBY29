firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("main");
  } else {
    console.warn("No user detected.");
  }
});
