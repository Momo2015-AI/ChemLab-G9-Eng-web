# ChemLab LAB Engine V1

实验引擎基础模块。

## 目标

读取 `content/experiments/*.json` 数据，自动生成实验学习页面。

## 架构

```
Experiment JSON
      |
      v
LAB Engine
      |
      +-- 实验目的
      +-- 仪器列表
      +-- 操作步骤
      +-- 实验现象
      +-- 化学方程式
      +-- 注意事项
```

## V1.0 功能

- 实验数据加载
- 实验信息渲染
- 为后续仪器动画预留接口
