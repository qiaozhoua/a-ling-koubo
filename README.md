# 阿玲口播（a-ling-koubo）

用 **HyperFrames** 为**真人横版口播**做信息叠层包装：顶栏标题、章节进度、信息卡、双语字幕与关键词高亮。先预览，再成片。

> **许可：非商用。** 源码公开，仅供个人学习、研究、演讲演示等非商业用途；**商用必须获得作者书面授权。** 详见 [`LICENSE`](./LICENSE) / [`NOTICE.md`](./NOTICE.md)。

## 快速安装（Cursor / Agent Skills）

把本仓库内容放到 Agent Skills 目录，例如：

```text
<your-project>/.cursor/skills/a-ling-koubo/
```

或个人技能目录：

```text
~/.cursor/skills/a-ling-koubo/
```

保证目录内含 `SKILL.md`。在对话中说「阿玲口播」「阿玲剪辑」或 `$a-ling-koubo` 即可触发。

## 依赖

- Node.js 20+
- `ffmpeg` / `ffprobe`
- `npx hyperframes doctor` 通过

## 最小流程

```bash
# 1) 初始化工作目录
node scripts/init-project.mjs ./source.mp4 ./videos

# 2) 编辑 beats.json 后校验
node scripts/validate-beats.mjs ./videos/<project>/beats.json

# 3) 按 SKILL.md 装配 public/index.html，再 lint / 预览 / 成片
npx hyperframes lint public
npx hyperframes render public -o preview.mp4
```

完整约定见：

- [`SKILL.md`](./SKILL.md)
- [`references/beat-schema.md`](./references/beat-schema.md)
- [`references/edit-standard.md`](./references/edit-standard.md)

## 许可与商用

本项目采用 **[PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0)**。

- 可以：个人学习、研究、业余项目、教学/演讲演示（非收费商用）
- 不可以：任何商业用途（收费内容生产、付费课、商业咨询、公司流水线、二次售卖等）
- 需要商用：请开 [Issue](https://github.com/qiaozhoua/a-ling-koubo/issues) 联系作者授权

```
Required Notice: Copyright 2026 qiaozhoua (https://github.com/qiaozhoua)
```

## 作者

- GitHub：[@qiaozhoua](https://github.com/qiaozhoua)
