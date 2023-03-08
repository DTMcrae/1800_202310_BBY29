var currentUser;   //put this right after you start script tag before writing any functions.

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => { //userDoc is the input value to the callback function 
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userEmail = userDoc.data().email;
                    var userCity = userDoc.data().city;
                    var userPhone = userDoc.data().number;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("first-name").value = userName.split(' ')[0];
                        document.getElementById("last-name").value = userName.split(' ')[1];
                    }
                    if (userEmail != null) {
                        document.getElementById("email").value = userEmail;
                    }
                    if (userCity != null) {
                        document.getElementById("location").value = userCity;
                    }
                    if (userPhone != null) {
                        document.getElementById("phone").value = userPhone;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function saveUserInfoAndRedirect() {
    //enter code here

    //a) get user entered values
    userFirstName = document.getElementById('first-name').value;
    userLastName = document.getElementById('last-name').value;    //get the value of the field with id="nameInput"
    userEmail = document.getElementById('email').value;     //get the value of the field with id="schoolInput"
    userPhone = document.getElementById('phone').value;       //get the value of the field with id="cityInput"
    userCity = document.getElementById('location').value;
    //b) update user's document in Firestore
    currentUser.update({
        name: userFirstName + " " + userLastName,
        email: userEmail,
        phone: userPhone,
        city: userCity
    })
        .then(() => {
            console.log("Document updated")
            alert("Profile successfully updated!");
            window.location.href = 'profile';
        })

}