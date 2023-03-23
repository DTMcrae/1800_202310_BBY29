function displayRequestInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "requests" )
        .doc( ID )
        .get()
        .then( doc => {
            thisRequest = doc.data();
            const {code, title, category, location, urgency, detail, images} = thisRequest;

            requestCode = thisRequest.code;

            requestTitle = thisRequest.title;
            requestCategory = thisRequest.category;
            requestLocation = thisRequest.location;
            requestUrgency = thisRequest.urgency;
            requestDetails = thisRequest.detail;

            db.collection( "users" ).doc ( thisRequest.user.uid ).get().then(userDoc => {

                requesteeName = userDoc.data().name;

                document.getElementById( "requestee-name" ).innerHTML = requesteeName;
            });
            
            // only populate title, and image
            document.getElementById( "request-title" ).innerHTML = requestTitle;
            document.getElementById( "request-image").setAttribute("src", images?.[0]);
            document.getElementById( "request-category" ).innerHTML = requestCategory;
            document.getElementById( "request-location" ).innerHTML = requestLocation;
            document.getElementById( "request-urgency" ).innerHTML = requestUrgency;
            document.getElementById( "request-details" ).innerHTML = requestDetails;
        } );
}
displayRequestInfo();

firebase.auth().onAuthStateChanged((user) => {

    if(!user) return;
    
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"

    db.collection("requests").doc(ID).get().then(doc => {

        let acceptButton = document.querySelector(".requestButton");
        let cancelButton = document.querySelector(".cancelButton");

        try
        {
            var acceptedUsers = doc.data().usersAccepted;

            if(acceptedUsers.includes(user.uid))
            {
                console.log("User is present in acceptedUsers");
                acceptButton.innerHTML = "Open Chat";

                cancelButton.setAttribute("onclick","AbandonRequest(\"" + user.uid + "\",\"" + ID + "\")");
                try
                {
                db.collection("chatrooms").get().then(chatrooms => {
                    chatrooms.forEach(chatroom => {
                        console.log(user.uid);
                        console.log(chatroom.data().userID);

                        if(chatroom.data().userID.includes(user.uid))
                        {
                            acceptButton.setAttribute("href","/html/chatroom.html?docID=" + chatroom.id);
                            return;
                        }
                    });
                });
                }
                catch
                {
                    //chatroom collection does not exist
                    console.log("Chatroom collection does not exist!!!");
                }
            }

            else if(doc.data().user.uid == user.uid)
            {
                if(cancelButton != null) cancelButton.remove();
                acceptButton.innerHTML = "Delete Request";
            }

            else
            {
                if(cancelButton != null) cancelButton.remove();
                console.log("Assigning data");
                acceptButton.setAttribute("onclick","AcceptRequest(\"" + user.uid + "\",\"" + ID + "\")");
            }
        }
        catch
        {
            //acceptedUsers field does not exist.
            console.log("Request's acceptedUsers field does not exist")
            console.log("Assigning data");
            acceptButton.setAttribute("onclick","AcceptRequest(\"" + user.uid + "\",\"" + ID + "\")");
        }
    })

});

async function AbandonRequest(userid, requestid)
{
    //Remove requestID from user doc array
    //Remove userid from request doc array

    db.collection("users").doc(userid).update(
    {
        requestsAccepted: firebase.firestore.FieldValue.arrayRemove(requestid)
    });
    console.log("Removed requestID from user's accepted requests");
    db.collection("requests").doc(requestid).update(
    {
        usersAccepted: firebase.firestore.FieldValue.arrayRemove(userid)
    });
    console.log("Removed userID from requests accepted users");

    await db.collection("chatrooms").where("requestID","==",requestid).get().then(chatrooms => {
        chatrooms.forEach(chatroom => {
            if(chatroom.data().userID.includes(userid))
            {
                db.collection("chatrooms").doc(chatroom.id).collection("messages").add({ 
                    message: "User has left the chat.",
                    sender: userid,              
                    time: new Date().toLocaleString()    
                  }).then(newDoc => {
                    db.collection("chatrooms").doc(chatroom.id).update({
                        latestMessageID: newDoc.id
                    })
                  })
            }

        })
    })
}

async function AcceptRequest(userid,requestid)
{
    //Save accepted request to the user donezo
    //Add userid to the request's acceptedUsers donezo
    //Create a chatroom for the user and the recipient
    //Assign the chatroom's ID, userId and creatorID to the chatrooms collection in the request

    await db.collection("requests").doc(requestid).get().then(doc => {

        try
        {
            if(doc.data().acceptedUsers.includes(userid))
            {
                sessionStorage.setItem("accepted",true);
            }
            else
            {
                sessionStorage.setItem("accepted",false);
            }
        }
        catch
        {
            sessionStorage.setItem("accepted",false);
        }
    });

    if(! sessionStorage.getItem("accepted")) return;

    db.collection("users").doc(userid).update(
    {
        requestsAccepted: firebase.firestore.FieldValue.arrayUnion(requestid)
    });

    db.collection("requests").doc(requestid).update(
    {
        usersAccepted: firebase.firestore.FieldValue.arrayUnion(userid)
    });

db.collection("requests").doc(requestid).get().then(doc =>{
    var creatorID = doc.data().user.uid;

    db.collection("chatrooms").add({
        latestMessageID: "",
        requestID: requestid,
        userID: [creatorID, userid]
    }).then(chatdoc => {
        chatdoc.collection("messages").add({
            message:"System Message [DO NOT REMOVE]",
            sender: "",
            time: new Date().toLocaleString()
        })
        window.location.assign("/html/chatroom.html?docID=" + chatdoc.id);
    })
});
    
}