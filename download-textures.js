import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建public/textures目录
const texturesDir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
  console.log(`✅ 创建目录: ${texturesDir}`);
}

// NASA纹理URL配置（使用Three.js官方示例和GitHub镜像）
const textures = {
  sun: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg',
  mercury: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mercury_in_color_-_Prockter07_centered.jpg',
  venus: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Solar_System_Portal_Venus_Surface.jpg',
  earth: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  moon: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
  mars: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
  jupiter: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
  saturn: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Saturn_%28planet%29_large.jpg',
  uranus: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
  neptune: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg'
};

// 下载文件函数
/**
 * 从指定 URL 下载文件到本地路径
 * @param {string} url - 文件的下载地址
 * @param {string} filepath - 文件保存的本地路径
 * @returns {Promise<void>} 下载完成时 resolve，失败时 reject
 * @throws {Error} 当下载过程中发生错误时抛出异常
 * 
 * 该函数支持处理 HTTP 301/302 重定向，下载失败时会自动清理已创建的文件
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 下载: ${path.basename(filepath)}...`);

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // 处理重定向
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
async function downloadAllTextures() {
  console.log('🚀 开始下载NASA行星纹理...\n');

  const downloadPromises = Object.entries(textures).map(([planet, url]) => {
    const filename = `${planet}.jpg`;
    const filepath = path.join(texturesDir, filename);
    return downloadFile(url, filepath).catch(err => {
      console.error(`⚠️ 跳过 ${planet}:`, err.message);
    });
  });

  try {
    await Promise.all(downloadPromises);
    console.log('\n✅ 所有纹理下载完成！');
    console.log(`📁 保存位置: ${texturesDir}`);
    console.log('\n💡 提示: 项目会自动使用本地纹理');
  } catch (error) {
    console.error('\n❌ 下载过程出错:', error);
  }
}

// 运行下载
downloadAllTextures();
