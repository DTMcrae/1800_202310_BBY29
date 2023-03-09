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
            requestCode = thisRequest.code;
            requestTitle = thisRequest.title;
            requestCategory = thisRequest.category;
            requestLocation = thisRequest.location;
            requestUrgency = thisRequest.urgency;
            requestDetails = thisRequest.details;

            db.collection( "users" ).doc ( thisRequest.creator ).get().then(userDoc => {

                this.requesteeName = userDoc.data().name;

                document.getElementById( "requestee-name" ).innerHTML = requesteeName;
            });
            
            // only populate title, and image
            document.getElementById( "request-title" ).innerHTML = requestTitle;
            document.getElementById( "request-category" ).innerHTML = requestCategory;
            document.getElementById( "request-location" ).innerHTML = requestLocation;
            document.getElementById( "request-urgency" ).innerHTML = requestUrgency;
            document.getElementById( "request-details" ).innerHTML = requestDetails;
        } );
}
displayRequestInfo();