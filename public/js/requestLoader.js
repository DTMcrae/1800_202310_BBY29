function displayCardsDynamically(collection) {
    $('#requestTemplate').load("/html/requestTemplate.html");   //Load the template file
    let cardTemplate = document.getElementById("requestTemplate"); //Load the request card template

    db.collection(collection).get()   //the collection called "hikes"
        .then(requests=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            requests.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;       // get value of the "title" key
                var details = doc.data().details;   // get value of the "details" key
                var category = doc.data().category; // get value of the "category" key
                var location = doc.data().location; // get value of the "location" key
                var urgency = doc.data().urgency;   // get value of the "urgency" key
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.request-title').innerHTML = title;
                newcard.querySelector('.request-details').innerHTML = details;
                newcard.querySelector('.request-location').innerHTML = location;
                newcard.querySelector('.request-category').innerHTML = category;
                newcard.querySelector('.request-urgency').innerHTML = urgency;
                //newcard.querySelector('.request-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "/html/request-details.html?docID="+docID;

                //attach to gallery
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("requests");  //input param is the name of the collection