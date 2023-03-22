firebase.auth().onAuthStateChanged((user) => {

    if(!user) return;

    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    var userid = user.uid;

    db.collection("chatrooms").doc(ID).get().then(doc => {
        if(doc.data().userID.includes(userid))
                {

                $('#sentTemplate').load("/html/templates/sentTemplate.html");   //Load the template file
                let sentTemplate = document.getElementById("sentTemplate"); //Load the request card template
                
                $('#receivedTemplate').load("/html/templates/receivedTemplate.html");   //Load the template file
                let receivedTemplate = document.getElementById("receivedTemplate"); //Load the request card template

                var recipientID = doc.data().userID[0];
                if(recipientID == userid) recipientID = doc.data().userID[1];
                var docID = doc.id;

                UpdateHeader(doc, recipientID, userid);

                //Created a card for each message in the database. Runs each time the database is updated
                db.collection("chatrooms").doc(ID).collection("messages").orderBy("time").onSnapshot(messages => {
                    messages.forEach(message => {

                        //If the message already exists on the page, ignore it
                        if(document.getElementById(message.id) != null) return;

                        if(message.sender == null) return;

                        let segment = document.querySelector(".no-chatrooms");
                        if(segment != null) segment.remove();

                        //Create a received message card if the message is not from the user
                        if(message.data().sender == recipientID)
                        {
                            let newcard = receivedTemplate.content.cloneNode(true);

                            newcard.querySelector('.message-body').innerHTML = message.data().message;
                            newcard.querySelector('.message-body').setAttribute("id",message.id);
                            newcard.querySelector(".time").innerHTML = message.data().time;

                            document.getElementById("messages-go-here").appendChild(newcard)
                        }

                        //Create a sent message card
                        else
                        {
                            let newcard = sentTemplate.content.cloneNode(true);

                            newcard.querySelector(".message-body").innerHTML = message.data().message;
                            newcard.querySelector('.message-body').setAttribute("id",message.id);
                            newcard.querySelector(".time").innerHTML = message.data().time;

                            document.getElementById("messages-go-here").appendChild(newcard)
                        }
                    })
                })
            }
    });

    document.body.style.paddingBottom = '40px';

});

async function SetLocalData(doc, recipientID)
{
    var docID = doc.id;

    //Get the required request information from the database
    await db.collection("requests").doc(doc.data().requestID).get().then(requestDoc => {
        sessionStorage.setItem("requestName",requestDoc.data().title);
        sessionStorage.setItem("requestDetails",requestDoc.data().detail);
    });

    //Get the required user information from the dataBase;
    await db.collection("users").doc(recipientID).get().then(userDoc => {
        sessionStorage.setItem("recipientName", userDoc.data().name);
        console.log("Recipient: " + sessionStorage.getItem("recipientName"));
    });
}

async function UpdateHeader(doc, recipientid, userid)
{
    await SetLocalData(doc,recipientid);

    var docID = doc.id;
    let newcard = document.getElementById("message-details");

    //update the name and request details in the header
    newcard.querySelector('.recipient').innerHTML = sessionStorage.getItem("recipientName");
    newcard.querySelector('.request-name').innerHTML = "Request: " + sessionStorage.getItem("requestName");
    newcard.querySelector('.request-details').innerHTML = sessionStorage.getItem("requestDetails");
    newcard.querySelector('button').href = "/html/request-details.html?docID="+doc.data().requestID;

    document.querySelector(".send-message").setAttribute("onclick","SubmitMessage(\"" + userid + "\")");
}

function SubmitMessage(userID) {

    var messageToSend = document.getElementById("inputMessage").value;
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"

    if(messageToSend == null || ID == null) return;

    //Write the message to the database, and assign its id as the latest message
    db.collection("chatrooms").doc(ID).collection("messages").add({ 
        message: messageToSend,
        sender: userID,              
        time: new Date().toLocaleString()    
      }).then(newDoc => {
        console.log("Created new message with id: " + newDoc.id);
        document.getElementById("inputMessage").value = "";
        db.collection("chatrooms").doc(ID).update({
            latestMessageID: newDoc.id
        })
      }).catch(function (error) {
        console.log("Error sending message " + error);
      });
    }