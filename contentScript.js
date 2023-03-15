let isShow = false;
let activeElement = null;
let bindings = "abcdehijklmnopqrstuvwxyz";

function getKeys(count) {
  let preffix = "";
  let res = [];
  let p = 0;
  while (true) {
    for (let i = 0; i < bindings.length; i++) {
      res.push(preffix + bindings[i]);
      p++;
      if (p === count) {
        return res;
      }
    }
    preffix = res.shift();
    p--;
  }
}

const rowMaxCount = 25;

const itemMap = {};

const buildHelpWindow = (div, data) => {
  activeElement = document.activeElement;
  //   console.log(activeElement);
  //   let left = activeElement.offsetLeft;
  //   let top = activeElement.offsetTop;
  //   let height = activeElement.offsetHeight;
  //   console.dir(activeElement);
  //   let bottom = top + height;
  //   div.style.left = `${left}px`;
  //   div.style.top = `${top + height + 5}px`;
  div.id = "my-popup";
  let keys = Object.keys(data);
  let colCount = Math.ceil(keys.length / rowMaxCount);
  for (let i = 0; i < colCount; i++) {
    const aaa = document.createElement("div");
    aaa.setAttribute("class", "column");
    for (let j = 0; j < rowMaxCount; j++) {
      let key = keys[i * rowMaxCount + j];
      if (!key) {
        break;
      }
      let name = Object.keys(data[key])[0];
      let value = Object.values(data[key])[0];
      const item = document.createElement("div");
      item.setAttribute("class", "form-input-box");
      item.data = value;
      item.addEventListener("click", (e) => {
        e.preventDefault();
        handler(value);
      });
      itemMap[key] = item;
      item.innerHTML = `
                <abcd class="key">${key}</abcd>
                <abcd class="value">${name}</abcd>
            `;
      aaa.appendChild(item);
    }
    div.appendChild(aaa);
  }
  return div;
};

let data = {};
const closeHelpWindow = () => {
  // 如果弹窗已经显示，则删除弹窗元素并将标记变量设置为 false
  const popup = document.querySelector("#my-popup");
  popup.parentNode.removeChild(popup);
  isShow = false;
  data = {};
};

const handler = (value) => {
  if (!activeElement) {
    return;
  }
  activeElement.value = value;
  activeElement.dispatchEvent(new Event("change"));
  activeElement.dispatchEvent(new Event("input"));
  closeHelpWindow();
};
let pref = "";

document.addEventListener("keydown", function (event) {
  // 获取存储在插件中的配置
  if (chrome.runtime?.id) {
    chrome.storage.sync.get().then((map) => {
      let keys = getKeys(Object.keys(map).length);

      if (event.key === "i" && event.altKey) {
        if (isShow) {
          closeHelpWindow();
        } else {
          let p = 0;
          for (let key in map) {
            let index = keys[p++];
            data[index] = {
              [key]: map[key],
            };
          }
          const div = buildHelpWindow(document.createElement("div"), data);
          document.body.appendChild(div);
          isShow = true;
        }
      } else if (isShow) {
        if (bindings.includes(event.key)) {
          pref += event.key;
          if (keys.includes(pref)) {
            let value = Object.values(data[pref])[0];
            handler(value);
            pref = "";
          } else {
            for (let i = 0; i < keys.length; i++) {
              if (keys[i].startsWith(pref)) {
                itemMap[keys[i]].setAttribute(
                  "class",
                  "form-input-box heightlight"
                );
              } else {
                itemMap[keys[i]].setAttribute("class", "form-input-box");
              }
            }
          }
        }
      } else if (event.keyCode == 27 && isShow) {
        closeHelpWindow();
      }
    });
  }
});
