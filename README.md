#Live Demo: https://rap-lyric-lab.onrender.com
## 项目截图

![Rap Lyric Lab 首页](assets/screenshots/home.png)

![歌词生成结果](assets/screenshots/generate-result.png)
# Rap Lyric Lab

一个中文说唱歌词生成网站。项目支持 Node 后端、SQLite 数据库、rapper / 专辑风格选择、关键词驱动生成、押韵助手、素材库、生成自审、历史记录、Markdown 导出和 PWA 离线访问。

> 公开仓库不内置完整歌词原文，只保留抽象后的风格参数和原创生成模板。启动后端时，登录用户的素材库和历史会保存到 SQLite；静态部署时会自动回退到浏览器本地。

## 在线体验

在线版本：

```text
https://rap-lyric-lab.onrender.com
```

Render 免费实例长时间无人访问后会休眠，首次打开可能需要等待 30 到 60 秒。

## 功能亮点

- Node 后端 + SQLite：账号、素材库、生成历史可持久化到数据库
- Rapper 风格库：内置 `Asen 艾志恒`、`Sasi`，并支持用户继续添加其他 rapper
- 专辑级风格：每个 rapper 可细分专辑/风格，并展示专辑封面
- 关键词生成：用户输入核心关键词后，歌词会围绕第一个关键词展开
- 多候选生成：每次生成都会随机选择叙事走向和句式蓝图，减少固定套路
- 生成自审：检查关键词贯穿、叙事走向、句式新鲜度、前后承接、画面感和收束
- 押韵助手：输入中文或英文词语，生成中文近韵、英文近韵和句尾短语
- 本地素材库：可添加歌手、专辑/风格名、封面、重要词语和歌词文本
- 账号隔离：登录后使用 SQLite 保存个人素材；后端不可用时回退到浏览器本地
- 历史记录：保存当前账号最近 8 次主动生成结果
- 导出 Markdown：可导出歌词、参数和自审报告
- PWA：支持安装到桌面，并在部署环境下缓存静态资源
- 不需要 API Key；后端默认只把登录用户数据写入本项目 SQLite
- 无微信登录、无手机号验证码登录

## 技术栈

- Node.js 原生 `http` 服务
- Node.js `node:sqlite` + SQLite
- HTML5 / CSS3 / Vanilla JavaScript
- `localStorage` 本地回退持久化
- PBKDF2-SHA256：后端和前端本地模式都使用加盐密码哈希
- FileReader API：本地封面预览
- Service Worker + Web App Manifest：PWA 和离线缓存
- GitHub Pages：可做静态演示；数据库版需要 Node 部署平台

## 本地运行

推荐启动 Node 后端，这样会自动创建 SQLite 数据库：

```bash
cd rap-lyric-generator
npm start
```

然后访问：

```text
http://localhost:5173
```

数据库文件会生成在：

```text
data/rap_lyric_lab.sqlite
```

如果只直接打开 `index.html`，仍然可以使用前端功能，但素材库和历史只保存在当前浏览器。

为了只测试静态前端，也可以启动静态服务器：

```bash
cd rap-lyric-generator
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173
```

## GitHub 上传步骤

### 方式一：网页上传，最简单

1. 打开 [GitHub](https://github.com) 并登录。
2. 点击右上角 `+`，选择 `New repository`。
3. Repository name 填：`rap-lyric-lab`。
4. 选择 `Public`。
5. 不用勾选 README，因为本项目已经有 `README.md`。
6. 创建仓库后，点击页面里的 `uploading an existing file`。
7. 把本目录里的所有文件拖进去：
   - `index.html`
   - `README.md`
   - `LICENSE`
   - `manifest.webmanifest`
   - `sw.js`
   - `src/`
   - `assets/`
8. 点击底部绿色按钮 `Commit changes`。

### 方式二：命令行上传

```bash
cd rap-lyric-generator
git init
git add .
git commit -m "Initial commit: Rap Lyric Lab"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/rap-lyric-lab.git
git push -u origin main
```

## GitHub Pages 发布步骤

1. 进入 GitHub 仓库页面。
2. 点击 `Settings`。
3. 左侧点击 `Pages`。
4. `Build and deployment` 里选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 `Save`。
6. 等 1 到 3 分钟，页面上会出现公开访问链接。
7. 你的大众网站链接格式一般是：

```text
https://你的GitHub用户名.github.io/rap-lyric-lab/
```

注意：GitHub Pages 只能运行静态前端，不能运行 Node 后端和 SQLite。要让大众访问数据库版，需要部署到支持 Node 的平台，例如 Render、Railway、Fly.io、VPS 或自有服务器。

## Node 后端部署建议

1. 把仓库上传到 GitHub。
2. 在 Render / Railway 新建 Web Service。
3. 连接这个 GitHub 仓库。
4. Start Command 填：

```bash
npm start
```

5. 设置持久化磁盘，把项目里的 `data/` 目录作为持久化目录。
6. 部署完成后访问平台给你的 HTTPS 链接。

如果平台没有持久化磁盘，SQLite 文件会在服务重启后丢失。真正上线建议使用平台提供的 PostgreSQL，或给 SQLite 配持久化 volume。

## 简历写法

可以放在项目经历里：

```text
Rap Lyric Lab｜中文说唱歌词生成网站
- 独立开发全栈歌词生成应用，支持 Node 后端、SQLite 数据库、rapper/专辑风格选择、关键词驱动生成、押韵助手、素材库和 Markdown 导出。
- 设计多候选生成与规则化自审机制，对关键词贯穿、叙事走向、句式重复率、前后承接和段落收束进行评分，并自动补充承接句。
- 使用 SQLite 设计用户、会话、素材快照和生成历史表，并提供登录、素材同步、历史记录 API。
- 接入 PBKDF2-SHA256、HttpOnly Cookie、FileReader、Service Worker 和 Web App Manifest，实现密码加盐哈希、会话管理、图片预览、PWA 安装和离线缓存。
- 支持后端数据库模式和静态本地回退模式，降低部署门槛，同时保留真实持久化能力。
```

## 内容与版权建议

公开发布时建议遵守这几条：

- 不要把未经授权的完整歌词原文提交到仓库
- 仓库里只放抽象后的风格参数、原创模板和用户界面代码
- 让用户在网页里本地导入自己的素材
- 如果面向大众使用，默认把脏话强度调低
- 如果未来接入后端模型，需要补充隐私政策、内容安全策略和版权处理机制

## 项目结构

```text
.
├── assets
│   └── covers
│       └── *.jpg
├── data
│   └── .gitkeep
├── index.html
├── LICENSE
├── manifest.webmanifest
├── package.json
├── README.md
├── server.js
├── sw.js
└── src
    ├── app.js
    ├── engine.js
    └── styles.css
```

## 后续可扩展

- 增加更多公开可用的原创风格包
- 增加可视化生成参数预设
- 增加歌词结构编辑器，比如 Intro / Verse / Hook / Bridge 可拖拽
- 增加更大的中文押韵词库
- 接入后端同步账号，但需要明确隐私和版权策略
