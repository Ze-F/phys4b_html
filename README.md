# PHYS 4B Review

UCSD PHYS 4B (Spring 2026, Hirsch) 期末复习材料 — 静态 HTML 复习站，按物理主题组织（而非按讲次）。

🔗 **Live site:** https://ze-f.github.io/phys4b_html/

## 内容

涵盖 Lecture 1.1 → 10.1，对应 Shankar *Fundamentals of Physics I* Ch.16–24：

- **振动与波** (Ch.17–19) — SHM, 波的传播, 三维波与声学, 声学微观图像, 干涉与多普勒
- **流体** (Ch.20) — 流体静力学, 流体动力学, 真实流体效应
- **热学** (Ch.21) — 热传导, 比热, 相变
- **气体动理论** (Ch.22) — 分子动理论, 麦克斯韦–玻尔兹曼分布
- **热力学** (Ch.22–23) — 第一定律, 过程与循环, 卡诺循环与第二定律
- **熵** (Ch.24) — 熵的宏观定义, 玻尔兹曼统计公式

含 Quiz 3 / Quiz 4 / Quiz 5 题集与解答。

## 结构

```
├── index.html              # 总目录
├── 01_shm.html – 15_*.html # 15 个主题页
├── quiz3_problems.html     # Quiz 题集
├── quiz3_solutions.html
├── quiz4_problems.html
├── quiz5_problems.html
├── style.css               # 共享样式
├── theme.js                # 主题切换 / 进度持久化
└── interactive.js          # 交互组件
```

## 本地预览

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```
