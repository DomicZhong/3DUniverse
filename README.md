# 🌌 探索太阳系 - 3D宇宙可视化项目

一个面向9-12岁儿童的交互式太阳系3D可视化学习应用，使用React Three Fiber技术构建。

## ✨ 功能特性

- 🪐 **八大行星轨道模拟** - 真实模拟行星公转和自转运动
- 🌌 **NASA真实纹理** - 使用NASA官方天文图片，自动加载，加载失败时自动切换到程序化纹理
- 🎨 **程序化纹理备选** - 使用Canvas API生成逼真的行星纹理作为备用方案
- 🔍 **行星详情介绍** - 点击行星查看详细信息、数据和趣味知识
- ⏱️ **时间控制** - 调整时间流逝速度，观察行星运动变化
- 🎯 **两种显示模式** - 写实模式和教育模式（适合学习）
- 🎮 **知识问答系统** - 8道趣味问答题，检验学习成果
- 🌟 **沉浸式3D体验** - 360度自由视角，拖拽旋转，滚轮缩放
- 🎵 **音频系统** - 背景音乐和交互音效，提升沉浸体验
- 🌙 **月球系统** - 包含地球卫星月球，支持独立轨道和高亮显示
- 🎨 **轨道自定义** - 支持调节轨道颜色和粗细，优化视觉体验
- ☀️ **太阳交互** - 点击太阳查看太阳系中心天体的详细信息
- 🚀 **相机跳跃** - 快速跳转到任意星球，实时追踪公转位置

## 🛠️ 技术栈

- **前端框架**: React 18
- **3D引擎**: React Three Fiber (R3F)
- **3D库**: Three.js
- **动画增强**: @react-three/drei
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **构建工具**: Vite

## 📦 安装和运行

### 安装依赖

```bash
npm install
```

### 下载纹理（可选）

如果希望使用本地纹理图片而不是网络加载：

```bash
npm run download:textures
```

这将下载所有NASA行星纹理到 `public/textures/` 目录。下载完成后，项目会自动优先使用本地纹理。

### 下载音频（可选）

如果希望使用本地音频文件而不是网络加载：

```bash
npm run download:audio
```

这将下载背景音乐和音效文件到 `public/music/` 和 `public/sounds/` 目录。

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🎮 操作指南

### 基本操作
- **🖱️ 拖拽** - 旋转3D视角
- **🔭 滚轮** - 缩放场景
- **👆 点击** - 选择行星查看详情

### 控制面板
- **播放/暂停** - 暂停或继续行星运动
- **时间速度** - 选择0.1x到10x的不同速度
- **显示模式** - 切换写实模式/教育模式
- **知识问答** - 打开知识问答系统
- **轨道颜色** - 选择轨道颜色（白色、灰色、金色、青色）
- **轨道粗细** - 调整轨道显示粗细（0-10）
- **Jump to** - 快速跳转到选定星球

### 音频控制
- **音量滑块** - 调节背景音乐音量（0-100%）
- **静音按钮** - 一键静音/取消静音
- **交互音效** - 点击、悬停、跳跃时的音效反馈

## 📁 项目结构

```
3DUniverse/
├── public/
│   ├── textures/          # 本地纹理贴图（可选）
│   ├── music/             # 背景音乐文件
│   └── sounds/            # 音效文件
├── src/
│   ├── components/
│   │   ├── Scene/         # 3D场景组件
│   │   │   ├── SolarSystem.jsx
│   │   │   ├── Sun.jsx
│   │   │   ├── Planet.jsx
│   │   │   ├── Moon.jsx
│   │   │   └── AudioManager.jsx
│   │   └── UI/            # UI组件
│   │       ├── ControlPanel.jsx
│   │       ├── PlanetInfo.jsx
│   │       ├── Quiz.jsx
│   │       ├── Welcome.jsx
│   │       └── AudioControls.jsx
│   ├── data/              # 数据文件
│   │   ├── planets.js     # 行星数据
│   │   └── quiz.js        # 问答数据
│   ├── store/             # 状态管理
│   │   └── useStore.js
│   ├── utils/             # 工具函数
│   │   ├── textureLoader.js    # NASA纹理加载器
│   │   └── textureGenerator.js # 程序化纹理生成器
│   ├── App.jsx            # 主应用组件
│   ├── index.css          # 全局样式
│   └── main.jsx           # 入口文件
├── download-textures.js   # 纹理下载脚本
├── download-audio.js       # 音频下载脚本
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🖼️ 纹理系统说明

### NASA真实纹理

项目使用NASA官方天文图片作为纹理贴图，来自以下开放数据源：

- **NASA官网** - 太阳、行星等高质量天文图片
- **Wikipedia Commons** - 经过整理的NASA图片
- **Solar System Scope** - 专业天文图片资源

纹理特点：
- ✅ 真实还原行星表面细节
- ✅ 高分辨率（1024x1024）
- ✅ 自动加载和缓存
- ❌ 加载失败时自动切换到程序化纹理

### 纹理加载流程

1. **自动模式（默认）**：
   - 优先尝试加载本地纹理（`public/textures/`）
   - 本地不存在时，加载网络纹理
   - 网络失败时，使用程序化纹理

2. **本地模式**：
   - 仅使用本地纹理
   - 适合离线环境

3. **网络模式**：
   - 仅使用网络纹理
   - 适合在线环境，无需下载

### 设置纹理模式

在代码中设置纹理加载模式：

```javascript
import { setTextureMode } from './utils/textureLoader';

// 使用本地纹理
setTextureMode('local');

// 使用网络纹理
setTextureMode('remote');

// 自动模式（默认）
setTextureMode('auto');
```

### 自定义纹理

如果想使用自己的纹理图片：

1. 将纹理图片放入 `public/textures/` 目录
2. 命名规则：`{planetId}.jpg`（如 `earth.jpg`）
3. 修改 `src/utils/textureLoader.js` 中的URL配置

## 📚 行星数据说明

项目包含八大行星的详细数据：
- 水星 (Mercury) - 离太阳最近的行星
- 金星 (Venus) - 最热的行星
- 地球 (Earth) - 我们的家园（带月球）
- 火星 (Mars) - 红色星球
- 木星 (Jupiter) - 最大的行星
- 土星 (Saturn) - 拥有壮观的环
- 天王星 (Uranus) - 躺着公转的行星
- 海王星 (Neptune) - 最远的行星

每个行星包含：
- 直径、距离太阳的距离
- 公转周期、自转周期
- 详细描述和趣味知识

太阳系也包含：
- 太阳 (Sun) - 太阳系中心，提供能量和光明
- 月球 (Moon) - 地球的唯一天然卫星

## 🎯 适用人群

- 9-12岁儿童
- 天文爱好者
- 学校科普教育
- 家长与孩子共同学习

## 📝 待改进功能

- [x] 添加NASA真实天文照片纹理（已实现，自动加载）
- [x] 添加音效和背景音乐
- [x] 添加行星卫星系统（已实现月球）
- [x] 太阳交互和详情展示（已实现）
- [ ] 实现宇宙漫游模式
- [ ] 添加更多行星（矮行星、冥王星等）
- [ ] 支持VR/AR体验
- [ ] 添加更多卫星系统（木卫、土卫等）
- [ ] 多语言支持
- [ ] 添加行星表面漫游功能
- [ ] 实现更真实的物理模拟
- [ ] 添加太阳系历史演变动画

## 🔧 技术细节

### 纹理加载API

```javascript
import { loadPlanetTexture, preloadAllTextures } from './utils/textureLoader';

// 加载单个行星纹理
const texture = await loadPlanetTexture('earth');

// 预加载所有纹理
await preloadAllTextures();

// 检查纹理是否已加载
const isLoaded = isTextureLoaded('earth');

// 获取纹理加载状态
const status = getTextureLoadingStatus();
// { total: 9, loaded: 5, progress: 55 }
```

### 性能优化

- 纹理缓存机制，避免重复加载
- 按需加载，仅显示的行星才加载纹理
- 自动降级策略，网络问题时使用程序化纹理
- 纹理压缩和mipmap优化

## 📄 许可证

MIT License

## 🙏 致谢

- Three.js - 强大的3D WebGL库
- React Three Fiber - React Three.js集成
- NASA - 天文图片资源
