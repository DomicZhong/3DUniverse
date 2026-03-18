import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建目录
const musicDir = path.join(__dirname, 'public', 'music');
const soundsDir = path.join(__dirname, 'public', 'sounds');

if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
  console.log(`✅ 创建目录: ${musicDir}`);
}

if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`✅ 创建目录: ${soundsDir}`);
}

// 音频文件配置（使用可靠的免费CDN资源）
const audioFiles = [
  // 背景音乐 - 来自Pixabay的免费商用音乐
  {
    name: 'background.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    description: 'Space ambient music - suitable for space theme'
  },
  // 点击音效
  {
    name: 'click.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a734d6.mp3',
    description: 'Soft click sound effect'
  },
  // 跳转音效
  {
    name: 'jump.mp3',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    description: 'Whoosh transition sound effect'
  },
  // 悬停音效
  {
    name: 'hover.mp3',
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3',
    description: 'Subtle hover sound'
  }
];

// 下载文件函数
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 下载: ${path.basename(filepath)}...`);

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ 完成: ${path.basename(filepath)}`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ 完成: ${path.basename(filepath)}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`❌ 失败: ${path.basename(filepath)}`, err.message);
      reject(err);
    });
  });
}

// 主函数
async function downloadAllAudio() {
  console.log('🚀 开始下载音频文件...\n');

  const downloadPromises = audioFiles.map((audio) => {
    let filepath;
    if (audio.name === 'background.mp3') {
      filepath = path.join(musicDir, audio.name);
    } else {
      filepath = path.join(soundsDir, audio.name);
    }

    console.log(`📄 ${audio.name}: ${audio.description}\n`);

    return downloadFile(audio.url, filepath).catch(err => {
      console.error(`⚠️ 跳过 ${audio.name}:`, err.message);
    });
  });

  try {
    await Promise.all(downloadPromises);
    console.log('\n✅ 所有音频下载完成！');
    console.log(`📁 音乐目录: ${musicDir}`);
    console.log(`📁 音效目录: ${soundsDir}`);
    console.log('\n💡 提示: 这些音频来自Pixabay，可免费商用');
  } catch (error) {
    console.error('\n❌ 下载过程出错:', error);
  }
}

// 运行下载
downloadAllAudio();
