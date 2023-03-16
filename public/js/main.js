function sayHello() {
    console.log("Hello there!")
}
sayHello();

function insertNameFromFirestore() {
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // let me to know who is the user that logged in to get the UID
            currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
            currentUser.get().then(userDoc => {
                //get the user name
                var userName = userDoc.data().name;
                var userPicURL = userDoc.data().pfpURL;
                console.log(userName);
                //$("#name-goes-here").text(userName); //jquery
                document.getElementById("username").innerText = userName.split(' ')[0] + '!';;
                var image = document.getElementById("profile-image");
                image.setAttribute('src', userPicURL);

            })
        }
    })
}
insertNameFromFirestore()