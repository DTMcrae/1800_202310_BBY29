import { loadSkeleton } from './requestSkeleton.js'
import { loadNav, loadHeader1} from "./standardized.js";
import { loadHeader2 } from "./standardized.js";

// initializer
const init = () => {
  loadSkeleton();
  loadNav();
  loadHeader1();
  loadHeader2();
}
window.addEventListener("load", init);
