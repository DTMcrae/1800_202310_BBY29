firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  $("#chatTemplate").load("/html/templates/chatroomTemplate.html"); //Load the template file
  let cardTemplate = document.getElementById("chatTemplate"); //Load the request card template
  var userid = user.uid;
  try {
    db.collection("chatrooms")
      .get()
      .then((chatrooms) => {
        chatrooms.forEach((doc) => {
          //iterate thru each doc

          //Check if the user is a part of the chatroom.
          //Possible switch to saving the chatID's to the user at some point for high-traffic performance.
          if (doc.data().userID.includes(userid)) {
            let segment = document.querySelector(".no-chatrooms");
            if (segment != null) segment.remove();

            var recipientID = doc.data().userID[0];
            if (recipientID == userid) recipientID = doc.data().userID[1];

            var docID = doc.id;

            if (doc == null || userid == null) return;
            CreateNode(doc, userid, cardTemplate);
          }
        });
      });
  } catch (e) {
    console.error(e);
  }
});

//Sets the needed information to the local storage.
//This must be done as getting information from multiple documents simultaneously can result in overwriting
//and incorrectly displaying data.
async function SetLocalData(doc, userid) {
  var recipientID = doc.data().userID[0];
  var docID = doc.id;

  if (recipientID == userid) recipientID = doc.data().userID[1];

  //Get the required request information from the database
  try {
    db.collection("requests")
      .doc(doc.data().requestID)
      .get()
      .then((requestDoc) => {
        if (requestDoc.data() != null) {
          sessionStorage.setItem(
            "requestName" + docID,
            requestDoc.data().title
          );
          sessionStorage.setItem(
            "location" + docID,
            requestDoc.data().location
          );
          sessionStorage.setItem(
            "category" + docID,
            requestDoc.data().category
          );
          sessionStorage.setItem(
            "image" + docID,
            requestDoc.data().images?.[0] || "/img/default.png"
          );
        } else {
          sessionStorage.setItem("requestName" + docID, "Request Closed");
          sessionStorage.setItem("location" + docID, " ");
          sessionStorage.setItem("category" + docID, " ");
          sessionStorage.setItem("image" + docID, "/img/default.png");
        }
      });
  } catch (e) {
    console.error(e);
    sessionStorage.setItem("requestName" + docID, "Request Closed");
    sessionStorage.setItem("location" + docID, " ");
    sessionStorage.setItem("category" + docID, " ");
    sessionStorage.setItem("image" + docID, "/img/default.png");
  }

  //Get the required user information from the database
  await db
    .collection("users")
    .doc(recipientID)
    .get()
    .then((userDoc) => {
      try {
        sessionStorage.setItem("recipientName" + docID, userDoc.data().name);
      } catch (e) {
        console.error(e);
        sessionStorage.setItem("recipientName" + docID, "No Recipient");
      }
      // console.log("Recipient: " + sessionStorage.getItem("recipientName"));
    });

  //Get the required message information from the database
  try {
    await db
      .collection("chatrooms")
      .doc(doc.id)
      .collection("messages")
      .doc(doc.data().latestMessageID)
      .get()
      .then((messageDoc) => {
        sessionStorage.setItem(
          "latestMessage" + docID,
          messageDoc.data().message
        );
        sessionStorage.setItem(
          "latestMessageTime" + docID,
          messageDoc.data().time
        );
      });
  } catch (e) {
    console.error(e);
    sessionStorage.setItem("latestMessage" + docID, "No Messages");
    sessionStorage.setItem("latestMessageTime" + docID, " ");
  }
}

async function CreateNode(doc, userid, cardTemplate) {
  try {
    await SetLocalData(doc, userid);

    var docID = doc.id;
    let newcard = cardTemplate.content.cloneNode(true);

    newcard
      .querySelector(".card-container")
      .setAttribute("id", "chatroom-" + doc.id);

    //update title and text
    newcard
      .querySelector(".img-thumbnail")
      .setAttribute("src", sessionStorage.getItem("image" + docID));
    newcard.querySelector(".msg-recipient").innerHTML = sessionStorage.getItem(
      "recipientName" + docID
    );
    newcard.querySelector(".latest-message").innerHTML = ApplyLimiter(
      150,
      sessionStorage.getItem("latestMessage" + docID).toString()
    );
    newcard.querySelector(".request-name").innerHTML =
      "Request: " + sessionStorage.getItem("requestName" + docID);
    newcard.querySelector(".request-location").innerHTML =
      "Location: " + sessionStorage.getItem("location" + docID);
    newcard.querySelector(".category").innerHTML =
      "Category: " + sessionStorage.getItem("category" + docID);
    newcard.querySelector(".latest-message-time").innerHTML =
      sessionStorage.getItem("latestMessageTime" + docID);
    newcard.querySelector("a").href = "/html/chatroom.html?docID=" + doc.id;

    //attach to gallery
    document.getElementById("chatrooms-go-here").appendChild(newcard);

    var lastRead = doc.data().lastRead[userid];
    var latestMessageID = doc.data().latestMessageID;
    var finishedCard = document.getElementById("chatroom-" + doc.id);

    db.collection("chatrooms")
      .doc(doc.id)
      .collection("messages")
      .doc(latestMessageID)
      .get()
      .then((message) => {
        // console.log("chatroom-" + doc.id);

        // console.log(finishedCard);

        if (
          (message.data().time < lastRead && message.data().sender != userid) ||
          message.data().sender == userid
        ) {
          finishedCard.querySelector(".notification").remove();
        }
      });
  } catch (e) {
    console.error(e);
  }
}

//Limits the number of characters in a string of text.
//Cuts the text off at the end of the previous word if it is too large.
function ApplyLimiter(maxChar, text) {
  var result = "";
  var segments = text.split(" ");
  var i = 0;

  while (result.length < Number(Number(maxChar) - Number(3))) {
    if (result.length >= text.length) break;
    if (
      result.length + segments[i].length + Number(1) >=
      Number(Number(maxChar) - Number(3))
    )
      break;
    result += " " + segments[i];
    i++;
  }

  if (
    result.length >= Number(Number(maxChar) - Number(3)) ||
    result.length <= 0
  ) {
    return text.substring(0, Number(Number(maxChar) - Number(3))) + "...";
  }

  if (result.length < text.length) result += "...";

  return result;
}
