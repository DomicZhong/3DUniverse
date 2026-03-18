#!/usr/bin/env node

/**
 * 资源检查脚本
 * 检查 public 目录下的资源文件是否存在
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_FILES = {
  textures: [
    'sun.jpg',
    'mercury.jpg',
    'venus.jpg',
    'earth.jpg',
    'mars.jpg',
    'jupiter.jpg',
    'saturn.jpg',
    'uranus.jpg',
    'neptune.jpg',
    'moon.jpg'
  ],
  music: [
    'background.mp3'
  ],
  sounds: [
    'jump.mp3',
    'click.mp3',
    'hover.mp3'
  ]
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function checkFiles(type, files) {
  console.log(`\n${COLORS.cyan}检查 ${type} 目录...${COLORS.reset}`);

  const dirPath = path.join(__dirname, '../public', type);
  let allExist = true;

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const exists = fs.existsSync(filePath);

    if (exists) {
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`  ${COLORS.green}✓${COLORS.reset} ${file} (${size} KB)`);
    } else {
      console.log(`  ${COLORS.red}✗${COLORS.reset} ${file} ${COLORS.red}(缺失)${COLORS.reset}`);
      allExist = false;
    }
  });

  return allExist;
}

console.log(`${COLORS.cyan}========================================${COLORS.reset}`);
console.log(`${COLORS.cyan}   3DUniverse 资源文件检查工具${COLORS.reset}`);
console.log(`${COLORS.cyan}========================================${COLORS.reset}`);

const textureOk = checkFiles('textures', REQUIRED_FILES.textures);
const musicOk = checkFiles('music', REQUIRED_FILES.music);
const soundsOk = checkFiles('sounds', REQUIRED_FILES.sounds);

console.log(`\n${COLORS.cyan}========================================${COLORS.reset}`);
console.log(`${COLORS.cyan}   检查总结${COLORS.reset}`);
console.log(`${COLORS.cyan}========================================${COLORS.reset}`);

if (textureOk && musicOk && soundsOk) {
  console.log(`\n${COLORS.green}✓ 所有必需的文件都存在！${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${COLORS.red}✗ 部分文件缺失！${COLORS.reset}\n`);

  if (!textureOk) {
    console.log(`${COLORS.yellow}纹理缺失：运行以下命令下载${COLORS.reset}`);
    console.log(`  npm run download:textures\n`);
  }

  if (!musicOk || !soundsOk) {
    console.log(`${COLORS.yellow}音频缺失：运行以下命令下载${COLORS.reset}`);
    console.log(`  npm run download:audio\n`);
  }

  process.exit(1);
}
