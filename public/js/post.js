import { addOptions, isValidLength } from "./app/form.js";
import { CATEGORY, URGENCY, REQUEST_TYPE } from "./app/request.js";
import rest from "./app/firebase.js";
import { uploadImage } from "./app/image.js";
import { showSuccessModal } from "./modal.js";

// initializer
const init = () => {
  // init select options html
  addOptions("select-urgency", URGENCY);
  addOptions("select-category", CATEGORY);

  document
    .getElementById("submit-help-post")
    ?.addEventListener("click", () => onClickSubmitPost(REQUEST_TYPE.HELP));
  document
    .getElementById("submit-volunteer-post")
    ?.addEventListener("click", () => onClickSubmitPost(REQUEST_TYPE.VOLUNTEER));

  initAddPhoto();
}
window.addEventListener("load", init);


// event function when clicks "Submit" button on the posting page.
const onClickSubmitPost = async (requestType) => {
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
      createdDate: new Date().toLocaleString(),
      requestType: requestType
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

      data = {...data, images: newImagesArray};

      submitPost(data);
    } else {
      alert("check validation : in dev")
    }

  } catch(e) {
    console.error(e);
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
    console.warn("initAddPhoto: ", input, output);
    return false;
  }
  const container = document.getElementsByClassName("add-photo");
  const btn = document.getElementById("btn-add-photo");

  input.addEventListener("change", () => {
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
    dom.addEventListener("click", () => {
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
  let el = "";
  let isValid = true;
  
  if (images.length < 1) {
    el = "images"
    console.log(images)
    isValid = false;
  }
  if (!isValidLength(title,10, 80)) {
    el = "title"
    isValid = false;
  }
  if (location.length < 1) {
    el = "location"
    isValid = false;
  }
  if (!urgency) {
    el = "urgency"
    isValid = false;
  }
  if (!category) {
    el = "category";
    isValid = false;
  }
  if (!isValidLength(detail, 20)) {
    el = "detail"
    isValid = false;
  }
  if (!isValidLength(meetup, 10)) {
    el = "meetup"
    isValid = false;
  }
  if (!isValid) {
    console.warn(el);
    return false;
  }

  return isValid;
};

const submitPost = async (data) => {
  // post
  const docID = await rest.postRequest(data);

  // update requests to user
  await rest.updateRequests(docID);

  // show Success modal
  showSuccessModal({
    onShow: () => {
      setTimeout(() => {
        window.location.href = `/request-details?docID=${docID}`;
      }, 1200)
    }
  });
};
