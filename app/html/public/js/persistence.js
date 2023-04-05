firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("main.html");
  } else {
    console.warn("No user detected.");
  }
});
