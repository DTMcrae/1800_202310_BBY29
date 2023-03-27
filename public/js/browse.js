import { createRequestTemplate } from "/js/templates/request-template.js";

firebase.auth().onAuthStateChanged((user) => {
  db.collection("requests")
    .orderBy("createdDate", "desc")
    .get()
    .then((requests) => {
      requests.forEach((doc) => {
        const docID = doc.id;
        const docData = doc.data();
        const card = createRequestTemplate({
          ...docData,
          title: ApplyLimiter(40, docData.title),
          details: ApplyLimiter(40, docData.details),
          location: ApplyLimiter(40, docData.location),
          docID: docID,
        });

        document.getElementById("requests-go-here").appendChild(card);
      });
    });
});

//Limits the number of characters in a string of text.
//Cuts the text off at the end of the previous word if it is too large.
function ApplyLimiter(maxChar, text = "") {
  var result = "";
  var segments = text?.split(" ");
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
    return text.substring(0, Number(Number(maxChar) - Number(3))) + "...";
  }

  if (result.length < text.length) result += "...";

  return result;
}
