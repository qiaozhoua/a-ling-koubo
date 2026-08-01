# beats.json 约定

工作目录根下的 `beats.json` 是阿玲口播的唯一内容源。Agent 填完后再装配 `public/index.html`。

```json
{
  "video": {
    "eyebrow": "阿玲口播",
    "title": "主标题",
    "subtitle": "副标题 · 一句话",
    "applyGrade": false,
    "duration": 12.6
  },
  "subs": [
    { "start": 0.0, "end": 2.4, "cn": "先把**结论**讲清楚", "en": "Lead with the point" }
  ],
  "chapters": [
    { "start": 0.0, "end": 4.8, "no": "01", "label": "先讲结论", "en": "POINT" }
  ],
  "cards": [
    {
      "start": 0.4,
      "end": 3.2,
      "kind": "quote",
      "label": "先把结论讲清楚",
      "en": "LEAD",
      "note": "前三秒说明值不值得看",
      "accent": "coral"
    }
  ],
  "sfx": []
}
```

## 字段

| 路径 | 说明 |
|------|------|
| `video.duration` | 秒；须覆盖最后一条字幕/卡片 |
| `video.applyGrade` | `true` 时对画面加轻微对比/亮度（源片已调色则 `false`） |
| `subs[].cn` | 中文；用 `**词**` 标记关键词高亮 |
| `subs[].en` | 英文；用户要求仅中文时可 `""` |
| `chapters` | 3–6 段；`no` 两位数字字符串 |
| `cards[].kind` | `metric` \| `list` \| `steps` \| `compare` \| `quote` |
| `cards[].accent` | `coral` \| `ink` \| `sand` \| `teal`（默认 `coral`） |
| `cards` 内容 | `metric` 用 `value`/`suffix`/`note`；`list`/`steps` 用 `items[]`；`compare` 用 `left`/`right` `{label,value}`；`quote` 用 `note` |
| `sfx[]` | `{ "at": 1.2, "file": "whoosh.mp3", "volume": 0.35 }`；文件放 `public/sfx/` |

## 校验

```bash
node <skill-dir>/scripts/validate-beats.mjs <work-dir>/beats.json
```
