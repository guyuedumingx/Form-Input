const title = document.querySelector("#title");
const content = document.querySelector("#content");
const jc = document.querySelector("#json-content");
const saveBtn = document.querySelector("#save-btn");
const configInfo = document.querySelector("#config-info");
var { pinyin } = pinyinPro;

const pattern = /([\u4e00-\u9fa5]+|[a-zA-Z]+)/g;

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

// 获取存储在插件中的配置
chrome.storage.sync.get().then((data) => {
  let html = "";
  for (let key in data) html += `<div>${key} : ${data[key]}</div>`;
  configInfo.innerHTML = html;
});

saveBtn.onclick = function () {
  if (title.value !== "" && content.value !== "") {
    chrome.storage.sync.set({
      [title.value]: {
        name: title.value,
        content: content.value,
        pinyin: toPinyin(title.value),
        count: 0,
      },
    });
    title.value = "";
    content.value = "";
  }
  if (jc.value !== "") {
    let json = JSON.parse(jc.value);

    for (let key in json) {
      chrome.storage.sync.set({
        [key]: {
          name: key,
          content: json[key],
          pinyin: toPinyin(key),
          count: 0,
        },
      });
    }
    jc.value = "";
  }
};
