// firebase functions

/* === Common === */
// User
const getUser = () => {
  try {
    const currentUser = firebase.auth().currentUser;
    return currentUser;
  } catch (e) {
    console.error(e);
  }
};

const getUserID = () => {
  try {
    const currentUserID = firebase.auth().currentUser.uid;
    return currentUserID;
  } catch (e) {
    console.error(e);
  }
};

const onAuthChanged = (
  callback = (user) => {}
) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // var uid = user.uid;
      callback(user);
    } else {
      // User is signed out
        console.log("No user is signed in");
    }
  });
  
}

// Post
const post = async (
  collection = "",
  data = {},
  callback = () => {}
  ) => {
  try {
    if (collection?.length < 1) {
      throw "collection is empty";
    }

    onAuthChanged((user) => {
      const currentUser = db.collection("users").doc(user.uid);
      const result = currentUser.get().then((userDoc) => {
        db.collection(collection)
          .add(data)
          .then(() => callback);
      });
      console.log("post", result);
    });
  } catch (e) {
    console.error(e);
  }
};


/* === Request === */
const postRequest = (data, callback) => {
  post("requests", data, () => {
    if (!!callback) {
      callback?.();
    } else {
      // TODO:
      alert("Complete, popup in dev");
      // const popUp = new popUpClass();
      // window.location.href = "/request-detail.html";
    }
  });
};

export default {
  getUser,
  getUserID,
  onAuthChanged,
  post,
  postRequest,
};

export {
  getUser,
  getUserID,
  onAuthChanged,
  post,
  postRequest,
};

