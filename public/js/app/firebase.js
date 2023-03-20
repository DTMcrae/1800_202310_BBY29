// firebase functions

/* === Common === */
// User
const getUser = () => {
  try {
    
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
      return currentUser
    }

    onAuthChanged((user) => {
      currentUser = user;
      console.log(user.uid);
    });
  } catch (e) {
    console.error(e);
  }
};

const getUserID = () => {
  try {
    const currentUserID = getUser().uid;
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

// Common
const add = async (
  collection = "",
  data = {},
) => {
  try {
    if (collection?.length < 1) {
      throw "collection is empty";
    }

    return new Promise((resolve, reject) => {
      onAuthChanged((user) => {
        db.collection(collection).add(data)
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
  } catch (e) {
    console.error(e);
  }
};


/* === Request === */
// post a request and return docID
const postRequest = (data, callback) => {
  // save docID to return
  const docID = add("requests", data);
  console.log('sfsfs',docID)

  return docID;
};

const updateRequests = async (docID) => {
  try {
    const currentUserID = getUserID();

    const userRef = db.collection("users").doc(currentUserID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("User does not exist");
      return;
    }

    const userData = userDoc.data();
    let requests = userData.requests || [];

    if (!requests.includes(docID)) {
      requests.push(docID);
    }

    await userRef.update({ requests });
    console.log("User requests updated successfully");
  } catch (error) {
    console.error("Error updating user requests", error);
  }
};


export default {
  getUser,
  getUserID,
  onAuthChanged,
  postRequest,
  updateRequests,
};

export {
  getUser,
  getUserID,
  onAuthChanged,
  postRequest,
  updateRequests,
};

