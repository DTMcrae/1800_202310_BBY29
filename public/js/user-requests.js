import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  db.collection("users").doc(user.uid).get().then((userdoc) => {
    const getListItems = (listDom, fieldName) => {
        let requests;
        try {
            requests = userdoc.data()[fieldName];

            if (requests.length <= 0) {
            let node = document.createTextNode(
                "No requests have been accepted."
            );
            listDom.appendChild(node);

            console.log("Field exists but no requests are present");
            return;
            }
        } catch (e) {
            console.warn(e);
            console.log("Field does not exist");
            let node = document.createTextNode("No requests have been accepted.");
            listDom.appendChild(node);
            return;
        }

        requests.forEach((requestId) => {

            db.collection("requests")
            .doc(requestId)
            .get()
            .then((doc) => {
                const docData = doc.data();
                const card = createRequestTemplate({...docData, requestId: requestId});
                console.log("card", card);
                listDom?.appendChild(card);
            });
        });
      };

    // Requests Posted > Help
    const myHelpListDom = document.getElementById("list-my-help");
    getListItems(myHelpListDom, "helpRequests");

    // Requests Posted > Volunteer
    const myVolunteerListDom = document.getElementById("list-my-volunteer");
    getListItems(myVolunteerListDom, "volunteerRequests");

V
    // Requests Accepted > Help

    // Requests Accepted > Help

    });

  // Accepted
  $("#requestTemplate").load("/html/requestTemplate.html"); //Load the template file
  let cardTemplate = document.getElementById("requestTemplate"); //Load the request card template
  var userid = user.uid;

  db.collection("users")
    .doc(userid)
    .get()
    .then((userdoc) => {
      //Verify that the requestsAccepted field exists and has data.
      try {
        var requests = userdoc.data().requestsAccepted;

        if (requests.length <= 0) {
          let node = document.createTextNode("No requests have been accepted.");
          document.getElementById("helping-others-list").appendChild(node);

          console.log("Field exists but no requests are present");
          return;
        }
      } catch {
        console.log("Field does not exist");
        let node = document.createTextNode("No requests have been accepted.");
        document.getElementById("helping-others-list")?.appendChild(node);
        return;
      }

      userdoc.data().requestsAccepted.forEach((acceptedID) => {
        db.collection("requests")
          .doc(acceptedID)
          .get()
          .then((doc) => {
            var title = doc.data().title; // get value of the "title" key
            var details = doc.data().details; // get value of the "details" key
            var category = doc.data().category; // get value of the "category" key
            var location = doc.data().location; // get value of the "location" key
            var urgency = doc.data().urgency; // get value of the "urgency" key
            var docID = doc.id;
            let newcard = cardTemplate.content.cloneNode(true);

            //update title and text and image
            newcard.querySelector(".request-title").innerHTML = title;
            newcard.querySelector(".request-details").innerHTML = details;
            newcard.querySelector(".request-location").innerHTML = location;
            newcard.querySelector(".request-category").innerHTML = category;
            newcard.querySelector(".request-urgency").innerHTML = urgency;
            //newcard.querySelector('.request-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
            newcard.querySelector("a").href =
              "/html/request-details.html?docID=" + docID;

            //attach to gallery
            document
              .getElementById("helping-others-list")
              ?.appendChild(newcard);
          });
      });
    });

  //Verify that the requestsCreated field exists and has data.
  try {
    var requests = userdoc.data().requestsCreated;

    if (requests.length <= 0) {
      console.log("Field exists but no requests are present");
      let node = document.createTextNode("No requests have been created.");
      document.getElementById("request-help-list")?.appendChild(node);
      return;
    }
  } catch {
    console.log("Field does not exist");
    let node = document.createTextNode("No requests have been created.");
    document.getElementById("request-help-list")?.appendChild(node);
    return;
  }

  db.collection("users")
    .doc(userid)
    .get()
    .then((userdoc) => {
      userdoc.data().requestsCreated.forEach((acceptedID) => {
        db.collection("requests")
          .doc(acceptedID)
          .get()
          .then((doc) => {
            var title = doc.data().title; // get value of the "title" key
            var details = doc.data().details; // get value of the "details" key
            var category = doc.data().category; // get value of the "category" key
            var location = doc.data().location; // get value of the "location" key
            var urgency = doc.data().urgency; // get value of the "urgency" key
            var docID = doc.id;
            let newcard = cardTemplate.content.cloneNode(true);

            //update title and text and image
            newcard.querySelector(".request-title").innerHTML = title;
            newcard.querySelector(".request-details").innerHTML = details;
            newcard.querySelector(".request-location").innerHTML = location;
            newcard.querySelector(".request-category").innerHTML = category;
            newcard.querySelector(".request-urgency").innerHTML = urgency;
            //newcard.querySelector('.request-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
            newcard.querySelector("a").href =
              "/html/request-details.html?docID=" + docID;

            //attach to gallery
            document.getElementById("request-help-list")?.appendChild(newcard);
          });
      });
    });
});
