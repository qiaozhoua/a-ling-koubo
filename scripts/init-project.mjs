#!/usr/bin/env node
/**
 * 阿玲口播：初始化工作目录（原创脚手架，不依赖第三方口播模板仓库）
 * Usage: node init-project.mjs <source-video> [output-root]
 */
import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , sourceArg, outputRootArg] = process.argv;
if (!sourceArg) {
  console.error('Usage: node init-project.mjs <source-video> [output-root]');
  process.exit(1);
}

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = path.join(skillDir, 'assets', 'templates', 'composition.skeleton-16x9.html');
const exampleBeats = path.join(skillDir, 'examples', 'beats.example.json');

const source = path.resolve(sourceArg);
const outputRoot = path.resolve(outputRootArg ?? path.join(process.cwd(), 'videos'));

const sourceInfo = await stat(source).catch(() => null);
if (!sourceInfo?.isFile()) {
  console.error(`Source video not found: ${source}`);
  process.exit(1);
}

const baseName =
  path
    .basename(source, path.extname(source))
    .normalize('NFKC')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/[\s._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'a-ling-koubo';

const projectDir = path.join(outputRoot, baseName);
const publicDir = path.join(projectDir, 'public');

if (await stat(projectDir).catch(() => null)) {
  console.error(`Refusing to overwrite existing project: ${projectDir}`);
  process.exit(2);
}

await mkdir(publicDir, { recursive: true });
await mkdir(path.join(publicDir, 'sfx'), { recursive: true });
await cp(source, path.join(publicDir, 'source.mp4'));
await cp(template, path.join(publicDir, 'index.html'));
await cp(exampleBeats, path.join(projectDir, 'beats.json'));

const readme = `# ${baseName} · 阿玲口播

1. 用 ffprobe 写入真实时长到 \`beats.json\` → \`video.duration\`
2. 按口播稿改 \`beats.json\`（见 skill \`references/beat-schema.md\`）
3. 把 beats 装配进 \`public/index.html\`
4. \`npx hyperframes lint public/index.html\`（或项目约定命令）
5. 先预览渲染，确认后再成片
`;
await writeFile(path.join(projectDir, 'README.md'), readme, 'utf8');

// Ensure template file exists (fail loud if skill incomplete)
await readFile(template);

console.log(
  JSON.stringify(
    {
      projectDir,
      publicDir,
      source: path.join(publicDir, 'source.mp4'),
      beats: path.join(projectDir, 'beats.json'),
      index: path.join(publicDir, 'index.html'),
    },
    null,
    2,
  ),
);
