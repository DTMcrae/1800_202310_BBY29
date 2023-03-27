import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userdoc) => {
      userdoc.data().requestsAccepted?.forEach((requestID) => {
        db.collection("requests")
          .doc(requestID)
          .get()
          .then((requestDoc) => {
            if (requestDoc.data() == null) return;

            const docData = requestDoc.data();
            const card = createRequestTemplate({
              ...docData,
              requestId: requestID,
            });

            if (requestDoc.data().requestType == "help") {
              document.getElementById("list-others-help").appendChild(card);
            } else {
              document
                .getElementById("list-others-volunteer")
                .appendChild(card);
            }
          });
      });

      userdoc.data().requestsCreated?.forEach((requestID) => {
        db.collection("requests")
          .doc(requestID)
          .get()
          .then((requestDoc) => {
            if (requestDoc.data() == null) return;

            const docData = requestDoc.data();
            const card = createRequestTemplate({
              ...docData,
              requestId: requestID,
            });

            if (requestDoc.data().requestType == "help") {
              document.getElementById("list-my-help").appendChild(card);
            } else {
              document.getElementById("list-my-volunteer").appendChild(card);
            }
          });
      });
    });
});
