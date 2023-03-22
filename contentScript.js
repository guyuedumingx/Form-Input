let mode = 0; //0表示normal模式 1: search模式
let isShow = false; //表示窗口有没有显示
let bindings = "abcdefghijklmnopqrstuvwxyz".split(""); // 可以映射成关键字的字母
var data = {}; //所有数据
let activeElement = null;
let windowElement = null;
let curKey = "";
let key2IndexMap = {};
let pinyin2IndexMap = {};

document.addEventListener("keydown", function (event) {
  if (chrome.runtime?.id) {
    //读取存储中的信息
    chrome.storage.sync.get().then((map) => {
      if (event.key === "i" && event.altKey) {
        toggleWindow(map["data"]);
        return;
      } else if (event.key === "/") {
        toggleSearchMode();
        return;
      } else if (event.key === "Backspace") {
        curKey = curKey.slice(0, curKey.length - 1);
      }
      if (isShow) {
        if (bindings.includes(event.key)) curKey += event.key;
        highlight(data, mode, curKey);
        if (mode == 1) {
          //search
          // let tmpData = {};
          // for (let key in data) {
          //   if (data[key].pinyin.startsWith(curKey)) tmpData[key] = data[key];
          // }
          // updateWindowContent(windowElement, tmpData);
          return;
        }
        //normal
        if (key2IndexMap[curKey])
          setContentAndCount(activeElement, data[key2IndexMap[curKey]]);
      }
    });
  }
});

const highlight = (data, mode, curKey) => {
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

const toggleWindow = (map = {}) => {
  if (isShow) {
    closeWindow(data);
    data = {};
    curKey = "";
  } else {
    data = map;
    _openWindow(data);
  }
  isShow = !isShow;
  mode = 0;
};

const closeWindow = (data) => {
  windowElement.parentNode.removeChild(windowElement);
  chrome.storage.sync.set(data);
};

const _openWindow = (data) => {
  activeElement = document.activeElement;
  windowElement = document.createElement("div");
  windowElement.id = "my-popup";
  updateWindowContent(windowElement, Object.values(data));
  document.body.appendChild(windowElement);
  return windowElement;
};

const updateWindowContent = (windowElement, data = []) => {
  const keys = generateKeysByBindings(bindings, data.length);
  //按照使用次数排序
  // data = data.sort((a, b) => {
  //   return b.count - a.count;
  // });
  key2IndexMap = bindingKeysToData(keys, data);
  windowElement.innerHTML = "";
  //一列最多放25行
  let maxRowPerCol = 25;
  let colCount = Math.ceil(data.length / maxRowPerCol);
  for (let col = 0; col < colCount; col++) {
    const colDiv = _bulidColumn(maxRowPerCol, col, data);
    windowElement.appendChild(colDiv);
  }
};

const _bulidColumn = (maxRowPerCol, col, data = []) => {
  const colDiv = document.createElement("div");
  colDiv.setAttribute("class", "column");
  for (let row = 0; row < maxRowPerCol; row++) {
    if (col * maxRowPerCol + row >= data.length) break;
    let dataItem = data[col * maxRowPerCol + row];
    const item = document.createElement("div");
    item.setAttribute("class", "form-input-box");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      setContentAndCount(activeElement, dataItem);
    });
    dataItem.element = item;
    item.innerHTML = `
                <abcd class="key">${dataItem.key}</abcd>
                <abcd class="value">${dataItem.name}</abcd>
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

const generateKeysByBindings = (bindings, count) => {
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

const bindingKeysToData = (bindingKeys, data) => {
  let key2IndexMap = {};
  for (let k = 0; k < data.length; k++) {
    let key = bindingKeys[k];
    data[k].key = key;
    key2IndexMap[key] = data[k].name;
  }
  return key2IndexMap;
};

const setContentAndCount = (activeElement, obj) => {
  obj.count += obj.count;
  if (!activeElement) return;
  activeElement.value = obj.content;
  activeElement.dispatchEvent(new Event("change"));
  activeElement.dispatchEvent(new Event("input"));
  toggleWindow();
};
