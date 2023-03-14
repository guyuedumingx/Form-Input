chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    alert("You pressed the " + request.command + " hotkey!");
});

// document.addEventListener("keydown", function(event) {
//     alert(event.key);
// });
let isShow = false;

const rowMaxCount = 25;

const buildHelpWindow = (div, data) => {
    div.id = "my-popup";
    let keys = Object.keys(data);
    let colCount = Math.ceil(keys.length / rowMaxCount);
    for (let i = 0; i < colCount; i++) {
        const aaa = document.createElement('div');
        aaa.setAttribute('class', 'column');
        for (let j = 0; j < rowMaxCount; j++) {
            let key = keys[i * rowMaxCount + j];
            if (!key) {
                break;
            }
            let name = Object.keys(data[key])[0];
            const item = document.createElement('div');
            item.setAttribute('class', 'form-input-box');
            item.innerHTML = `
                <abcd class="key">${key}</abcd>
                <abcd class="value">${name}</abcd>
            `;
            aaa.appendChild(item);
        }
        div.appendChild(aaa);
    }
    return div;
}

let data = {}
const closeHelpWindow = () => {
    // 如果弹窗已经显示，则删除弹窗元素并将标记变量设置为 false
    const popup = document.querySelector("#my-popup");
    popup.parentNode.removeChild(popup);
    isShow = false;
    data = {}
}

let keys = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];

document.addEventListener("keydown", function (event) {
    // 获取存储在插件中的配置
    if (chrome.runtime?.id) {
        chrome.storage.sync.get().then((map) => {
            if (event.key === "i" && event.altKey) {
                if (isShow) {
                    closeHelpWindow();
                } else {
                    let p = 0;
                    for (let key in map) {
                        let index = keys[p++];
                        data[index] = {
                            [key]: map[key]
                        };
                    }
                    const div = buildHelpWindow(document.createElement("div"), data);
                    document.body.appendChild(div);
                    isShow = true;
                }
            } else if (data[event.key] && isShow) {
                let value = Object.values(data[event.key])[0];
                document.activeElement.value = value;
                document.activeElement.dispatchEvent(new Event('change'));
                document.activeElement.dispatchEvent(new Event('input'));
                closeHelpWindow()
            } else if (event.keyCode == 27 && isShow) {
                closeHelpWindow()
            }
        })
    }
});