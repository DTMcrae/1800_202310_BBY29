var loadFile = function (event) {
  var image = document.getElementById("profile-image");
  image.src = URL.createObjectURL(event.target.files[0]);
};

