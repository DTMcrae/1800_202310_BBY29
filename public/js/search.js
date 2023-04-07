function browseSearch() {
  //Grabs the user input inside search and converts it to lower case
  var searchInput = document.getElementById("search");
  var filter = searchInput.value.toLowerCase();

  //Adds all references to requests to an adds them to an array
  var requestsToFilter = document.getElementsByClassName("request");


  //Cycles through each request in the array and checks if any words inside the request 
  // matches string in search
  for (var i = 0; i < requestsToFilter.length; i++) {
    if (requestsToFilter[i].innerHTML.toLowerCase().indexOf(filter) > -1) {
      requestsToFilter[i].style.display = " ";
    } else {
      //If none of the words match, set display to none
      requestsToFilter[i].style.display = "none";
    }
  }

//Deleting all text inside search resets the displays of all requests
  if (filter.trim() === "") {
    for (var i = 0; i < requestsToFilter.length; i++) {
      requestsToFilter[i].style.display = "block";
    }
  }
}

var btn = document.getElementById("search");
//Keydown makes it so the search is updated as the user types
btn.addEventListener("keydown", browseSearch);
