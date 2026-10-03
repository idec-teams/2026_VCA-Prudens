# VCA-Prudens Wiki 修改与发布指南

本指南面向不熟悉代码的队伍成员。当前网站保留一份可继续开发的 React/Vinext 源码，同一份源码可以发布到 iDEC 官方 GitHub Pages 和现有 Sites 网站。

## 一、最稳妥的修改方式

把修改材料放进当前源码目录，或在对话中上传给 Codex，然后明确说明：

1. 要改哪个页面、哪一段或哪个位置；
2. 旧内容和新内容分别是什么；
3. 是否有新图片、GIF、视频、文本或表格文件；
4. 哪些现有效果必须保留；
5. 要发布到 GitHub Pages、Sites，还是两处都发布。

推荐使用下面的任务模板：

```text
请继续维护 VCA-Prudens 2026 iDEC Wiki，只使用 PROJECT_HANDOFF.md 指定的当前源码。
页面：
位置：
修改内容：
新附件：
必须保留：原生 href、首页动效、RNA 阅读进度、四叶草回顶、Methods/Description 全文、最终头像裁切。
完成后：运行测试和预览；同步发布到 2026_VCA-Prudens GitHub Pages 和原 Sites 项目；确认两处成功后更新交接文档。
```

不要在聊天、文档、代码或 Git 提交中提供账号密码、验证码或访问令牌。登录时优先使用已经登录的浏览器；出现验证码或二次验证时由账号本人完成。

## 二、常用内容对应文件

| 内容 | 主要位置 | 修改说明 |
| --- | --- | --- |
| 首页文字、插图、流程和页脚 | `app/page.tsx`、`app/HomeStory.tsx` | 保留首页滚动动效和原生链接。 |
| 首页样式与动画 | `app/home-story.css` | CSS 动画、响应式布局和配色在这里。 |
| 全站导航 | `app/SiteHeader.tsx`、`app/wiki-data.ts` | 链接使用原生 `href`，不要改成拦截式跳转。 |
| RNA 阅读进度、四叶草回顶 | `app/ReadingControls.tsx`、`app/globals.css` | 不要删除；修改后检查长页面与手机端。 |
| Description 与搬入其中的旧 Method 正文 | `app/wiki-articles.json`、`app/WikiArticle.tsx` | 旧 methods 数据完整保留，显示在 Challenge 与 Project Description 之间；不要自行改写。 |
| Design/Methods/Engineering/Results/Analysis | `app/report-articles.json`、`app/ReportArticle.tsx` | 以 2026-10-04 上传的五份 Word 为准；正文、图注、参考文献一字不漏，审计见 docs/report-source-audit-20261004.json。 |
| Model/Experiment | `app/paper-articles.json`、`app/PaperArticle.tsx` | 保留现有内容，未在本轮更新范围。 |
| Safety/Supplement Files 页头 | `app/DocumentLanding.tsx`、`app/document-landing.css` | 目前只提供页头，未提供正文不得编造。 |
| 队员信息、头像和裁切 | `app/team-profiles.json`、`public/assets/team/` | 头像面部居中且大小一致；不要恢复旧草稿。 |
| 论文图片 | `public/assets/paper-20260928/` | 使用原图，不生成替代图。 |
| 五份 Word 原图与新页头图标 | `public/assets/report-20261004/` | 13 张原图完整提取，含 Table S1；点击图片可打开原图。图标许可原文一并保留。 |
| 其他图片、GIF、视频、下载文件 | `public/assets/` | 使用小写英文文件名，避免空格和中文路径。 |
| 全局样式、团队页、论文页样式 | `app/globals.css`、`app/wiki-article.css` | 修改时同时检查 320、390、768、1440px。 |
| GitHub Pages 自动发布 | `.github/workflows/deploy-pages.yml` | 一般不需要修改。推送到 `main` 后自动运行。 |

## 三、上传和引用各种材料

### 图片和插图

1. 将 PNG、JPG、JPEG、WebP 或 SVG 放入 `public/assets/` 的合适子目录。
2. 在组件中使用 `/assets/子目录/文件名.ext` 引用。
3. 添加准确的 `alt` 描述；纯装饰图使用空 `alt`。
4. 论文图、头像和用户提供的最终图不要压扁或随意裁切。

### GIF

GIF 也放在 `public/assets/`。如果文件很大，优先改成 WebM/MP4 并保留封面图；大 GIF 会明显拖慢手机加载。

### 视频

小视频可放在 `public/assets/video/`，使用原生 `<video controls playsInline>`。建议提供 MP4 和 WebM 两种格式，并添加字幕文件（WebVTT）。较大的视频应先确认 iDEC/GitHub 文件大小限制和版权，再决定是否使用外部可信托管。

### 文本文件和可下载资料

PDF、TXT、CSV 等放在 `public/assets/downloads/`，用普通 `<a href>` 链接。公开仓库中的文件任何人都能下载，不能放隐私数据、原始账号信息或未获授权的材料。

### 文字

- 首页短文：修改 `app/page.tsx` 或 `app/HomeStory.tsx`。
- Description/旧 Method：只在已核对原文后修改 `app/wiki-articles.json`。
- Design/新 Methods/Engineering/Results/Analysis：修改 `app/report-articles.json`，同时更新相应审计记录。
- Model/Experiment：修改 `app/paper-articles.json`，同时更新相应审计记录。
- 队员姓名和介绍：修改 `app/team-profiles.json`。

JSON 文件中的双引号、逗号必须保持合法。大段内容更新建议交给 Codex，并要求它运行全文一致性测试。

### 表格

少量数据使用语义化 HTML 表格；大量数据可从 CSV 生成。必须提供表头、单位、图注和数据来源，并在手机端允许横向滚动。任何实验数值都应来自队伍确认的文件，不要让 AI 猜测或补全。

### 动画效果

CSS 动画放在 `app/home-story.css` 或 `app/globals.css`，交互逻辑放在对应的 `.tsx` 组件。新增动画必须兼容 `prefers-reduced-motion`，并检查 Safari、手机触控和页面滚动性能。

## 四、自己在 GitHub 网页上做小改动

1. 打开 `idec-teams/2026_VCA-Prudens` 仓库并确认右上角账号是 `JianMo-PS`。
2. 进入要修改的文件，点击铅笔图标。
3. 只改明确内容，填写简短提交说明，然后提交到 `main`。
4. 打开仓库的 Actions 页面，等待 `Deploy VCA-Prudens Wiki to GitHub Pages` 变为绿色。
5. 打开 GitHub Pages 地址检查首页、修改页面和至少一个手机宽度。

上传新文件时使用 `Add file → Upload files`，先放到正确的 `public/assets/` 子目录，再修改引用它的源码文件。不要删除 `.github/workflows/deploy-pages.yml`、`package.json`、`pnpm-lock.yaml` 或受保护正文审计文件。

GitHub 网页直接修改只会自动更新 GitHub Pages，不会同步更新 Sites。需要两个网址一致时，让 Codex 在同一次任务中发布两处。

## 五、在本机预览和验证

需要 Node.js 22.13+ 与 pnpm 11。项目使用当前共享 `node_modules`；不要为了修复提示而删除父目录依赖。

```bash
pnpm test
pnpm dev
```

GitHub Pages 静态导出验证：

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_SITE_BASE_PATH=/2026_VCA-Prudens \
pnpm build
```

检查清单：

- 自动化测试全部通过；
- 首页动效、下拉菜单、原生链接可用；
- RNA 阅读进度和四叶草回顶可用；
- Methods/Description 正文无遗漏，显示标题没有编号；
- 图片、GIF、视频、下载文件无 404；
- 320、390、768、1440px 没有横向溢出、遮挡或异常换行；
- Safari 实际点击新增链接；
- 所有头像面部居中且视觉大小一致。

## 六、两套发布的区别

### GitHub Pages（iDEC 官方仓库）

推送到 `main` 后，GitHub Actions 自动测试、静态导出并发布。只有 Actions 显示成功且公开网址可打开，才算 GitHub Pages 上线。

### Sites（现有项目）

Sites 项目保持原项目 ID 和原访问范围。只有通过 Sites 正式流程保存精确源码、部署并得到 `succeeded`，才算该网址上线。本地预览成功不等于线上成功。

两处发布使用同一份源码，但部署系统不同。每次最终更新应记录：源码提交、GitHub Actions 运行结果、GitHub Pages 地址、Sites 版本与部署 ID、测试结果和修改范围。

## 七、回滚与安全

- 每次只提交一组清晰修改；发布前先看 `git diff`。
- 不使用强制推送，不删除 2025 队伍仓库或任何不属于 2026 VCA-Prudens 的内容。
- GitHub 自动保留提交历史；出问题时优先回退单个提交，而不是清空仓库。
- 账号密码、验证码和短期令牌不写入源码、`.env`、文档、Actions 日志或提交记录。
- Wiki freeze 后仓库会变为只读；冻结前应完成最后一次双端发布和下载备份。
