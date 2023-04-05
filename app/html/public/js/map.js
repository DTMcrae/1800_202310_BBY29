/*
 * map.js
 * This is not included in our current project, 
 * but is for our future feature.
 */


//--------------------------------------
// Get user's current location
// And some global variables
//---------------------------------------
navigator.geolocation.getCurrentPosition(onSuccess, onError);
var map; //for the map to be displayed
var markerArray = []; //array to store all the markers
const myAPIKey = "ed5a0681a3b64e91be60f7f01cf4e920"; //user your own key here

//-----------------------------------------
// handle success case of getCurrentPosition
//-----------------------------------------

function onSuccess(position) {
  //callback function
  const { latitude, longitude } = position.coords;

  //print helpful messages about current location
  //to help us debug, you can comment out these 2 lines later
  message.classList.add("success");
  message.textContent = `Your location: (${latitude},${longitude})`;

  //set map to be around current location
  //set a marker at the current location
  map = L.map("map").setView([latitude, longitude], 13);
  if (!map) return;
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  marker = L.marker([latitude, longitude]).addTo(map);
}

// handle error case
function onError() {
  message.classList.add("error");
  message.textContent = `Failed to get your location! Using default BCIT address.`;
  AddressString = "3700 Willingdon Avenue, Burnaby, BC, Canada";
}

function readPosts() {
  db.collection("requests")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        // do other stuff with the doc if you want
        // in this demo, we are just grabbing the address field
        AddressString = doc.data().location;
        console.log(AddressString);
        if (AddressString)
          //not null
          placeMarker(AddressString);
      });
    });
}
readPosts();

let marker;
function placeMarker(addr) {
  message.textContent = "Your location: " + addr; //some message for debugging
  // construct the geocoding url string, using addr input parameter
  const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    addr
  )}&apiKey=${myAPIKey}`;

  // call Geocoding API - https://www.geoapify.com/geocoding-api
  fetch(geocodingUrl)
    .then((result) => result.json())
    .then((featureCollection) => {
      if (featureCollection.features.length === 0) {
        console.log("The AddressString is not found");
        return;
      }

      // Let's use the first returned found address
      const foundAddressString = featureCollection.features[0];
      console.log(featureCollection.features[0]);
      // customized green icon
      var greenIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (!map) return;
      // create a marker based on the found address geolocation
      // use a customized icon called "greenIcon"
      // place this marker on the map, with Popup when clicked
      marker = L.marker(
        new L.LatLng(
          foundAddressString.properties.lat,
          foundAddressString.properties.lon
        ),
        {
          icon: greenIcon,
        }
      )
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();

      // add this new marker to the array
      // create a display group, and fitBounds (ie, zoom out)
      markerArray.push(marker);
      var group = L.featureGroup(markerArray).addTo(map);
      map.fitBounds(group.getBounds());
    });
}

function toggleView() {
  mapView = document.getElementById("map-view");
  listView = document.getElementById("list-view");

  mapView.classList.toggle("hide-view");
  listView.classList.toggle("hide-view");
}
