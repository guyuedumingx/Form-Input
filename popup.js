const title = document.querySelector("#title");
const content = document.querySelector("#content");
const jc = document.querySelector("#json-content");
const saveBtn = document.querySelector("#save-btn");
const configInfo = document.querySelector("#config-info");

// 获取存储在插件中的配置
chrome.storage.sync.get().then((data) => {
  configInfo.innerHTML = data;
});

// 切换插件的启用状态
saveBtn.onclick = function() {
  if(title.value !== "" && content.value !==""){
    chrome.storage.sync.set({ [title.value]: content.value });
    title.value = "";
    content.value = "";
  }
  if(jc.value !== ""){
    let json = JSON.parse(jc.value)
    chrome.storage.sync.set(json);
    jc.value = "";
  }
};
