import { loadSkeleton } from './requestSkeleton.js'
import { loadNav, loadHeader1} from "./standardized.js";
import { loadHeader2 } from "./standardized.js";

function loginCheck (){ 
  var path = window.location.href.split('/').pop();

firebase.auth().onAuthStateChanged(user => {
  // Check if user is signed in:
  if ((!user) && path !== 'login' && path !== 'index') {
    console.log("not logged in");
    window.location.href = "login";
  console.log(path);
  }
})}

loginCheck();

// initializer
const init = () => {
  loadSkeleton();
  loadNav();
  loadHeader1();
  loadHeader2();
}
window.addEventListener("load", init);
