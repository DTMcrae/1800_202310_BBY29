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

// Post and return docID 
const post = async (
  collection = "",
  data = {},
  callback = () => {}
  ) => {
  try {
    if (collection?.length < 1) {
      throw "collection is empty";
    }

    let refID;

    return new Promise((resolve, reject) => {
      onAuthChanged((user) => {
        const currentUser = db.collection("users").doc(user.uid);
        currentUser.get().then((userDoc) => {
          db.collection(collection)
            .add(data)
            .then((docRef) => {
              const refID = docRef.id;
              console.log("Document written with ID: ", refID);
              resolve(refID);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
              reject(error);
            });
        });
      });
    });
  } catch (e) {
    console.error(e);
  }
};


/* === Request === */
// post a request and return docID
const postRequest = (data, callback) => {
  const docID = post("requests", data, () => {
    callback?.();
  });
  return docID;
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

