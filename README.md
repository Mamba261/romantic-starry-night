# Romantic Starry Night · 写给你的星空

一个无需构建工具的浪漫互动网页，适合送给喜欢的人。使用原生 HTML、CSS 和 JavaScript，可直接部署到 GitHub Pages。

## 功能

- Canvas 动态星空与可触碰的爱心粒子
- 6 张照片回忆卡片，点击可查看大图和文字
- 愿望发射动画；愿望保存在访问者当前浏览器的 LocalStorage
- 响应式布局，适配手机和桌面，并支持“减少动态效果”系统设置

## 使用

直接打开 `index.html`，或访问 [在线演示](https://mamba261.github.io/romantic-starry-night/)。

替换照片和故事：

1. 在仓库根目录创建 `images/`，放入自己的照片，例如 `photo-1.jpg`。
2. 编辑 `app.js` 顶部的 `memories` 数组，为每一项填写 `title`、`text`，并将 `image` 改为 `./images/photo-1.jpg` 等路径。
3. 建议压缩照片后再上传，便于手机网络加载。

愿望只保存在当前设备的当前浏览器中，不会跨设备同步；清除浏览器数据后会消失。

## 学习与改造

想了解星空、爱心粒子、照片卡片和愿望存储的实现方式，可阅读 [LEARN.md](./LEARN.md)。

## 许可

MIT License。欢迎学习、修改和分享。使用时请保留许可文件。
