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


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var ok = document.getElementById("modal-ok-button");
// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    saveUserInfoAndRedirect();
}
ok.onclick = function () {
    modal.style.display = "none";
    saveUserInfoAndRedirect();
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        saveUserInfoAndRedirect();
    }
}


function saveUserInfoAndRedirect() {
    //enter code here
    var nameReg = /^[A-Za-z',-]+$/;
    var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var phoneReg = /^([0-9]{3})+\-([0-9]{3})+\-([0-9]{4})$/;
    //a) get user entered values
    userFirstName = document.getElementById('first-name').value;
    userLastName = document.getElementById('last-name').value;    
    userEmail = document.getElementById('email').value;     
    userPhone = document.getElementById('phone').value;       
    userCity = document.getElementById('location').value;

    if (!userFirstName){
        alert("Please input a name!");
        return;
    } else if (userFirstName.length < 2) {
        alert ("Please complete your entry!");
        return;
    }else if (!nameReg.test(userFirstName)) {
        alert ("Please input alphabetical characters only!");
        return;
    }

    if (!userLastName){
        alert("Please input a name!");
        return;
    } else if (userLastName.length < 2) {
        alert ("Minimum 2 characters!");
        return;
    } else if (!nameReg.test(userLastName)) {
        alert ("Please input alphabetical characters only!");
        return;
    }

    if (!userEmail){
        alert("Please enter an email!");
        return;
    } else if (!emailReg.test(userEmail)) {
        alert ("Please enter a valid email!");
        return;
    }

    if (!phoneReg.test(userPhone)){
        alert ("Please enter your phone number in the format XXX-XXX-XXXX");
        return;
    }


    //b) update user's document in Firestore
    currentUser.update({
        name: userFirstName + " " + userLastName,
        email: userEmail,
        number: userPhone,
        city: userCity
    })
        .then(() => {
            console.log("Document updated");
            window.location.href = 'profile';
        })

}
