# YUKIMOTO AI Headquarters - Sales Entry

简易销售录入系统，支持货号自动查询 + 严格 70/30 佣金计算。

## 快速开始

1. 解压后进入目录
2. `npm install`
3. 复制 `.env.local.example` 为 `.env.local`，填入你的 Supabase 和 SQL 密钥
4. 在 Supabase 执行 `schema.sql` 建表
5. `npm run dev`

## 主要功能

- 销售录入（贴近原 Google Sheets 习惯）
- 货号输入后自动带出商品名（需接 SQL Accounting）
- 主责成员 70% + Group Pool 30%
- 共同成交成员记录
- 实时佣金预览