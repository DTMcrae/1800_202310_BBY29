function logout() {
  firebase.auth().signOut();
  window.location.assign("index");
}
