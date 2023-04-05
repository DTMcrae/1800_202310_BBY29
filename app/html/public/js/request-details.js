import { getUserID } from "./app/firebase.js";
import { showSuccessModal } from "./app/modal.js";
import { REQUEST_STATUS } from "./app/request.js";

// initializer
const init = () => {
  // Displays content
  displayRequestInfo();
};
window.addEventListener("load", init);

// Activate or deactivate settings and buttons
firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  const params = new URL(window.location.href); //get URL of search bar
  const ID = params.searchParams.get("docID"); //get value for key "id"

  db.collection("requests")
    .doc(ID)
    .get()
    .then((doc) => {
      const acceptButton = document.querySelector(".requestButton");
      const cancelButton = document.querySelector(".cancelButton");

      // console.log(doc.data());

      if (
        doc.data().status === REQUEST_STATUS.ARCHIVED ||
        doc.data().status === REQUEST_STATUS.CANCELED
      ) {
        showClosed();
        removeSetting();
        return;
      }

      try {
        const acceptedUsers = doc.data().usersAccepted;

        /* My request */
        // If this is my request
        if (doc.data().user.uid == user.uid) {
          cancelButton?.remove();
          acceptButton?.remove();
          showSetting();

          const archiveNode = document.getElementById("btn-archive-request");
          const deleteNode = document.getElementById("btn-delete-request");

          archiveNode?.addEventListener("click", onClickArchive);
          deleteNode?.addEventListener("click", onClickDelete);

          return;
        }

        /* Others' request */
        document.getElementById("box-buttons").classList.remove("hide");
        removeSetting();

        // If this is an others' request I accepted
        if (acceptedUsers?.includes(user.uid)) {
          // console.log("User is present in acceptedUsers");
          acceptButton.innerHTML = "Open Chat";

          cancelButton?.addEventListener("click", () => {
            AbandonRequest(user.uid, ID);
          });
          try {
            db.collection("chatrooms")
              .get()
              .then((chatrooms) => {
                chatrooms.forEach((chatroom) => {
                  // console.log(user.uid);
                  // console.log(chatroom.data().userID);

                  if (
                    chatroom.data().requestID == ID &&
                    chatroom.data().userID.includes(user.uid)
                  ) {
                    acceptButton.setAttribute(
                      "href",
                      "./chatroom.html?docID=" + chatroom.id
                    );
                    return;
                  }
                });
              });
          } catch (e) {
            console.error(e);
            //chatroom collection does not exist
            console.log("Chatroom collection does not exist!!!");
            if (cancelButton != null) cancelButton.remove();
          }

          return;
        }

        // If this is an others' request I didn't accept
        cancelButton?.remove();
        acceptButton?.addEventListener("click", () => {
          AcceptRequest(user.uid, ID);
        });
      } catch (e) {
        console.error(e);
        //acceptedUsers field does not exist.
        // console.log("Request's acceptedUsers field does not exist");
        cancelButton?.remove();
        acceptButton?.addEventListener("click", () => {
          AcceptRequest(user.uid, ID);
        });
      }
    });
});

function displayRequestInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"
  // console.log(ID);

  // doublecheck: is your collection called "Reviews" or "reviews"?
  db.collection("requests")
    .doc(ID)
    .get()
    .then((doc) => {
      const thisRequest = doc.data();

      const requestImage = thisRequest.images;
      const requestTitle = thisRequest.title;
      const requestCategory = thisRequest.category;
      const requestLocation = thisRequest.location;
      const requestUrgency = thisRequest.urgency;
      const requestDetails = thisRequest.detail;
      const requestMeetup = thisRequest.meetup;

      db.collection("users")
        .doc(thisRequest.user.uid)
        .get()
        .then((userDoc) => {
          const requestee = userDoc.data();
          // console.log(requestee)
          document.getElementById("requestee-name").innerHTML = requestee.name;
          if (!!requestee.pfpURL) {
            document
              .getElementById("profile-image")
              ?.setAttribute("src", requestee.pfpURL || "./public/img/default.png");
          }
        });

      // only populate title, and image
      document.getElementById("request-title").innerHTML = requestTitle;
      document.getElementById("request-category").innerHTML = requestCategory;
      document.getElementById("request-location").innerHTML = requestLocation;
      document.getElementById("request-urgency-text").innerHTML =
        requestUrgency;
      document
        .getElementById("requestee-urgency")
        .classList.add("request-urgency-" + requestUrgency?.toLowerCase());
      document.getElementById("request-details").innerHTML = requestDetails;
      document.getElementById("request-meetup").innerHTML = requestMeetup;

      var images = document.getElementsByClassName("request-image");
      var indicators = document.getElementsByClassName("carousel-indicator");
      var carouselItems = document.getElementsByClassName("carousel-item");

      //Checks for any carousel-item divs that would not have an image loaded in and removes it
      for (var i = 4; i >= 0; i--) {
        if (i >= requestImage.length) {
          carouselItems[i].remove();
        }
      }
      //populates images and enables the respective indicator buttons
      for (var i = 0; i < requestImage.length; i++) {
        images[i].setAttribute("src", requestImage[i]);
        indicators[i].disabled = false;
        indicators[i].style.display = "block";

        //if there is only 1 image,  all carousel buttons are hidden
        if (requestImage.length <= 1) {
          indicators[i].style.display = "none";
          document.getElementById("prev-image").style.display = "none";
          document.getElementById("next-image").style.display = "none";
        }
      }
    });
}

const showSetting = () => {
  const settingNode = document.getElementById("detail-setting");

  settingNode.style.display = "block";
};
const removeSetting = () => {
  const settingNode = document.getElementById("detail-setting");
  settingNode.remove();
};
const onClickArchive = async () => {
  const params = new URL(window.location.href); //get URL of search bar
  const docID = params.searchParams.get("docID"); //get value for key "id"
  const currentUserID = getUserID(); //get the user's id

  try {
    const requestRef = db.collection("requests").doc(docID);
    const requestDoc = await requestRef.get();
    if (!requestDoc.exists) {
      console.error("Cannot find doc information");
      return;
    }
    const requestData = requestDoc.data();

    let requestsStatus = requestData.status || "";
    if (requestsStatus == REQUEST_STATUS.ARCHIVED) {
      return;
    }
    await requestRef.update({ status: REQUEST_STATUS.ARCHIVED });

        //Closes the chatroom
        await db
        .collection("chatrooms")
        .where("requestID", "==", docID)
        .get()
        .then((chatrooms) => {
          chatrooms.forEach((chatroom) => {
            if (chatroom.data().userID.includes(currentUserID)) {
              db.collection("chatrooms")
                .doc(chatroom.id)
                .collection("messages")
                .add({
                  message: "This request has been closed.",
                  sender: currentUserID,
                  time: new Date().toLocaleString(),
                })
                .then((newDoc) => {
                  db.collection("chatrooms").doc(chatroom.id).update({
                    latestMessageID: newDoc.id,
                    userID: firebase.firestore.FieldValue.arrayRemove(currentUserID)
                  });
                });
            }
          });
        });

    showSuccessModal({
      message: "Archived",
      onShow: () => {
        setTimeout(() => {
          location.reload();
        }, 1200);
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const onClickDelete = async () => {
  try {
    const currentUserID = getUserID();

    const params = new URL(window.location.href); //get URL of search bar
    const docID = params.searchParams.get("docID"); //get value for key "id"

    // remove
    await db
      .collection("users")
      .doc(currentUserID)
      .update({
        requestsCreated: firebase.firestore.FieldValue.arrayRemove(docID),
      });

    //Closes the chatroom
    await db
    .collection("chatrooms")
    .where("requestID", "==", docID)
    .get()
    .then((chatrooms) => {
      chatrooms.forEach((chatroom) => {
        if (chatroom.data().userID.includes(currentUserID)) {
          db.collection("chatrooms")
            .doc(chatroom.id)
            .collection("messages")
            .add({
              message: "This request has been deleted.",
              sender: currentUserID,
              time: new Date().toLocaleString(),
            })
            .then((newDoc) => {
              db.collection("chatrooms").doc(chatroom.id).update({
                latestMessageID: newDoc.id,
                userID: firebase.firestore.FieldValue.arrayRemove(currentUserID)
              });
            });
        }
      });
    });

    await db
      .collection("requests")
      .doc(docID)
      .get()
      .then((doc) => {
        const usersAccepted = doc.data().usersAccepted || [];
        usersAccepted.forEach((userID) => {
          db.collection("users")
            .doc(userID)
            .update({
              requestsAccepted:
                firebase.firestore.FieldValue.arrayRemove(docID),
            });
        });
      });

    await db.collection("requests").doc(docID).delete();

    showSuccessModal({
      message: "Deleted",
      onShow: () => {
        setTimeout(() => {
          window.location.href = `./main.html`;
        }, 1200);
      },
    });
  } catch (e) {
    console.error(e);
  }
};

async function AbandonRequest(userid, requestid) {
  //Remove requestID from user doc array
  //Remove userid from request doc array

  db.collection("users")
    .doc(userid)
    .update({
      requestsAccepted: firebase.firestore.FieldValue.arrayRemove(requestid),
    });
  // console.log("Removed requestID from user's accepted requests");
  db.collection("requests")
    .doc(requestid)
    .update({
      usersAccepted: firebase.firestore.FieldValue.arrayRemove(userid),
    });
  // console.log("Removed userID from requests accepted users");

  await db
    .collection("chatrooms")
    .where("requestID", "==", requestid)
    .get()
    .then((chatrooms) => {
      chatrooms.forEach((chatroom) => {
        if (chatroom.data().userID.includes(userid)) {
          db.collection("chatrooms")
            .doc(chatroom.id)
            .collection("messages")
            .add({
              message: "User has left the chat.",
              sender: userid,
              time: new Date().toLocaleString(),
            })
            .then((newDoc) => {
              db.collection("chatrooms").doc(chatroom.id).update({
                latestMessageID: newDoc.id,
                userID: firebase.firestore.FieldValue.arrayRemove(userid)
              });
            });
        }
      });
    });

    showSuccessModal({
      message: "Cancelled",
      onShow: () => {
        setTimeout(() => {
          location.reload();
        }, 1200);
      },
    });
}

async function AcceptRequest(userid, requestid) {
  //Save accepted request to the user donezo
  //Add userid to the request's acceptedUsers donezo
  //Create a chatroom for the user and the recipient
  //Assign the chatroom's ID, userId and creatorID to the chatrooms collection in the request

  await db
    .collection("requests")
    .doc(requestid)
    .get()
    .then((doc) => {
      try {
        if (doc.data().acceptedUsers.includes(userid)) {
          sessionStorage.setItem("accepted", true);
        } else {
          sessionStorage.setItem("accepted", false);
        }
      } catch (e) {
        console.error(e);
        sessionStorage.setItem("accepted", false);
      }
    });

  if (!sessionStorage.getItem("accepted")) return;

  db.collection("users")
    .doc(userid)
    .update({
      requestsAccepted: firebase.firestore.FieldValue.arrayUnion(requestid),
    });

  db.collection("requests")
    .doc(requestid)
    .update({
      usersAccepted: firebase.firestore.FieldValue.arrayUnion(userid),
    });

  db.collection("requests")
    .doc(requestid)
    .get()
    .then((doc) => {
      var creatorID = doc.data().user.uid;

      db.collection("chatrooms")
        .add({
          latestMessageID: "",
          requestID: requestid,
          userID: [creatorID, userid],
        })
        .then((chatdoc) => {
          chatdoc.collection("messages").add({
            message: "System Message [DO NOT REMOVE]",
            sender: "",
            time: new Date().toLocaleString(),
          });
          window.location.assign("./chatroom.html?docID=" + chatdoc.id);
        });
    });
}

const showClosed = () => {
  const div = document.createElement("div");
  div.setAttribute("id", "modal-indicator-closed");
  div.setAttribute("class", "modal-indicator");
  const template = `
        <div class="indicator-container">
            <div>
                <strong>This request was closed.</strong>
            </div>
        </div>
    `;
  div.innerHTML = template;
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
  document.body.appendChild(div);
};
