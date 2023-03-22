let mode = 0; //0表示normal模式 1: search模式
let isShow = false; //表示窗口有没有显示
let bindings = "abcdefghijklmnopqrstuvwxyz".split(""); // 可以映射成关键字的字母
var data = {}; //所有数据
let activeElement = null;
let windowElement = null;
let curKey = "";
let curTargetIndex = 0;
let key2IndexMap = {};
let pinyin2IndexMap = {};
//候选列表
let candidateList = [];

document.addEventListener("keydown", function (event) {
  if (chrome.runtime?.id) {
    if (event.key === "i" && event.altKey) {
      chrome.storage.sync.get().then((map) => {
        toggleWindow(map["data"]);
      });
      return;
    }
    if (isShow) {
      event.preventDefault();
      if (bindings.includes(event.key)) curKey += event.key;
      if (event.key === "/") {
        toggleSearchMode();
        return;
      } else if (event.key === "Backspace") {
        curKey = curKey.slice(0, curKey.length - 1);
        candidateList = updateCandidateList(data, mode, curKey);
      } else if (event.key === "Enter") {
        select(curTargetIndex);
        curTargetIndex = 0;
        return;
      } else if (event.key === "Tab") {
        curTargetIndex = (curTargetIndex + 1) % candidateList.length;
      } else if (event.key === "Tab" && event.shiftKey) {
        curTargetIndex = (curTargetIndex - 1) % candidateList.length;
      } else {
        candidateList = updateCandidateList(candidateList, mode, curKey);
      }
      highlightElements(candidateList, curKey, curTargetIndex);

      // if (candidateList.length == 1) select(0);
    }
  }
});

const select = (idx) => {
  if (candidateList.length > idx) {
    setContentAndCount(activeElement, candidateList[idx]);
    toggleWindow(data);
  }
};

const updateCandidateList = (
  candidateList,
  mode,
  curKey,
  match = (item, curKey, mode) => {
    return item.key.startsWith(curKey);
  }
) => {
  curTargetIndex = 0;
  let newCandidateList = [];
  for (let k in candidateList) {
    if (match(candidateList[k], curKey, mode))
      newCandidateList.push(candidateList[k]);
  }
  return newCandidateList;
};

const highlightElements = (elements, curKey, curTargetIndex) => {
  for (let key in data) {
    delhighlightElement(data[key].element);
  }
  if (curKey === "") return;
  for (let k = 0; k < elements.length; k++) {
    highlightElement(elements[k].element, k == curTargetIndex);
  }
};

const highlightElement = (ele, isTarget = false) => {
  if (!isTarget) ele.setAttribute("class", "form-input-box heightlight");
  else ele.setAttribute("class", "form-input-box heightlight-target");
};

const delhighlightElement = (ele) => {
  ele.setAttribute("class", "form-input-box");
};

const toggleWindow = (localData = []) => {
  if (isShow) {
    closeWindow(localData);
    data = [];
    curKey = "";
  } else {
    // data = data.sort((a, b) => {
    //   return a.key.localeCompare(b.key);
    // });
    data = localData.sort((a, b) => {
      return b.count - a.count;
    });
    candidateList = data;
    _openWindow(data);
  }
  isShow = !isShow;
  mode = 0;
};

const closeWindow = (data) => {
  windowElement.parentNode.removeChild(windowElement);
  chrome.storage.sync.set({ data: data });
};

const _openWindow = (data = []) => {
  activeElement = document.activeElement;
  windowElement = document.createElement("div");
  windowElement.id = "my-popup";
  updateWindowContent(windowElement, data);
  document.body.appendChild(windowElement);
  return windowElement;
};

const updateWindowContent = (windowElement, data = []) => {
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
      toggleWindow(data);
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

/**
 * 把对象填充到页面的活动元素中
 * @param {*} activeElement 当前页面被选中的元素
 * @param {*} obj 将要被选择的对象
 * @returns
 */
const setContentAndCount = (activeElement, obj) => {
  obj.count += obj.count;
  if (!activeElement) return;
  activeElement.value = obj.content;
  activeElement.dispatchEvent(new Event("change"));
  activeElement.dispatchEvent(new Event("input"));
};
