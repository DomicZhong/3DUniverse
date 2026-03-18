import * as THREE from 'three';
import { getBasePath } from '../config/assets';

// 纹理配置：优先使用本地，备选使用网络
const textureConfig = {
  // 本地纹理路径（public/textures/）
  localTextures: {
    sun: `${getBasePath()}textures/sun.jpg`,
    mercury: `${getBasePath()}textures/mercury.jpg`,
    venus: `${getBasePath()}textures/venus.jpg`,
    earth: `${getBasePath()}textures/earth.jpg`,
    mars: `${getBasePath()}textures/mars.jpg`,
    jupiter: `${getBasePath()}textures/jupiter.jpg`,
    saturn: `${getBasePath()}textures/saturn.jpg`,
    uranus: `${getBasePath()}textures/uranus.jpg`,
    neptune: `${getBasePath()}textures/neptune.jpg`
  },

  // NASA网络纹理URL（作为备选，使用Three.js官方源）
  nasaTextures: {
    sun: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/sun.jpg',
    mercury: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury.jpg',
    venus: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_atmosphere.jpg',
    earth: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    mars: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars.jpg',
    jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg',
    saturn: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn.jpg',
    uranus: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/uranus.jpg',
    neptune: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/neptune.jpg'
  },

  // 使用模式: 'local' | 'remote' | 'auto'
  mode: 'auto' // auto: 优先本地，失败后使用网络
};

// 纹理缓存
const textureCache = {};

/**
 * 加载行星纹理
 * @param {string} planetId - 行星ID
 * @param {boolean} useFallback - 是否使用程序化纹理作为备选
 * @returns {Promise<THREE.Texture>}
 */
export const loadPlanetTexture = async (planetId, useFallback = true) => {
  // 检查缓存
  if (textureCache[planetId]) {
    return textureCache[planetId];
  }

  const loader = new THREE.TextureLoader();

  // 根据模式选择加载策略
  if (textureConfig.mode === 'local') {
    // 仅使用本地纹理
    return loadTextureFromPath(
      loader,
      textureConfig.localTextures[planetId],
      planetId,
      useFallback
    );
  } else if (textureConfig.mode === 'remote') {
    // 仅使用网络纹理
    return loadTextureFromPath(
      loader,
      textureConfig.nasaTextures[planetId],
      planetId,
      useFallback
    );
  } else {
    // 自动模式：先尝试本地，失败后尝试网络
    try {
      const texture = await loadTextureFromPath(
        loader,
        textureConfig.localTextures[planetId],
        planetId,
        false // 不使用fallback，让外层处理
      );
      return texture;
    } catch (localError) {
      console.log(`⚠️ 本地纹理 ${planetId} 不存在，尝试网络加载...`);
      return loadTextureFromPath(
        loader,
        textureConfig.nasaTextures[planetId],
        planetId,
        useFallback
      );
    }
  }
};

/**
 * 从指定路径加载纹理
 */
function loadTextureFromPath(loader, path, planetId, useFallback) {
  return new Promise((resolve, reject) => {
    if (!path) {
      if (useFallback) {
        loadFallbackTexture(planetId).then(resolve).catch(reject);
      } else {
        reject(new Error(`No texture path for ${planetId}`));
      }
      return;
    }

    loader.load(
      path,
      (texture) => {
        // 纹理加载成功
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // 优化纹理
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;

        // 缓存纹理
        textureCache[planetId] = texture;
        resolve(texture);
      },
      (progress) => {
        // 加载进度
        const percent = Math.round(progress.loaded / progress.total * 100);
        console.log(`Loading ${planetId}: ${percent}%`);
      },
      (error) => {
        // 加载失败
        console.warn(`Failed to load texture: ${path}`, error);
        if (useFallback) {
          loadFallbackTexture(planetId).then(resolve).catch(reject);
        } else {
          reject(error);
        }
      }
    );
  });
}

/**
 * 设置纹理加载模式
 * @param {string} mode - 'local' | 'remote' | 'auto'
 */
export const setTextureMode = (mode) => {
  if (['local', 'remote', 'auto'].includes(mode)) {
    textureConfig.mode = mode;
    console.log(`Texture mode set to: ${mode}`);
  } else {
    console.error(`Invalid texture mode: ${mode}`);
  }
};

/**
 * 获取当前纹理模式
 */
export const getTextureMode = () => {
  return textureConfig.mode;
};

/**
 * 预加载所有纹理
 * @returns {Promise<void>}
 */
export const preloadAllTextures = async () => {
  const planetIds = Object.keys(textureConfig.localTextures);
  const promises = planetIds.map(planetId =>
    loadPlanetTexture(planetId, true)
  );

  try {
    await Promise.all(promises);
    console.log('✅ All textures loaded successfully');
  } catch (error) {
    console.warn('⚠️ Some textures failed to load, using fallback textures');
  }
};

/**
 * 清除纹理缓存
 */
export const clearTextureCache = () => {
  Object.values(textureCache).forEach(texture => {
    if (texture) {
      texture.dispose();
    }
  });
  Object.keys(textureCache).forEach(key => {
    delete textureCache[key];
  });
};

/**
 * 加载备选程序化纹理
 * @param {string} planetId - 行星ID
 * @returns {Promise<THREE.Texture>}
 */
async function loadFallbackTexture(planetId) {
  const { generatePlanetTexture } = await import('./textureGenerator');
  const canvas = generatePlanetTexture(planetId, 1024);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache[planetId] = texture;
  return texture;
}

/**
 * 检查纹理是否已加载
 * @param {string} planetId - 行星ID
 * @returns {boolean}
 */
export const isTextureLoaded = (planetId) => {
  return !!textureCache[planetId];
};

/**
 * 获取纹理加载状态
 * @returns {Object} 加载状态统计
 */
export const getTextureLoadingStatus = () => {
  const total = Object.keys(textureConfig.localTextures).length;
  const loaded = Object.keys(textureCache).length;
  return {
    total,
    loaded,
    progress: Math.round((loaded / total) * 100),
    mode: textureConfig.mode
  };
};
