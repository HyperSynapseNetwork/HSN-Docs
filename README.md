# HyperSynapse Network Docs

![Deploy](https://github.com/Phira-plus/HSN-Docs/actions/workflows/deploy.yml/badge.svg)

HyperSynapse Network 技术文档站，基于 [VitePress](https://vitepress.dev) 构建。

---

## 目录结构

```
HSN-Docs/
├── .vitepress/
│   ├── config.mts                      # 站点配置（标题、导航、主题等）
│   └── theme/
│       ├── index.ts                    # 主题入口（Layout slot + GitMeta）
│       └── custom.css                  # 自定义样式（Logo发光、毛玻璃等）
├── .github/workflows/deploy.yml        # CI/CD 自动部署
├── scripts/
│   ├── git-info.mjs                    # [自动] 提取 Git 历史 → 页脚显示
│   └── generate-sidebar.mjs            # [自动] 扫描目录 → 生成侧边栏
├── guide/
│   ├── other-docs/                     # 其他文档（用户协议、群规、团队等）
│   ├── v1/                             # HSNPhira v1
│   ├── v2/
│   │   ├── phira-mp/                   # [自动嵌套] v2 的 Phira-mp 子分组
│   │   └── ...
│   └── v3/
│       ├── frontend/                   # [自动嵌套] v3 的 Frontend 子分组
│       └── ...
├── public/logo.svg                     # Logo 文件
├── index.md                            # 首页
└── package.json
```

---

## 如何添加新文档

### ✅ 推荐方式（全自动）

1. 在 `guide/` 下对应目录新建 `.md` 文件
2. 文件第一行写 `# 标题`（侧边栏会自动显示这个标题）
3. 提交并推送

```bash
# 示例：在 HSNPhira v2 下新增一个文档
echo '# 我的新文档' > guide/v2/my-new-doc.md
git add -A && git commit -m "add: 我的新文档"
git push
```

侧边栏**完全自动生成**，无需编辑任何配置文件。

### ⚠️ 什么时候需要手动改 config.mts

只有这些情况需要编辑 `.vitepress/config.mts`：

| 需求 | 修改位置 |
|------|---------|
| 修改站点标题 / SEO 描述 | `title` / `description` |
| 修改导航栏按钮 | `zhNav` / `enNav` 数组 |
| 修改暗色模式行为 | `appearance` 选项 |
| 修改部署域名 | `sitemap.hostname` |
| 修改页脚版权信息 | `themeConfig.footer` |

> ❌ **不需要**手动改 `sidebar` 配置 —— 侧边栏由 `scripts/generate-sidebar.mjs` 在每次 `npm run build` 时自动生成。

---

## 目录与侧边栏的对应规则

```
guide/v2/frontend.md          → HSNPhira v2 组，直接项 "Frontend"
guide/v2/phira-mp/rust.md     → HSNPhira v2 组，Phira-mp 子分组 → "Rust Phira-mp"
guide/v2/phira-mp/cpp.md      → HSNPhira v2 组，Phira-mp 子分组 → "C++ Phira-mp"
```

- **一级子目录**（`v2/`、`v3/` 等）= 侧边栏分组，显示名在 `generate-sidebar.mjs` 的 `GROUP_RENAMES` 中定义
- **二级子目录**（`phira-mp/`、`frontend/` 等）= 侧边栏嵌套子分组，显示名在 `SUBGROUP_RENAMES` 中定义
- 三级及更深目录暂不支持

如果需要添加新的版本分组或子分组，编辑 `scripts/generate-sidebar.mjs` 中的 `GROUP_RENAMES` / `SUBGROUP_RENAMES` 映射即可。

---

## 本地开发

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → .vitepress/dist/（自动执行 git-info + generate-sidebar）
npm run preview    # → http://localhost:4173
```

`npm run build` 会自动触发 `prebuild` 钩子，依次执行：
1. `scripts/git-info.mjs` — 提取每篇文档的最后修改者和时间
2. `scripts/generate-sidebar.mjs` — 扫描目录生成侧边栏
3. `vitepress build` — 构建静态站点

---

## 上传 / 提交注意事项

### 首次使用

```bash
git init && git branch -m main
git remote add origin <你的仓库地址>
# ... 写文档 ...
git add -A && git commit -m "first commit"
git push -u origin main
```

### 日常流程

```bash
# 1. 写文档
vim guide/v2/my-new-doc.md

# 2. 本地预览
npm run dev

# 3. 构建检查（确保无 dead link 等错误）
npm run build

# 4. 提交推送
git add -A && git commit -m "add: xxx"
git push
```

### 团队协作须知

- **不要手动改 `cache/sidebar.json` 或 `cache/git-info.json`** — 它们是构建产物
- **不要删除 `prebuild` 脚本** — 否则侧边栏和 Git 信息不会更新
- 新增页面只需创建 `.md` 文件，**不要**手动编辑 `config.mts` 中的 `sidebar`
- 如果其他成员拉取后侧边栏没更新，执行一下 `npm run build` 即可
- `.vitepress/cache/` 目录在 `.gitignore` 中，不会提交到仓库

---

## Git 信息页脚

每篇文档底部自动显示最后修改者和修改时间（格式 `YYYY-MM-DD HH:mm`）。

- 信息来自 `git log -1`，需要文件已被 Git 追踪过
- 新文件尚未提交时，GitMeta 区域自动隐藏
- 如需自定义样式，编辑 `.vitepress/theme/components/GitMeta.vue`

---

## 自动化部署

推送 `main` 分支 → GitHub Actions 自动构建并 Rsync 到服务器。

### 所需 Secrets

| Secret | 说明 |
|--------|------|
| `DEPLOY_SSH_KEY` | 部署用的 SSH 私钥 |
| `SERVER_HOST` | 服务器 IP / 域名 |
| `SERVER_USER` | SSH 登录用户名 |

### 可选 Variable

| Variable | 默认值 | 说明 |
|----------|--------|------|
| `DEPLOY_TARGET_PATH` | `/var/www/hypersynapse-docs` | 服务器部署路径 |

### 服务器准备

```bash
sudo useradd -m deploy
sudo -u deploy mkdir -p ~deploy/.ssh && chmod 700 ~deploy/.ssh
echo "<公钥>" | sudo tee -a ~deploy/.ssh/authorized_keys
sudo mkdir -p /var/www/hypersynapse-docs
sudo chown deploy:deploy /var/www/hypersynapse-docs
```

### Nginx 示例

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /var/www/hypersynapse-docs;
    index index.html;
    location / { try_files $uri $uri/ /404.html; }
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

---

## 常见问题

<details>
<summary>添加文件后侧边栏没变化</summary>

执行 `npm run build` 或者按保存后等热更新。如果还是没有，检查文件是否在正确的目录下（`guide/` 内），以及是否以 `# 标题` 开头。
</details>

<details>
<summary>构建报 dead link 错误</summary>

站内链接了不存在的文件或锚点。检查 `.md` 中的 `](path)` 是否都有效。
</details>

<details>
<summary>Git 信息没显示</summary>

文件尚未提交过，或者 Git 仓库不存在。首次 commit 后即可。
</details>

<details>
<summary>我改了 config.mts 但没生效</summary>

VitePress 热更新会自动检测配置变化。如果没反应，重启 `npm run dev`。
</details>

---

## License

MIT
