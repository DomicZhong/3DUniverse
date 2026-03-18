export const generatePlanetTexture = (planetId, size = 1024) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const configs = {
    sun: {
      baseColor: '#FFD700',
      colors: ['#FF8C00', '#FF6347', '#FFD700', '#FFA500'],
      noiseIntensity: 0.3
    },
    mercury: {
      baseColor: '#8C7853',
      colors: ['#8B7355', '#A0826D', '#6B5344', '#9A7B6F'],
      noiseIntensity: 0.5
    },
    venus: {
      baseColor: '#FFC649',
      colors: ['#E5B442', '#FFD700', '#DEB425', '#F0C845'],
      noiseIntensity: 0.4
    },
    earth: {
      baseColor: '#6B93D6',
      colors: ['#228B22', '#4169E1', '#2F4F4F', '#4682B4', '#90EE90', '#DEB887'],
      noiseIntensity: 0.6,
      hasContinents: true
    },
    mars: {
      baseColor: '#E27B58',
      colors: ['#CD5C5C', '#B22222', '#D2691E', '#A0522D', '#8B4513'],
      noiseIntensity: 0.4
    },
    jupiter: {
      baseColor: '#C88B3A',
      colors: ['#DEB887', '#CD853F', '#D2691E', '#8B4513', '#F5DEB3', '#A0522D'],
      noiseIntensity: 0.2,
      hasBands: true
    },
    saturn: {
      baseColor: '#EAD6B8',
      colors: ['#F5DEB3', '#DEB887', '#D2B48C', '#FFE4B5', '#C9B896'],
      noiseIntensity: 0.25,
      hasBands: true
    },
    uranus: {
      baseColor: '#D1E7E7',
      colors: ['#B0E0E6', '#ADD8E6', '#87CEEB', '#A0D8D8', '#C8E8E8'],
      noiseIntensity: 0.3
    },
    neptune: {
      baseColor: '#5B5DDF',
      colors: ['#4169E1', '#6495ED', '#5B5DDF', '#4A4AD5', '#6F6FE8'],
      noiseIntensity: 0.25
    }
  };

  const config = configs[planetId] || configs.earth;

  // 绘制基础颜色
  ctx.fillStyle = config.baseColor;
  ctx.fillRect(0, 0, size, size);

  // 添加噪声纹理
  if (config.hasBands) {
    // 条带模式（木星、土星）
    const bands = 15;
    const bandHeight = size / bands;
    for (let i = 0; i < bands; i++) {
      const color = config.colors[i % config.colors.length];
      ctx.fillStyle = color;
      ctx.fillRect(0, i * bandHeight, size, bandHeight + Math.sin(i * 0.5) * 20);

      // 添加波动的顶部和底部
      const points = [];
      for (let x = 0; x <= size; x += 10) {
        points.push({
          x,
          y: i * bandHeight + Math.sin(x * 0.01 + i) * 10
        });
      }
      drawSmoothCurve(ctx, points, color);
    }
  } else if (config.hasContinents) {
    // 地球大陆模式
    ctx.fillStyle = config.colors[1]; // 海洋
    ctx.fillRect(0, 0, size, size);

    // 绘制大陆
    for (let i = 0; i < 20; i++) {
      drawContinent(ctx, size, config.colors[0]);
    }

    // 绘制云层
    drawClouds(ctx, size);
  } else {
    // 普通行星噪声模式
    addNoise(ctx, size, config, config.noiseIntensity);
  }

  // 添加光照效果（球面渐变）
  const gradient = ctx.createRadialGradient(
    size * 0.3, size * 0.3, 0,
    size * 0.5, size * 0.5, size * 0.7
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return canvas;
};

const addNoise = (ctx, size, config, intensity) => {
  for (let i = 0; i < size * size * 0.1; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const radius = Math.random() * 3 + 1;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, Math.random() * intensity);
    ctx.fill();
  }

  // 添加更多细节的噪点
  for (let i = 0; i < size * size * 0.05; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const radius = Math.random() * 5 + 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, Math.random() * intensity * 0.5);
    ctx.fill();
  }
};

const drawContinent = (ctx, size, color) => {
  const centerX = Math.random() * size;
  const centerY = Math.random() * size;
  const radius = Math.random() * 100 + 50;

  ctx.beginPath();
  ctx.fillStyle = hexToRgba(color, 0.8);

  // 生成不规则大陆形状
  const points = [];
  const numPoints = 20;
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const variation = Math.random() * 40 - 20;
    const r = radius + variation;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    points.push({ x, y });
  }

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
};

const drawClouds = (ctx, size) => {
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 60 + 20;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
};

const drawSmoothCurve = (ctx, points, color) => {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
