import { onAuthChanged } from "/js/app/firebase.js";
var storageRef = storage.ref();

// Uploads image on Firebase and returns response.
const uploadImage = (file) => {
  const fileName = String(new Date().toLocaleString('en') + "[" + file.name + "]").replaceAll(" ", "");

  return new Promise((resolve, reject) => {
    onAuthChanged((user) => {
      const fileAddress = `${user.uid}/images/${fileName}`;
      storage.ref()
        .child(fileAddress)
        .put(file)
        .then((snapshot) => {
          storageRef
            .child(fileAddress)
            .getDownloadURL()
            .then((url) => {
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};


export {
  uploadImage,
}