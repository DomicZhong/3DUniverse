// 资源路径配置
// 根据部署环境自动调整资源路径
export const getBasePath = () => {
  // 开发环境
  if (import.meta.env.DEV) {
    return '';
  }
  // 生产环境，使用 vite.config.js 中配置的 base
  return import.meta.env.BASE_URL;
};

export const ASSETS_PATH = {
  textures: '/textures/',
  music: '/music/',
  sounds: '/sounds/',
  icons: '/'
};

// 获取完整的资源路径
export const getTexturePath = (filename) => {
  return `${getBasePath()}textures/${filename}`;
};

export const getMusicPath = (filename) => {
  return `${getBasePath()}music/${filename}`;
};

export const getSoundPath = (filename) => {
  return `${getBasePath()}sounds/${filename}`;
};
