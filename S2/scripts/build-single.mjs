#!/usr/bin/env node
// ChemLab-G9 下册单文件构建：把 manifest / 所有已发布天的内容与题目 / 样式 / 逻辑
// 全部内联到一个自包含 HTML，可直接通过 AirDrop 等方式传到 iPad，用浏览器离线打开。
// 用法：node scripts/build-single.mjs [输出路径]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = process.argv[2] || join(root, "dist", "ChemLab-S2.html");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

// 读取 manifest，确定已 ready 的天。
const manifestCode = read("content-s2/manifest.js");
const sandbox = { window: {} };
vm.runInNewContext(manifestCode, sandbox, { filename: "content-s2/manifest.js" });
const days = sandbox.window.ChemLabManifestS2.days.filter((d) => d.ready);

// 已发布天的内容与题目。
let inlineScripts = "<script>" + manifestCode + "</script>\n";
days.forEach((d) => {
  const dayPath = `content-s2/days/day-${d.day}.js`;
  const quizPath = `quiz-s2/day-${d.day}.js`;
  if (!existsSync(join(root, dayPath)) || !existsSync(join(root, quizPath))) {
    console.error(`警告：Day ${d.day} 标记为 ready 但缺少文件，已跳过。`);
    return;
  }
  inlineScripts += `<script>${read(dayPath)}</script>\n`;
  inlineScripts += `<script>${read(quizPath)}</script>\n`;
});

// 数据层：知识图谱 / 实验 / 错误分类（须在 app 逻辑之前内联，供学习引擎引用）。
inlineScripts += "<script>" + read("content-s2/knowledge/knowledge.js") + "</script>\n";
inlineScripts += "<script>" + read("content-s2/experiments/experiments.js") + "</script>\n";
inlineScripts += "<script>" + read("content-s2/mistakes/mistakes.js") + "</script>\n";

// 应用逻辑（必须在内容之后加载）。
inlineScripts += "<script>" + read("src/js/app.js") + "</script>\n";
const css = read("src/css/app.css");
let html = read("index.html");

html = html.replace(/<link rel="stylesheet"[^>]*app\.css[^>]*\/?>/i, "<style>\n" + css + "\n</style>");
html = html.replace(/<script src="content-s2\/manifest\.js"><\/script>/, "");
html = html.replace(/<script src="src\/js\/app\.js"><\/script>/, "");
html = html.replace("</body>", inlineScripts + "  </body>");

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html);

const kb = Math.round(Buffer.byteLength(html, "utf8") / 1024);
console.log(`构建完成：${outPath}（${kb} KB，${days.length} 天内容已内联）`);
