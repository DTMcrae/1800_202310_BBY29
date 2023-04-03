function browseSearch() {
  var searchInput = document.getElementById("search");
  var filter = searchInput.value.toLowerCase();
  var requestsToFilter = document.getElementsByClassName("request");
  // var requestTitle = document.getElementsByClassName('request-title');

  for (var i = 0; i < requestsToFilter.length; i++) {
    if (requestsToFilter[i].innerHTML.toLowerCase().indexOf(filter) > -1) {
      requestsToFilter[i].style.display = " ";
    } else {
      requestsToFilter[i].style.display = "none";
    }
  }
//   console.log(filter);
  if (filter.trim() === "") {
    for (var i = 0; i < requestsToFilter.length; i++) {
      requestsToFilter[i].style.display = "block";
    }
  }
}

var btn = document.getElementById("search");
btn.addEventListener("keydown", browseSearch);
