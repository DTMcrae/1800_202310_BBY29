import { addOptions } from "./app/form.js";
import { CATEGORY, URGENCY } from "./app/request.js";

// initializer
window.onload = function () {
  // update htmls
  addOptions("select-urgency", URGENCY);
  addOptions("select-category", CATEGORY);

  document
    .getElementById("submit-post")
    .addEventListener("click", onClickSubmitPost);

  initAddPhoto();
};

function onClickSubmitPost() {
  const formDom = document.getElementById("form-post-request");

  const elements = {
    images: [],
    title: formDom.elements["title"],
    location: formDom.elements["location"],
    urgency: formDom.elements["urgency"],
    category: formDom.elements["category"],
    detail: formDom.elements["detail"],
    meetup: formDom.elements["meetup"],
  };

  const isValid = postingValidation(elements);

  if (isValid) {
    submitPost();
  } else {
    // TODO
  }
}

const input = document.getElementById("upload-images");
const output = document.getElementById("upload-output");
let imagesArray = [];

const initAddPhoto = () => {
  const container = document.getElementsByClassName("add-photo");
  const btn = document.getElementById("btn-add-photo");

  input.addEventListener("change", () => {
    // Update imagesArray from selected images data
    const files = [...input.files].slice(0, 5);
    for (let i = 0; i < files.length; i++) {
      imagesArray.push(files[i]);
    }

    // Show previews
    displayImages();

    // Update added photos number
    document
      .getElementsByClassName("add-photo-number")[0]
      .innerHTML = imagesArray.length;
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

const postingValidation = ({
  images,
  title,
  location,
  urgency,
  category,
  detail,
  meetup,
}) => {
  let isValid = false;

  return isValid;
};

const submitPost = () => {
  const popUp = new popUpClass();
  console.log("submit");
};
