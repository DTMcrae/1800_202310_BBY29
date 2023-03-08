// initializer
window.onload = function() {

};

function onClickSubmitPost() {
  const formDom = document.getElementById("form-post-request");

  console.log(formDom.getElementsByClassName("input"));

  const isValid = postingValidation({
    title: "",
    location: "",
    urgency: 1,

  });

  if (isValid) {
    submitPost();
  } else {
    
  }
}

const postingValidation = (({
  title,
  location,
  urgency
})=> {

  let isValid = false;

  return isValid;
});

const submitPost = () => {
  const popUp = new popUpClass().
  console.log("submit");
  
}