firebase.auth().onAuthStateChanged((user) => {
//check user's chatrooms
//get last view time
//get latest message
//check that message was not sent by user, and was sent after view time

UpdateNotification(user);
});

async function UpdateNotification(user)
{
    console.log("Function called");
    await db.collection("chatrooms").where("userID","array-contains",user.uid).get().then(chatrooms => {
        chatrooms.forEach(doc => {

            var lastRead = doc.data().lastRead[user.uid];
            var latestMessageID = doc.data().latestMessageID;
        
            db.collection("chatrooms").doc(doc.id).collection("messages").doc(latestMessageID).get().then(message => {
        
                if((message.data().time > lastRead && message.data().sender != user.uid) || lastRead == undefined && message.data().sender != user.uid)
                {
                    if(document.querySelector(".chat-notification") != null) return;
                    let notification = document.createElement("span");
                    notification.setAttribute("class","chat-notification");
                    document.querySelector(".navitem").appendChild(notification)
                }
            })
        });
    })
}