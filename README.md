# Form Input

利用快捷键快速填入表单内容，主要用于求职时各种招聘网站的简历填写

## Quick Start

1. 从`release`页面下载`crx`文件
2. 在浏览器拓展中加载本插件
3. 导入`json`文件作为预设信息
4. 在需要输入的页面按住快捷键 `Alt` + `i` 调出插件页面
5. 键入指定快捷键快速填充

> 有些网站填充后会自动覆盖，这时候只需要在第 5 步之后快速的打一个空格键，再删掉，就不会被清空内容

## Install from source

1. 下载源代码

```
git clone https://github.com/guyuedumingx/Form-Input.git
```

2. 安装流程

```
chrome浏览器 -> 拓展 -> 管理拓展 -> 加载已解压插件 -> 选择form-input/src文件夹
```

## Tips

如果使用`crx`方式导入拓展后无法使用，显示`此扩展不是来自任何已知来源，可能是在你不知情的情况下添加的。`建议使用解压文件夹方式导入。

> 该问题原因是作者懒得上架拓展仓库, 本拓展未经过官方安全审核。但是本人保证，源码公开，没有任何病毒和收集客户信息的行为。

## Json Type

支持导入`Json`格式的预设信息

```json
{
  "姓名": "张三",
  "性别": "男",
  "年龄": "28",
  "出生日期": "1994-01-01",
  "手机号": "13812345678",
  "邮箱": "zhangsan@example.com",
  "籍贯": "山东济南"
}
```

## ShortCuts

`Alt` + `i` : 打开或关闭面板  
`/` : 切换搜索模式 (暗色搜索模式下，不需要从头匹配， 如：`个人简介`为`grjj`，键入`jj`也能搜索到)

## TODO

1. add crx to release
2. search the content feild

## ScreenShot

![extensions](/src/images/Snipaste_2023-03-18_13-21-24.png)
![popup](/src/images/Snipaste_2023-03-18_13-23-32.png)
![popup](/src/images/Snipaste_2023-03-18_13-27-16.png)

## Development

welcome to pull request
