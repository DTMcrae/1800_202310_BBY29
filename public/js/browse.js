import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  $("#requestTemplate").load("/html/requestTemplate.html"); //Load the template file
  let cardTemplate = document.getElementById("requestTemplate"); //Load the request card template

  db.collection("requests")
    .orderBy("createdDate", "desc")
    .get()
    .then((requests) => {
      requests.forEach((doc) => {
        const docID = doc.id;
        const docData = doc.data();
        const card = createRequestTemplate({
          ...docData,
          docID: docID,
        });

        document.getElementById("requests-go-here").appendChild(card);
      });
    });
});

//Limits the number of characters in a string of text.
//Cuts the text off at the end of the previous word if it is too large.
function ApplyLimiter(maxChar, text) {
  var result = "";
  var segments = text.split(" ");
  var i = 0;

  while (result.length < Number(Number(maxChar) - Number(3))) {
    if (result.length >= text.length) break;
    if (
      result.length + segments[i].length + Number(1) >=
      Number(Number(maxChar) - Number(3))
    )
      break;
    result += " " + segments[i];
    i++;
  }

  if (
    result.length >= Number(Number(maxChar) - Number(3)) ||
    result.length <= 0
  ) {
    console.log("too long");
    return text.substring(0, Number(Number(maxChar) - Number(3))) + "...";
  }

  if (result.length < text.length) result += "...";

  return result;
}
