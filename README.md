# 10-Minute Learn Challenge

> Get a topic. Research it yourself for 10 minutes. Explain it in 1 minute.

A minimal, local-first web app for practicing rapid learning, information synthesis, and verbal expression. The app deliberately provides no explanations, search results, hints, AI assistance, recording, or scoring—the learning work belongs to the user.

[中文说明](#中文说明) · [English](#english)

## English

### What it does

- Selects a random learning topic from **1,554 English–Chinese prompts** across 10 categories
- Offers separate English and Chinese interface modes
- Uses an animated text roller for fast random selection
- Runs an accurate 10-minute research countdown using timestamps
- Supports pausing, resuming, and ending research early
- Runs a 1-minute speaking countdown
- Collects three optional reflection notes
- Stores completed challenges and active progress in `localStorage`
- Restores an active challenge after a refresh or tab switch
- Works on desktop and mobile

### Product principles

- No AI-generated explanations or summaries
- No built-in search results or learning materials
- No speech recognition, recording, or scoring
- No account, backend, or payment system
- The app provides only a topic, a time limit, a structure, and a practice record

### Categories

Computer Science, Technology, Business, Finance, Economics, Psychology, Science, Philosophy, Sociology, and History.

### Run locally

The production version is a standalone HTML application.

```bash
npm install
npm run build
```

Then serve the `dist` directory with any static file server, or open `static/index.html` directly in a modern browser.

### Project structure

```text
static/index.html   Standalone application (HTML, CSS, and JavaScript)
build-static.mjs    Static build script
dist/               Generated deployment output
DESIGN.md           Linear-inspired design-system reference
```

### Data and privacy

All challenge progress, reflections, and history remain in the browser's local storage. The app does not send this information to a server.

---

## 中文说明

> 获取一个题目，自主研究 10 分钟，然后用 1 分钟清楚地讲出来。

这是一个极简、本地优先的快速学习练习工具，用于训练信息搜索、筛选、知识整合和口头表达能力。网站不会提供解释、搜索结果、提示、AI 辅助、录音或评分；学习过程由用户自己完成。

### 主要功能

- 从 10 个分类的 **1,554 个中英双语选题**中随机抽取题目
- 提供独立的中文界面与英文界面
- 使用纯文字滚动动画进行随机选题
- 使用时间戳实现准确的 10 分钟研究倒计时
- 支持暂停、继续和提前结束研究
- 提供 1 分钟口头讲述倒计时
- 提供三个可选的复盘问题
- 使用 `localStorage` 保存挑战历史和当前进度
- 刷新页面或切换标签页后可恢复正在进行的挑战
- 支持桌面端和移动端

### 产品原则

- 不提供 AI 生成的解释或总结
- 不内置搜索结果或学习资料
- 不提供语音识别、录音或评分
- 不需要账号、后端或付费系统
- 产品只提供题目、时间限制、练习结构和历史记录

### 选题分类

计算机科学、科技、商业、金融、经济学、心理学、科学、哲学、社会学和历史。

### 本地运行

生产版本是一个独立的 HTML 应用。

```bash
npm install
npm run build
```

构建后可使用任意静态文件服务器打开 `dist` 目录，也可以直接使用现代浏览器打开 `static/index.html`。

### 项目结构

```text
static/index.html   独立应用，包含 HTML、CSS 和 JavaScript
build-static.mjs    静态构建脚本
dist/               构建生成的部署文件
DESIGN.md           参考的 Linear 风格设计规范
```

### 数据与隐私

挑战进度、复盘内容和历史记录仅保存在浏览器本地存储中，不会发送到服务器。

## License

No license has been specified yet.
