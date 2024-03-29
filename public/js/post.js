import { addOptions, isValidLength } from "./app/form.js";
import {
  CATEGORY,
  URGENCY,
  REQUEST_TYPE,
  REQUEST_STATUS,
} from "./app/request.js";
import rest from "./app/firebase.js";
import { uploadImage } from "./app/image.js";
import { showSuccessModal } from "./app/modal.js";

// initializer
const init = () => {
  // init select options html
  addOptions("select-urgency", URGENCY);
  addOptions("select-category", CATEGORY);

  // activeBootstrapValidation();

  document
    .getElementById("submit-help-post")
    ?.addEventListener("click", (e) => {
      var form = document.querySelectorAll(".needs-validation")[0];
      form.classList.add("was-validated");
      onClickSubmitPost(REQUEST_TYPE.HELP, e);
    });
  document
    .getElementById("submit-volunteer-post")
    ?.addEventListener("click", (e) => {
      var form = document.querySelectorAll(".needs-validation")[0];
      form.classList.add("was-validated");
      onClickSubmitPost(REQUEST_TYPE.VOLUNTEER, e);
    });

  initAddPhoto();
};
window.addEventListener("load", init);

// event function when clicks "Submit" button on the posting page.
const onClickSubmitPost = async (requestType, e) => {
  e.preventDefault();

  // disable submit button
  $(".submit-post").attr("disabled", true);

  let data;
  try {
    const formDom = document.querySelector("form");
    const uid = rest.getUserID();

    data = {
      images: imagesArray,
      user: {
        uid: uid,
      },
      title: formDom.elements["title"]?.value,
      location: formDom.elements["location"]?.value,
      urgency: formDom.elements["urgency"]?.value,
      category: formDom.elements["category"]?.value,
      detail: formDom.elements["detail"]?.value,
      meetup: formDom.elements["meetup"]?.value,
      createdDate: new Date().toLocaleString("en-US", { hour12: false }),
      requestType: requestType,
      status: REQUEST_STATUS.ACTIVE,
    };

    const isValid = checkValidation(data);

    if (isValid) {
      // upload photos on the server and get returned url addresses
      let newImagesArray = [];

      if (imagesArray.length > 0) {
        newImagesArray = await Promise.all(
          imagesArray.map(async (file, index) => {
            const imageUrl = await uploadImage(file);
            return imageUrl;
          })
        );
      }

      data = { ...data, images: newImagesArray };

      submitPost(data, requestType);
    } else {
      // enable submit button
      $(".submit-post").attr("disabled", false);
    }
  } catch (e) {
    console.error(e);

    // enable submit button
    $(".submit-post").attr("disabled", false);
  }
};

/* post images
 * functions that need to select, preview, and upload 5 images.
 */
// input: input element that selects image.
const input = document.getElementById("upload-images");

// output: output elemnts that selected images are loaded.
const output = document.getElementById("upload-output");

// imagesArray: the virtual array list to save selected images
//              to share to select, delete, and post.
let imagesArray = [];

// initializes photo-related functions to attatch required events to buttons
const initAddPhoto = () => {
  if (!input || !output) {
    return false;
  }
  const container = document.getElementsByClassName("add-photo");
  const btn = document.getElementById("btn-add-photo");

  input?.addEventListener("change", () => {
    // Update imagesArray from selected images data
    imagesArray = [...imagesArray, ...input.files].slice(0, 5);

    // Show previews
    displayImages();

    // Update added photos number
    document.getElementsByClassName("add-photo-number")[0].innerHTML =
      imagesArray.length;
  });
};

// displays selected images to preview.
function displayImages() {
  // Insert dynamic elements to preview selected images.
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

  // Bind click events to remove selected preview item.
  const doms = output.getElementsByClassName("thumbnail");
  [...doms].forEach((dom, index) => {
    dom?.addEventListener("click", () => {
      deleteImage(index);
    });
  });
}

// deletes selected image if click "x" button on the preview image.
function deleteImage(index) {
  imagesArray.splice(index, 1);
  displayImages();
}

// Checks validation before posting
const checkValidation = ({
  images = [],
  title = "",
  location = "",
  urgency = "",
  category = "",
  detail = "",
  meetup = "",
}) => {
  let el;
  let isValid = true;
  const inputs = document.querySelectorAll("input");
  try {
    if (images.length < 1) {
      el = { images: images };
      throw el;
    }
    if (!isValidLength(title, 10, 80)) {
      el = "title";
      throw el;
    }
    if (location.length < 1) {
      el = "location";
      throw el;
    }
    if (!urgency) {
      el = "urgency";
      throw el;
    }
    if (!category) {
      el = "category";
      throw el;
    }
    if (!isValidLength(detail, 20)) {
      el = "detail";
      throw el;
    }
    if (!isValidLength(meetup, 10)) {
      el = "meetup";
      throw el;
    }

    return isValid;
  } catch (e) {
    console.warn("invalid field: ", el);
  }
};

const submitPost = async (data, requestType) => {
  // post
  const docID = await rest.postRequest(data);

  // update requests to user
  await rest.updateRequestCreated(docID);

  // show Success modal
  showSuccessModal({
    onShow: () => {
      setTimeout(() => {
        window.location.href = `/request-details?docID=${docID}`;
      }, 1200);
    },
  });
};
