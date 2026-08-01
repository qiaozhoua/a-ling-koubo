---
name: a-ling-koubo
description: >-
  阿玲口播：用 HyperFrames 为真人横版口播做叠层包装（顶栏标题、章节进度、信息卡、
  双语字幕与关键词高亮、可选 SFX）。先预览再成片。触发：「阿玲口播」「阿玲剪辑」
  「按阿玲风格包装」、$a-ling-koubo，或用户提供口播 MP4 + 稿件并要求信息叠层包装。
  不做口误剪切（→ ai-jian-koubo / videocut）；不做知识窗切走全脸（→ talking-head-video）；
  仅字幕（→ embedded-captions）；自由叠卡无阿玲约定（→ talking-head-recut）。
---

# 阿玲口播（a-ling-koubo）

把**真人横版口播**做成带信息层级的成片：底片人物不动，上面叠顶栏、章节、信息卡与字幕。  
渲染走 **HyperFrames**。本 Skill 为原创实现（见 `NOTICE.md`）。  
许可：**PolyForm Noncommercial 1.0.0** — 个人学习/演讲可用，**商用需作者书面授权**（见 `LICENSE`）。

必读：

1. `references/beat-schema.md` — `beats.json` 字段  
2. `references/edit-standard.md` — 剪辑标准  
3. `/hyperframes` + `/hyperframes-core` — 装配与渲染契约  

## 依赖

- Node.js 20+、`ffmpeg` / `ffprobe`
- `npx hyperframes doctor` 通过
- 口播稿，或本机 Whisper（`hyperframes transcribe`）；**不要求**第三方 ASR Key
- 未经用户明确授权，不上传私密素材到外部服务

路径一律相对于本 `SKILL.md` 所在目录（`<skill-dir>`）。

## 工作流

### 1. 探源

```bash
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,r_frame_rate -of json <source-video>
```

### 2. 初始化项目

```bash
node <skill-dir>/scripts/init-project.mjs <source-video> [output-root]
```

默认 `output-root` 为当前仓库下的 `videos/`。脚本会创建：

- `beats.json`（从 example 复制，需改）
- `public/source.mp4`
- `public/index.html`（骨架）
- `public/sfx/`

已存在目录则拒绝覆盖。

### 3. 填写 beats

按口播语义编辑 `beats.json`，顺序：

1. `video`：标题、eyebrow、副标题、`duration`、`applyGrade`  
2. `subs`：1–3 秒一条；中文关键词用 `**双星号**`  
3. `chapters`：3–6 段  
4. `cards`：仅在有助理解处加；kind ∈ metric / list / steps / compare / quote  
5. `sfx`：仅用户提供合法音效时填写  

```bash
node <skill-dir>/scripts/validate-beats.mjs <work-dir>/beats.json
```

### 4. 装配 HTML

以 `assets/templates/composition.skeleton-16x9.html` 为结构参考，把 `beats.json` 写进工作目录 `public/index.html`：

- 根节点 `data-composition-id="a-ling-koubo"`，`data-width="1920"` `data-height="1080"`，`data-duration` = `video.duration`
- `<video id="bg" src="source.mp4">` 与人声轨对齐全片时长；`applyGrade` 时给 video 加 class `grade`
- **字幕**：每条一个 `.subs.clip`；把 `**x**` 转成 `<mark>x</mark>`
- **章节**：按 chapter 时间切换顶栏 `chapter-no` / `label` / `en` 与 `.progress i.on`
- **卡片**：每张一个 `.clip` + `.card`；`data-accent` 映射 accent；按 kind 填 value / ul / compare 网格
- **clips 必须是 composition 根的直接子元素**（HyperFrames 规则）
- 注册 `window.__timelines["a-ling-koubo"]`（GSAP paused timeline）

视觉令牌（勿改成青蓝玻璃风）：珊瑚 `#FF6B4A`、墨色面板、左侧色条卡。详见骨架内 CSS。

### 5. 校验与预览

在工作目录：

```bash
npx hyperframes lint public/index.html
# 预览渲染（命令以当前 hyperframes CLI 为准，例如）
npx hyperframes render public/index.html -o preview.mp4
```

将 `preview.mp4` 交给用户确认。

### 6. 成片

用户确认后导出成片（同尺寸或项目约定的更高质量参数），例如：

```bash
npx hyperframes render public/index.html -o final.mp4
```

### 7. 验收

`ffprobe` 确认分辨率、时长、音轨；核对字幕对齐、卡片未长期挡脸、无未授权素材。  
回报输出路径与变更文件；未验证成功不得宣称完成。

## 与兄弟技能

| 需求 | 技能 |
|------|------|
| 阿玲约定的口播叠层包装 | **本 skill** |
| 知识窗 + 圆形 PiP | `talking-head-video` |
| 自由设计叠卡 | `talking-head-recut` |
| 仅字幕 | `embedded-captions` |
| 剪口误 / FCPXML | `ai-jian-koubo` 等 |

## 触发示例

```text
用阿玲口播包装 ./source.mp4，稿在 ./script.txt，已调色不要加滤镜，先出预览。
```
