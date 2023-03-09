import { loadSkeleton } from './requestSkeleton.js'
import { loadNav } from "./standardized.js";
import { loadHeader } from "./standardized.js";

// initializer
window.onload = function() {
  loadSkeleton();
  loadNav();
  loadHeader();
};

