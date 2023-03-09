import { addOptions, isValidLength } from "./app/form.js";
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
  if (!location(title,1,20)) {
    return false;
  }


  isValid = true;
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
  console.log(
    images,
    title,
    location,
    urgency,
    category,
    detail,
    meetup);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        db.collection("requests")
          .add({
            images: images,
            title: title,
            location: location,
            urgency: urgency,
            category: category,
            detail: detail,
            meetup: meetup,
          })
          .then(() => {
            alert("Submit, popup in dev");
            // const popUp = new popUpClass();
            // console.log("submit");
            // window.location.href = "/request-detail.html"; 
          });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "review.html";
    }
  });

};
