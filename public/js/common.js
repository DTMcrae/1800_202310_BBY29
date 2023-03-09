import { loadSkeleton } from './requestSkeleton.js'
import { loadNav, loadHeader} from "./standardized.js";
// initializer
const init = () => {
  loadSkeleton();
  loadNav();
  loadHeader();
}
window.addEventListener("load", init);
