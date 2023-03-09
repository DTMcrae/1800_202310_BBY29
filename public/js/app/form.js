const addOptions = (selectClassName, optionsArray) => {
  const dom = document.getElementsByClassName(selectClassName);
  if (dom?.length < 1) {
    // console.warn("addOptions: Can not find class name " + selectClassName)
    return false;
  }
  if (optionsArray.length < 0) {
    // console.warn("addOptions: Can not find optionsArray " + optionsArray)
    return false;
  }
  for(let i = 0; i < dom.length; i++) {
    const selectedObj = dom[0];
    for(const category of optionsArray) {
      var option = document.createElement("option");
      option.text = category;
      selectedObj.add(option);
    }
  }
};

const isValidLength = (x, min, max) => {
  if (!x || x.length === 0) return null;
  return !(x.length > max || x.length < min) ? 'ok' : 'error';
};


export {
  addOptions,
  isValidLength
};