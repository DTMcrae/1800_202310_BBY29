import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;

  db.collection("users").doc(user.uid).get().then((userdoc) => {
    userdoc.data().requestsAccepted?.forEach(requestID => {
        db.collection("requests").doc(requestID).get().then(requestDoc => {

            if(requestDoc.data() == null) return;

            const docData = requestDoc.data();
            const card = createRequestTemplate({...docData, requestId: requestID});

            if(requestDoc.data().requestType == "help")
            {
                document.getElementById("list-others-help").appendChild(card);
            }
            else
            {
                document.getElementById("list-others-volunteer").appendChild(card);
            }
        })
    });

    userdoc.data().requestsCreated?.forEach(requestID => {
        db.collection("requests").doc(requestID).get().then(requestDoc => {

            if(requestDoc.data() == null) return;
            

            const docData = requestDoc.data();
            const card = createRequestTemplate({...docData, requestId: requestID});

            if(requestDoc.data().requestType == "help")
            {
                document.getElementById("list-my-help").appendChild(card);
            }
            else
            {
                document.getElementById("list-my-volunteer").appendChild(card);
            }
        })
    })
       /* try {
            console.log(fieldName);
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
        }*/

        /*requests.forEach((requestId) => {

            db.collection("requests")
            .doc(requestId)
            .get()
            .then((doc) => {
                const docData = doc.data();
                const card = createRequestTemplate({...docData, requestId: requestId});
                listDom?.appendChild(card);
            });
        });*/
      });

      /*
    // Requests Posted > Help
    const myHelpListDom = document.getElementById("list-my-help");
    getListItems(myHelpListDom, "helpRequests");
    
    // Requests Posted > Volunteer
    const myVolunteerListDom = document.getElementById("list-my-volunteer");
    getListItems(myVolunteerListDom, "volunteerRequests");
    
    // Requests Accepted > Help
    const othersHelpListDom = document.getElementById("list-others-help");
    getListItems(othersHelpListDom, "acceptedHelpRequests");
    
    // Requests Accepted > Help
    const othersVolunteerListDom = document.getElementById("list-others-volunteer");
    getListItems(othersVolunteerListDom, "acceptedVolunteerRequests");

    */
    });
