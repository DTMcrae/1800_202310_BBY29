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
      // console.log(user.uid);
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
        console.warn("No user is signed in");
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
            // console.log("Document written with ID: ", refID);
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

  return docID;
};
const updateRequestCreated = async (docID) => {
  try {
    const currentUserID = getUserID();

    const userRef = db.collection("users").doc(currentUserID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("User does not exist");
      return;
    }

    const userData = userDoc.data();
    let requestsCreated = userData.requestsCreated || [];

    if (!requestsCreated.includes(docID)) {
      requestsCreated.push(docID);
    }

    await userRef.update({ requestsCreated });
    // console.log("User requests updated successfully");
  } catch (error) {
    console.error("Error updating user requests", error);
  }
};

const updateHelpRequest = async (docID) => {
  try {
    const currentUserID = getUserID();

    const userRef = db.collection("users").doc(currentUserID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("User does not exist");
      return;
    }

    const userData = userDoc.data();
    let helpRequests = userData.helpRequests || [];

    if (!helpRequests.includes(docID)) {
      helpRequests.push(docID);
    }

    await userRef.update({ helpRequests });
    // console.log("User requests updated successfully");
  } catch (error) {
    console.error("Error updating user requests", error);
  }
};
const updateVolunteerRequest = async (docID) => {
  try {
    const currentUserID = getUserID();

    const userRef = db.collection("users").doc(currentUserID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("User does not exist");
      return;
    }

    const userData = userDoc.data();
    let volunteerRequests = userData.volunteerRequests || [];

    if (!volunteerRequests.includes(docID)) {
      volunteerRequests.push(docID);
    }

    await userRef.update({ volunteerRequests });
    // console.log("User requests updated successfully");
  } catch (error) {
    console.error("Error updating user requests", error);
  }
};


export default {
  getUser,
  getUserID,
  onAuthChanged,
  postRequest,
  updateRequestCreated,
};

export {
  getUser,
  getUserID,
  onAuthChanged,
  postRequest,
  updateRequestCreated,
};

