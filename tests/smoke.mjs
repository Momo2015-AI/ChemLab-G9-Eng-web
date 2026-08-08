#!/usr/bin/env node
// ChemLab-G9 下册冒烟测试：在 Node 中用最小 DOM 模拟运行构建产物，验证主要渲染路径。
// 用法：node tests/smoke.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const builtPath = join(root, "dist", "ChemLab-S2.html");

const html = readFileSync(builtPath, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!scripts.length) {
  console.error("构建产物中未找到内联脚本。请先运行 node scripts/build-single.mjs");
  process.exit(1);
}

let failures = 0;
function assert(cond, name) {
  if (cond) {
    console.log("  ✔ " + name);
  } else {
    failures += 1;
    console.log("  ✘ " + name);
  }
}

// 最小 DOM 模拟：任何选择器都返回可用的桩元素，事件绑定为 noop。
function makeEl() {
  return {
    innerHTML: "",
    textContent: "",
    style: {},
    dataset: {},
    hidden: false,
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    append() {},
    appendChild() {},
    addEventListener() {},
    focus() {},
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    closest() { return makeEl(); }
  };
}
const appEl = makeEl();
const localStorageStub = { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };

let searchStr = "";
function setSearch(v) { searchStr = v; }

const context = {
  window: { location: { search: "", href: "" }, addEventListener() {}, localStorage: localStorageStub, document: { readyState: "complete" }, URLSearchParams: class { constructor(s) { this.s = s || ""; } get(n) { const m = new RegExp("[?&]" + n + "=([^&]*)").exec(this.s); return m ? decodeURIComponent(m[1]) : null; } } },
  document: { addEventListener() {}, querySelector() { return appEl; }, querySelectorAll() { return []; }, createElement() { return makeEl(); } },
  localStorage: localStorageStub,
  location: { search: "", href: "" },
  Promise,
  setTimeout,
  clearTimeout,
  console,
  URLSearchParams: class { constructor(s) { this.s = s || ""; } get(n) { const m = new RegExp("[?&]" + n + "=([^&]*)").exec(this.s); return m ? decodeURIComponent(m[1]) : null; } }
};
function runApp() {
  appEl.innerHTML = "";
  // 每次重跑 app 前重置 location.search 快照
  context.window.location.search = searchStr;
  context.location.search = searchStr;
  vm.runInNewContext(scripts[scripts.length - 1], context, { filename: "app.js" });
}

function questionCount(htmlStr) {
  return (htmlStr.match(/<fieldset class="question"/g) || []).length;
}

// 先加载 manifest（已内联在各天内容之前），再单独运行 app.js。
scripts.slice(0, -1).forEach((code, i) => {
  vm.runInNewContext(code, context, { filename: "inline-script-" + i });
});

console.log("\n[首页]");
setSearch("");
runApp();
const home = appEl.innerHTML;
assert(home.includes("36 天自学计划"), "渲染 36 天学习计划标题");
assert((home.match(/<li class="day-card/g) || []).length === 36, "渲染 36 张学习日卡片");
assert(home.includes("已完成 0 / 36 天"), "初始进度为 0/36");
assert(home.includes('class="stats-strip"'), "渲染统计条（连续天数/最高连对/待复习）");
assert(home.includes("成就徽章") && home.includes("badge-wall"), "渲染成就徽章墙");
assert(home.includes("模块进度") && home.includes("mod-block"), "渲染可展开模块进度");
assert(!home.includes("开始错题复习"), "空复习队列时不显示复习入口");

console.log("\n[未发布天占位]");
setSearch("?day=01");
runApp();
let page = appEl.innerHTML;
assert(page.includes("正在准备") || page.includes("待发布"), "未发布天显示占位而非空白");

console.log("\n[错题复习空状态]");
setSearch("?view=review");
runApp();
page = appEl.innerHTML;
assert(page.includes("当前没有待复习的错题"), "空队列显示复习空状态");

// 复习页有数据：写入一条错题记录后重新渲染（渲染是异步的，等待微任务）。
localStorageStub._d["chemlab-g9:v4:s2:review"] = JSON.stringify([
  { day: "01", questionIndex: 2, prompt: "金属活动性顺序中氢之前的金属能与酸反应", answeredAt: new Date().toISOString() }
]);
runApp();
await new Promise((r) => setTimeout(r, 0));
page = appEl.innerHTML;
assert(page.includes("把答错的题再做一遍"), "有错题时渲染复习页");
assert(page.includes("提交复习"), "渲染复习提交按钮");

console.log(failures ? `\n冒烟测试失败：${failures} 项` : "\n冒烟测试全部通过。");
process.exit(failures ? 1 : 0);
