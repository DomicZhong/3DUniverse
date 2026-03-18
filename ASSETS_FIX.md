# 🔧 资源路径修复说明

## 问题描述

在部署到 GitHub Pages 后，音频文件和纹理无法加载。这是因为在生产环境中，应用部署在子路径 `/3DUniverse/` 下，但代码中使用了绝对路径（以 `/` 开头），导致资源路径错误。

## 解决方案

### 1. 创建资源路径配置文件

创建了 `src/config/assets.js` 文件，自动处理不同环境下的资源路径：

```javascript
// 开发环境：返回空字符串
// 生产环境：返回 import.meta.env.BASE_URL（由 vite.config.js 的 base 配置决定）
export const getBasePath = () => {
  if (import.meta.env.DEV) {
    return '';
  }
  return import.meta.env.BASE_URL;
};
```

### 2. 更新的文件

以下文件已更新以使用正确的资源路径：

- ✅ `src/components/Scene/AudioManager.jsx`
  - 背景音乐路径：`getMusicPath('background.mp3')`
  - 音效路径：`getSoundPath('jump.mp3')` 等

- ✅ `src/components/Scene/Moon.jsx`
  - 月球纹理路径：使用 `getBasePath()` 拼接

- ✅ `src/utils/textureLoader.js`
  - 所有行星纹理路径：使用 `getBasePath()` 拼接

### 3. Vite 配置

`vite.config.js` 中的配置：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/3DUniverse/', // 与 GitHub 仓库名称匹配
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

## 验证修复

### 本地验证

1. 安装依赖：
```bash
npm install
```

2. 构建生产版本：
```bash
npm run build
```

3. 预览构建结果：
```bash
npm run preview
```

4. 访问 `http://localhost:4173` 检查资源是否正常加载

### 部署验证

推送到 GitHub 后，检查：

1. **浏览器控制台** - 查看是否有 404 错误
2. **网络标签** - 检查资源是否成功加载（状态码 200）
3. **音频播放** - 点击页面后背景音乐是否播放
4. **纹理显示** - 行星和月球纹理是否正常显示

## 常见问题

### 1. 如果仓库名不是 `3DUniverse`

修改 `vite.config.js` 中的 `base` 配置：

```javascript
base: '/YOUR_REPO_NAME/',
```

### 2. 资源仍然无法加载

检查以下几点：

- 确保 `public/` 目录下有 `textures/`、`music/`、`sounds/` 文件夹
- 检查浏览器控制台的具体错误信息
- 确认资源文件名称与代码中的引用一致
- 查看网络标签，确认请求的 URL 是否正确

### 3. 开发环境正常，部署后有问题

这通常意味着 `base` 配置不正确。请确保：

- `vite.config.js` 中的 `base` 与 GitHub 仓库名称匹配
- 仓库名称使用小写（GitHub Pages 对大小写敏感）

## 技术细节

### 开发环境
- URL: `http://localhost:5173`
- 资源路径: `/music/background.mp3`
- `getBasePath()` 返回: `''`

### 生产环境（GitHub Pages）
- URL: `https://username.github.io/3DUniverse/`
- 资源路径: `/3DUniverse/music/background.mp3`
- `getBasePath()` 返回: `/3DUniverse/`

这种自动切换确保了在不同环境下都能正确加载资源。
