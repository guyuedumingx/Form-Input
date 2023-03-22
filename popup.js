const titleFeild = document.querySelector("#title");
const contentFeild = document.querySelector("#content");
const jsonFeild = document.querySelector("#json-content");
const saveBtn = document.querySelector("#save-btn");
const configInfo = document.querySelector("#config-info");
let data = [];
var { pinyin } = pinyinPro;

const pattern = /([\u4e00-\u9fa5]+|[a-zA-Z]+)/g;

// chrome.storage.sync.get().then((localMap) => {
//   let html = "";
//   for (let i in data) html += `<div>${i} : ${data[i].content}</div>`;
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

    for (let key in json) {
      saveToData(key, json[key]);
    }
    jsonFeild.value = "";
  }
  chrome.storage.sync.set({ data: data });
};

const saveToData = (key, value) => {
  let pinyin = toPinyin(key);
  console.log(data);
  data.push({
    key: pinyin,
    name: key,
    content: value,
    pinyin: pinyin,
    count: 0,
  });
};

const toPinyin = (text) => {
  // 使用 match 方法将匹配的结果保存到数组中
  const result = text.match(pattern);
  if (!result) return "";

  // 定义用于保存转换结果的数组
  const initials = [];

  // 循环遍历匹配的结果
  for (let i = 0; i < result.length; i++) {
    const word = result[i];
    // 如果是中文，将其转换成拼音首字母
    if (/^[\u4e00-\u9fa5]+$/.test(word)) {
      const initial = pinyin(word, {
        pattern: "first",
        toneType: "none",
      });
      initials.push(initial.split(" ").join(""));
    }
    // 如果是英文，取每个单词的首字母小写
    else if (/^[a-zA-Z]+$/.test(word)) {
      const initial = word[0].toLowerCase();
      initials.push(initial);
    }
  }
  return initials.join("");
};
