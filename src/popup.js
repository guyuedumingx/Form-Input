const titleFeild = document.querySelector("#title");
const contentFeild = document.querySelector("#content");
const jsonFeild = document.querySelector("#json-content");
const saveBtn = document.querySelector("#save-btn");
const configInfo = document.querySelector("#config-info");
var { pinyin } = pinyinPro;

// chrome.storage.local.get().then((data) => {
//   let html = "";
//   for (let key in data) html += `<div>${key} : ${data[key].content}</div>`;
//   configInfo.innerHTML = html;
// });

saveBtn.onclick = function () {
  if (titleFeild.value !== "" && contentFeild.value !== "") {
    saveToData(titleFeild.value, contentFeild.value);
    titleFeild.value = "";
    contentFeild.value = "";
  }
  if (jsonFeild.value !== "") {
    let json = JSON.parse(jsonFeild.value);
    let len = Object.values(json).length;
    for (let key in json) {
      saveToData(key, json[key], len--);
    }
    jsonFeild.value = "";
  }
};
