import { addOptions, isValidLength } from "./app/form.js";
import { CATEGORY, URGENCY } from "./app/request.js";
import rest from "./firebase.js";

// initializer
const init = () => {
  addOptions("select-urgency", URGENCY);
  addOptions("select-category", CATEGORY);

  document
    .getElementById("submit-post")
    ?.addEventListener("click", onClickSubmitPost);

  initAddPhoto();
}
window.addEventListener("load", init);

function onClickSubmitPost() {
  const formDom = document.querySelector("form");

  const data = {
    images: imagesArray,
    title: formDom.elements["title"]?.value,
    location: formDom.elements["location"]?.value,
    urgency: formDom.elements["urgency"]?.value,
    category: formDom.elements["category"]?.value,
    detail: formDom.elements["detail"]?.value,
    meetup: formDom.elements["meetup"]?.value,
  };

  const isValid = checkValidation(data);

  // if (isValid) {
  if (true) {
    submitPost(data);
  } else {
    alert("check validation : in dev")
  }
}

const input = document.getElementById("upload-images");
const output = document.getElementById("upload-output");
let imagesArray = [];

const initAddPhoto = () => {
  if (!input || !output) {
    console.warn("initAddPhoto: ", input, output);
    return false;
  }
  const container = document.getElementsByClassName("add-photo");
  const btn = document.getElementById("btn-add-photo");

  input.addEventListener("change", () => {
    // Update imagesArray from selected images data
    imagesArray = [...imagesArray, ...input.files].slice(0, 5);
    console.log("imagesArray", imagesArray);

    // Show previews
    displayImages();

    // Update added photos number
    document.getElementsByClassName("add-photo-number")[0].innerHTML =
      imagesArray.length;

  });
};

function displayImages() {
  // Insert dynamic elements to preview selected images
  let images = "";
  imagesArray.forEach((image, index) => {
    images += `<button type="button" class="thumbnail" index=${index}>
    <img src="${URL.createObjectURL(image)}" class="thumbnail-img" alt="${
      image.name
    }">
    <span class="thumbnail-delete">&times;</span>
  </button>`;
  });
  output.innerHTML = images;

  // Bind click events to remove selected preview item
  const doms = output.getElementsByClassName("thumbnail");
  [...doms].forEach((dom, index) => {
    dom.addEventListener("click", () => {
      deleteImage(index);
    });
  });
}

function deleteImage(index) {
  imagesArray.splice(index, 1);
  displayImages();
}

// TODO
const checkValidation = ({
  images = [],
  title = "",
  location = "",
  urgency = "",
  category = "",
  detail = "",
  meetup = "",
}) => {
  let isValid = false;
  if (!isValidLength(title,2,50)) {
    return false;
  }
  if (!isValidLength(location,1,20)) {
    return false;
  }


  isValid = true;
  return isValid;
};

// TODO
const submitPost = (data) => {
  console.log(firebase,data);
  rest.postRequest(data);
};
