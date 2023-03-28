import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userdoc) => {
      const acceptedList = userdoc.data().requestsAccepted || [];
      for(let i = 0; i < acceptedList.length; i++) {
        const requestID = acceptedList[acceptedList.length - i - 1];
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
      }
      
    const createdLists = userdoc.data().requestsCreated || [];
    for(let i = 0; i < createdLists.length; i++) {
      const requestID = createdLists[createdLists.length - i - 1];
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
      }
    });
});
