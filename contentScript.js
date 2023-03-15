let mode = 0; //0表示normal模式 1: search模式
let isShow = false; //表示窗口有没有显示
let bindings = "abcdehijklmnopqrstuvwxyz".split(""); // 可以映射成关键字的字母
var data = {}; //所有数据
let activeElement = null;
let windowElement = null;
let curKey = "";
let key2IndexMap = {};
let pinyin2IndexMap = {};

document.addEventListener("keydown", function (event) {
  console.log(mode);
  if (chrome.runtime?.id) {
    //读取存储中的信息
    chrome.storage.sync.get().then((map) => {
      //   data = map.sort((a, b) => {
      //     a.count - b.count;
      //   });
      if (event.key === "i" && event.altKey) {
        toggleWindow(map);
        return;
      } else if (event.key === "/") {
        toggleSearchMode();
        return;
      } else if (event.key === "Backspace") {
        curKey = curKey.slice(0, curKey.length - 1);
      }
      if (isShow) {
        if (bindings.includes(event.key)) curKey += event.key;
        highlight();
        if (mode == 1) {
          //search
          let tmpData = {};
          for (let key in data) {
            if (data[key].pinyin.startsWith(curKey)) tmpData[key] = data[key];
          }
          updateWindowContent(windowElement, tmpData);
          return;
        }
        //normal
        if (key2IndexMap[curKey])
          inputContentToActiveElement(data[key2IndexMap[curKey]]);
      }
    });
  }
});

const highlight = () => {
  //normal模式搜索key字段
  let s = "key";
  //search模式搜索pinyin字段
  if (mode == 1) s = "pinyin";
  for (let key in data) {
    const ele = data[key].element;
    if (data[key][s].startsWith(curKey)) highlightElement(ele);
    else delhighlightElement(ele);
  }
};

const highlightElement = (ele) => {
  ele.setAttribute("class", "form-input-box heightlight");
};

const delhighlightElement = (ele) => {
  ele.setAttribute("class", "form-input-box");
};

const toggleWindow = (map) => {
  if (isShow) {
    closeWindow();
  } else {
    data = map;
    const keys = generateKeysToBindings();
    bindingKeysToData(keys);
    openWindow();
  }
};

const closeWindow = () => {
  // 如果弹窗已经显示，则删除弹窗元素并将标记变量设置为 false
  windowElement.parentNode.removeChild(windowElement);
  isShow = false;
  chrome.storage.sync.set(data);
  data = {};
  curKey = "";
  mode = 0;
};

const openWindow = () => {
  activeElement = document.activeElement;
  windowElement = document.createElement("div");
  windowElement.id = "my-popup";
  updateWindowContent(windowElement, data);
  document.body.appendChild(windowElement);
  isShow = true;
  return windowElement;
};

const updateWindowContent = (windowElement, data) => {
  windowElement.innerHTML = "";
  //一列最多放25行
  let maxRowPerCol = 25;
  let keys = Object.keys(data);
  let colCount = Math.ceil(keys.length / maxRowPerCol);
  for (let col = 0; col < colCount; col++) {
    const colDiv = bulidColumn(maxRowPerCol, col, data);
    windowElement.appendChild(colDiv);
  }
};

const bulidColumn = (maxRowPerCol, col, data) => {
  const colDiv = document.createElement("div");
  colDiv.setAttribute("class", "column");
  for (let row = 0; row < maxRowPerCol; row++) {
    let dataItemKey = Object.keys(data)[col * maxRowPerCol + row];
    if (!dataItemKey) {
      break;
    }
    let name = data[dataItemKey].name;
    const item = document.createElement("div");
    item.setAttribute("class", "form-input-box");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      inputContentToActiveElement(data[dataItemKey]);
    });
    data[dataItemKey].element = item;
    item.innerHTML = `
                <abcd class="key">${data[dataItemKey].key}</abcd>
                <abcd class="value">${name}</abcd>
            `;
    colDiv.appendChild(item);
  }
  return colDiv;
};

const toggleSearchMode = () => {
  curKey = "";
  if (mode == 1) {
    mode = 0;
    windowElement.style.backgroundColor = "#fff";
  } else {
    mode = 1;
    windowElement.style.backgroundColor = "#e1e1e1";
  }
};

const generateKeysToBindings = () => {
  let count = Object.keys(data).length;
  let preffix = "";
  let keys = [];
  let p = 0;
  while (true) {
    for (let i = 0; i < bindings.length; i++) {
      keys.push(preffix + bindings[i]);
      p++;
      if (p === count) {
        return keys;
      }
    }
    preffix = keys.shift();
    p--;
  }
};

const bindingKeysToData = (bindingKeys) => {
  let p = 0;
  for (let k in data) {
    let key = bindingKeys[p++];
    data[k]["key"] = key;
    key2IndexMap[key] = k;
  }
};

const inputContentToActiveElement = (value) => {
  value.count++;
  if (!activeElement) return;
  activeElement.value = value.content;
  activeElement.dispatchEvent(new Event("change"));
  activeElement.dispatchEvent(new Event("input"));
  toggleWindow();
};
