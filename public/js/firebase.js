// firebase functions

/* === Common === */
// Post
const post = async (collection = "", data = {}, callback = () => {}) => {
  try {
    if (collection?.length < 1) {
      throw "collection is empty";
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const currentUser = db.collection("users").doc(user.uid);
        const userID = user.uid;
        //get the document for current user.
        const result = currentUser.get().then((userDoc) => {
          db.collection(collection)
            .add(data)
            .then(() => callback);
        });
        console.log("post", result);
      } else {
        console.log("No user is signed in");
      }
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
  post,
  postRequest,
};
