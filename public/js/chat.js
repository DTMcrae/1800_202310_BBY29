firebase.auth().onAuthStateChanged((user) => {

    if(!user) return;

    $('#chatTemplate').load("/html/templates/chatroomTemplate.html");   //Load the template file
    let cardTemplate = document.getElementById("chatTemplate"); //Load the request card template
    var userid = user.uid;

    db.collection("chatrooms").get()
        .then(chatrooms=> {
            chatrooms.forEach(doc => { //iterate thru each doc

                //Check if the user is a part of the chatroom.
                //Possible switch to saving the chatID's to the user at some point for high-traffic performance.
                if(doc.data().userID.includes(userid))
                {

                    let segment = document.querySelector(".no-chatrooms");
                    if(segment != null) segment.remove();

                var recipientID = doc.data().userID[0];
                if(recipientID == userid) recipientID = doc.data().userID[1];

                var docID = doc.id;

                if(doc == null || userid == null) return;
                CreateNode(doc, userid, cardTemplate);
            }
            })
        })

});

//Sets the needed information to the local storage.
//This must be done as getting information from multiple documents simultaneously can result in overwriting
//and incorrectly displaying data.
async function SetLocalData(doc, userid)
{
    var recipientID = doc.data().userID[0];
    var docID = doc.id;

    if(recipientID == userid) recipientID = doc.data().userID[1];

    //Get the required request information from the database
    console.log("Chatroom for request: " + doc.data().requestID);

    try
    {
    db.collection("requests").doc(doc.data().requestID).get().then(requestDoc => {
        if(requestDoc.data() != null)
        {
        sessionStorage.setItem("requestName" + docID,requestDoc.data().title);
        sessionStorage.setItem("location" + docID,requestDoc.data().location);
        sessionStorage.setItem("category" + docID,requestDoc.data().category);
        }
        else
        {
            sessionStorage.setItem("requestName" + docID,"Request Closed");
            sessionStorage.setItem("location" + docID," ");
            sessionStorage.setItem("category" + docID," ");
        }
    });
    }
    catch
    {
        sessionStorage.setItem("requestName" + docID,"Request Closed");
        sessionStorage.setItem("location" + docID," ");
        sessionStorage.setItem("category" + docID," ");
    }

    //Get the required user information from the database
    await db.collection("users").doc(recipientID).get().then(userDoc => {
        sessionStorage.setItem("recipientName" + docID, userDoc.data().name);
        console.log("Recipient: " + sessionStorage.getItem("recipientName"));
    });

    //Get the required message information from the database
    try
    {
    await db.collection("chatrooms").doc(doc.id).collection("messages").doc(doc.data().latestMessageID).get()
    .then(messageDoc => {
        sessionStorage.setItem("latestMessage" + docID, messageDoc.data().message);
        sessionStorage.setItem("latestMessageTime" + docID, messageDoc.data().time);
    });
    }
    catch
    {
        sessionStorage.setItem("latestMessage" + docID, "No Messages");
        sessionStorage.setItem("latestMessageTime" + docID, " ");
    }
}

async function CreateNode(doc, userid, cardTemplate)
{
    await SetLocalData(doc,userid);

    var docID = doc.id;
    let newcard = cardTemplate.content.cloneNode(true);

    //update title and text
    newcard.querySelector('.msg-recipient').innerHTML = sessionStorage.getItem("recipientName" + docID);
    newcard.querySelector('.latest-message').innerHTML = ApplyLimiter(150,sessionStorage.getItem("latestMessage" + docID).toString());
    newcard.querySelector('.request-name').innerHTML = "Request: " + sessionStorage.getItem("requestName" + docID);
    newcard.querySelector('.request-location').innerHTML = sessionStorage.getItem("location" + docID);
    newcard.querySelector('.category').innerHTML = sessionStorage.getItem("category" + docID);
    newcard.querySelector('.latest-message-time').innerHTML = sessionStorage.getItem("latestMessageTime" + docID);
    newcard.querySelector('a').href = "/html/chatroom.html?docID="+doc.id;

    //attach to gallery
    document.getElementById("chatrooms-go-here").appendChild(newcard);
}

//Limits the number of characters in a string of text.
//Cuts the text off at the end of the previous word if it is too large.
function ApplyLimiter(maxChar, text) {
    console.log("Function Called:")
    console.log("Max: " + Number(Number(maxChar) - Number(3)));
    console.log("Text: " + text);
    var result = "";
    var segments = text.split(' ');
    var i = 0;

    while(result.length < Number(Number(maxChar) - Number(3)))
    {
        if(result.length >= text.length) break;
        if(result.length + (segments[i]).length + Number(1) >= Number(Number(maxChar) - Number(3))) break;
        result += " " + segments[i];
        i++;
    }
    if(result.length < text.length) result += "...";

    if(result.length >= Number(Number(maxChar) - Number(3)))
    {
        return (result.substring(0, Number(Number(maxChar) - Number(3))) + "...");
    }

    return result;
}