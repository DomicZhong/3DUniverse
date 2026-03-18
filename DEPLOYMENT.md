# 🚀 部署指南

本指南将帮助你将 3DUniverse 项目部署到 GitHub Pages，让大众可以通过互联网访问。

## 📋 部署选项

### 方案一：GitHub Pages（推荐 - 免费）

GitHub Pages 是 GitHub 提供的免费静态网站托管服务，非常适合部署这类项目。

#### 步骤 1：推送到 GitHub

1. 在 GitHub 上创建新仓库，仓库名建议使用 `3DUniverse`
2. 将本地代码推送到 GitHub：

```bash
# 如果还没有初始化 git 仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/3DUniverse.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

#### 步骤 2：配置 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Build and deployment** 部分：
   - **Source**: 选择 `GitHub Actions`
5. 点击 Save

#### 步骤 3：验证配置

1. 进入仓库的 **Actions** 标签
2. 查看 "Deploy to GitHub Pages" workflow 的运行状态
3. 如果成功，你的网站将自动部署

#### 步骤 4：访问你的网站

部署成功后，你的网站地址为：

```
https://YOUR_USERNAME.github.io/3DUniverse/
```

#### 自动部署设置

配置完成后，每次你推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages

你也可以在 Actions 页面手动触发部署。

---

### 方案二：Vercel（推荐 - 极速部署）

Vercel 提供更快的部署速度和更好的性能，同样有免费额度。

#### 步骤 1：连接 GitHub

1. 访问 [vercel.com](https://vercel.com) 并注册
2. 点击 "New Project"
3. 导入你的 GitHub 仓库

#### 步骤 2：配置项目

Vercel 会自动检测到这是一个 Vite 项目，配置如下：

- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 步骤 3：部署

点击 "Deploy" 按钮，等待几分钟即可完成部署。

#### 访问你的网站

Vercel 会自动分配一个域名，格式为：

```
https://your-project-name.vercel.app
```

你也可以在设置中绑定自定义域名。

---

### 方案三：Netlify（推荐 - 易于使用）

Netlify 提供简洁的界面和丰富的功能。

#### 步骤 1：连接 GitHub

1. 访问 [netlify.com](https://www.netlify.com) 并注册
2. 点击 "Add new site" → "Import an existing project"

#### 步骤 2：配置构建设置

- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### 步骤 3：部署

点击 "Deploy site" 按钮即可。

---

## 🔧 本地预览部署版本

在推送之前，你可以先在本地预览构建后的版本：

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

访问 `http://localhost:4173` 查看效果。

---

## 📝 重要提示

### GitHub Pages 注意事项

1. **仓库名称**：如果你的仓库名不是 `3DUniverse`，需要修改 `vite.config.js` 中的 `base` 配置：

```javascript
base: '/YOUR_REPO_NAME/', // 替换为你的仓库名
```

2. **音频文件**：GitHub Pages 有文件大小限制（单个文件不超过 25MB），音频文件通常没问题。

3. **构建时间**：首次部署可能需要 2-5 分钟，后续部署会更快。

### 自定义域名

如果你有自己的域名，可以在所有平台上绑定：

- **GitHub Pages**: 在仓库 Settings → Pages 中配置
- **Vercel**: 在项目设置 → Domains 中添加
- **Netlify**: 在 Site settings → Domain management 中配置

---

## 🐛 常见问题

### 1. 部署后页面空白

**原因**：资源路径配置错误

**解决**：检查 `vite.config.js` 中的 `base` 配置是否正确

### 2. 音频文件无法加载

**原因**：文件路径问题或跨域限制

**解决**：确保音频文件在 `public/` 目录下，路径以 `/` 开头

### 3. GitHub Actions 构建失败

**解决**：查看 Actions 页面的错误日志，常见原因：
- Node.js 版本不兼容
- 依赖安装失败
- 构建超时

### 4. 部署后样式错乱

**原因**：Tailwind CSS 未正确构建

**解决**：检查 `tailwind.config.js` 和 `postcss.config.js` 配置

---

## 📊 性能优化建议

部署后可以考虑以下优化：

1. **启用 CDN**：使用 CDN 加速静态资源
2. **压缩资源**：启用 gzip 或 brotli 压缩
3. **图片优化**：使用 WebP 格式
4. **代码分割**：Vite 默认支持，无需额外配置
5. **缓存策略**：设置适当的缓存头

---

## 🎉 部署成功标志

当你看到以下内容时，说明部署成功：

✅ 访问网站地址可以正常打开
✅ 3D 场景正常渲染
✅ 行星可以点击和交互
✅ 音频可以播放
✅ 响应式布局正常工作

---

## 📞 获取帮助

如果在部署过程中遇到问题：

1. 查看平台的官方文档
2. 检查构建日志获取详细错误信息
3. 在 GitHub Issues 中搜索类似问题
4. 提问时附上完整的错误日志和配置信息

---

**祝部署顺利！** 🚀✨
