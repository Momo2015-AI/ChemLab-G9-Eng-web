# ChemLab-G9 下册

面向九年级化学（人教版下册）的 36 天自学 iPad 单页学习系统。

## 说明

本仓库是上册（https://github.com/momo2015-ai/ChemLab-G9 ）的下册独立开发仓库。开发完成后将以"单提交合并"方式并入上册仓库，旧开发历史保留在 `s2-legacy` 分支。

## iPad 离线使用

将 `dist/ChemLab-S2.html` 发送到 iPad，通过 Safari 打开即可离线学习。

- 无需安装、无需服务器、无需登录
- 支持本地学习记录持久化（数据键 `chemlab-g9:v4:s2:`，与上册 `v3:` 隔离，合并后零数据迁移）

## 功能一览

- 36 天完整课程（Day01-Day36），覆盖人教版九年级化学下册全部章节
- 每日练习题（含情境自测），跨天错题复习（按知识点筛选 + 间隔到期）
- 学习进度统计、单课笔记、36 天关键词搜索
- 学习数据一键导出 / 导入备份
- 成就激励系统
- 触摸友好交互：科学探究排序（拖拽 / 按钮 / 键盘）、方程式拼写与配平
- 科学正确性脚本巡检 + 发布门禁
- iPad 适配 + 单文件离线构建

## 课程规划

| 模块 | 天数 | 主题 |
|------|------|------|
| 一 | Day01-06 | 金属和金属材料 |
| 二 | Day07-13 | 溶液 |
| 三 | Day14-20 | 酸和碱 |
| 四 | Day21-27 | 盐、化肥 |
| 五 | Day28-30 | 化学与生活 |
| 六 | Day31-36 | 综合提升 |

## 项目结构

```
src/js/app.js       # 主程序（界面、交互、SVG 配图、搜索、备份、激励）
src/css/app.css     # 样式
content-s2/         # 下册内容（manifest.js + days/day-XX.js）
quiz-s2/            # 下册题目（day-XX.js）
dist/               # 离线单文件版本（ChemLab-S2.html）
scripts/            # 构建、内容校验与科学正确性巡检工具
tests/              # 冒烟测试
```

## 发布门禁

```
node scripts/validate-content.mjs && node scripts/check-science.mjs --fatal && node scripts/build-single.mjs && node tests/smoke.mjs
```

## License

MIT License

Copyright (c) 2026 Momo2015-AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
