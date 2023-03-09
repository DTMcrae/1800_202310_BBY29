import { addOptions } from "./app/form.js";
import { CATEGORY, URGENCY } from "./app/request.js";

// initializer
window.onload = function () {
  addOptions("select-urgency", URGENCY);
  addOptions("select-category", CATEGORY);

  document
    .getElementById("submit-post")
    ?.addEventListener("click", onClickSubmitPost);

  initAddPhoto();
};

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

  if (isValid) {
    submitPost(data);
  }
}

const input = document.getElementById("upload-images");
const output = document.getElementById("upload-output");
let imagesArray = [];

const initAddPhoto = () => {
  if(!input || !output) {
    console.log(input, output)
    return false;
  }
  const container = document.getElementsByClassName("add-photo");
  const btn = document.getElementById("btn-add-photo");

  input.addEventListener("change", () => {
    // Update imagesArray from selected images data
    imagesArray = [...imagesArray,...input.files].slice(0,5);
    console.log("imagesArray",imagesArray)

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
  let isValid = true;

  return isValid;
};

// TODO
const submitPost = ({
  images,
  title,
  location,
  urgency,
  category,
  detail,
  meetup,
}) => {
  console.log(images,title,location)


  // alert("Submit, popup in dev");
  // const popUp = new popUpClass();
  // console.log("submit");
};
