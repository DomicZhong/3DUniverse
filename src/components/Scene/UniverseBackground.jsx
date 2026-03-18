import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 增强的宇宙背景组件
 * 包含多层星空、星云和宇宙尘埃效果
 * @param {Object} props
 * @param {number} [props.starSize=1.0] - 恒星大小倍数 (0.1-3.0)
 * @param {number} [props.starBrightness=1.0] - 恒星亮度倍数 (0.1-3.0)
 */
export default function UniverseBackground({ starSize = 1.0, starBrightness = 1.0 }) {
  const starFieldRef = useRef();
  const nebulaRef = useRef();
  const galaxyRef = useRef();

  // 生成星空纹理
  const createStarTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // 创建发光的星星
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
  };

  // 生成星云纹理
  const createNebulaTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 创建柔和的星云效果
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(100, 150, 255, 0.15)');
    gradient.addColorStop(0.3, 'rgba(150, 100, 255, 0.1)');
    gradient.addColorStop(0.6, 'rgba(255, 100, 150, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // 添加一些随机噪点
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  // 生成远场恒星
  const createFarStars = () => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 2000; i++) {
      const radius = 500 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      const brightness = 0.3 + Math.random() * 0.7;
      colors.push(brightness, brightness, brightness);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  };

  // 生成星云
  const createNebulaClouds = () => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    const nebulaColors = [
      new THREE.Color('#6699FF'),
      new THREE.Color('#FF6699'),
      new THREE.Color('#9966FF'),
      new THREE.Color('#66FF99'),
    ];

    for (let i = 0; i < 50; i++) {
      const radius = 400 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors.push(color.r, color.g, color.b);

      sizes.push(50 + Math.random() * 100);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return geometry;
  };

  // 生成增强的银河系
  const createGalaxy = () => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    const arms = 4; // 增加到4条旋臂
    const starsPerArm = 1500; // 每条旋臂1500颗星
    const coreStars = 2000; // 核心恒星数量

    // 银河系颜色调色板 - 从核心到外围
    const coreColor = new THREE.Color(0.9, 0.8, 0.6); // 淡金黄色核心
    const midColor = new THREE.Color(0.85, 0.7, 0.5); // 淡橙色中间层
    const outerColor = new THREE.Color(0.6, 0.7, 1.0); // 蓝色外围

    // 生成旋臂
    for (let arm = 0; arm < arms; arm++) {
      const armAngleOffset = (arm / arms) * Math.PI * 2;
      const spiralFactor = 3; // 旋臂卷曲程度

      for (let i = 0; i < starsPerArm; i++) {
        const progress = i / starsPerArm;
        const radius = 30 + progress * 470; // 从30到500

        // 螺旋角度
        const spiralAngle = armAngleOffset + progress * spiralFactor * Math.PI * 2;

        // 添加一些随机散布，使旋臂更自然
        const spread = 15 * (1 - progress * 0.5); // 核心处更密集
        const randomAngle = (Math.random() - 0.5) * spread * 0.1;
        const randomRadius = (Math.random() - 0.5) * spread * 0.3;

        const x = Math.cos(spiralAngle + randomAngle) * (radius + randomRadius);
        const y = (Math.random() - 0.5) * 40 * (1 - progress * 0.8); // 银河盘面厚度
        const z = Math.sin(spiralAngle + randomAngle) * (radius + randomRadius);

        positions.push(x, y, z);

        // 颜色渐变 - 从金黄色到蓝色
        let starColor;
        if (progress < 0.3) {
          starColor = new THREE.Color().lerpColors(coreColor, midColor, progress / 0.3);
        } else {
          starColor = new THREE.Color().lerpColors(midColor, outerColor, (progress - 0.3) / 0.7);
        }

        // 添加一些颜色变化
        starColor.r += (Math.random() - 0.5) * 0.1;
        starColor.g += (Math.random() - 0.5) * 0.1;
        starColor.b += (Math.random() - 0.5) * 0.1;

        colors.push(starColor.r, starColor.g, starColor.b);

        // 恒星大小 - 核心更大，外围更小
        const size = (1.2 - progress * 0.8) * (0.8 + Math.random() * 0.4);
        sizes.push(size);
      }
    }

    // 添加核心恒星 - 密集的球形分布
    for (let i = 0; i < coreStars; i++) {
      // 使用高斯分布模拟核心密度
      const u = Math.random();
      const v = Math.random();
      const radius = Math.pow(u, 0.5) * 40; // 40是核心半径

      const theta = v * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      // 核心恒星颜色 - 金黄色到白色
      const brightness = 0.8 + Math.random() * 0.2;
      const warmth = 1.0 - radius / 50; // 越靠近核心越暖
      const r = brightness;
      const g = brightness * (0.85 + warmth * 0.15);
      const b = brightness * (0.6 + warmth * 0.2);

      colors.push(r, g, b);

      // 核心恒星更大更亮
      const size = (1.5 - radius / 40) * (1.2 + Math.random() * 0.8);
      sizes.push(size);
    }

    // 添加恒星团
    const clusters = 8;
    const starsPerCluster = 60;

    for (let c = 0; c < clusters; c++) {
      const clusterRadius = 100 + Math.random() * 300;
      const clusterAngle = Math.random() * Math.PI * 2;
      const clusterX = Math.cos(clusterAngle) * clusterRadius;
      const clusterZ = Math.sin(clusterAngle) * clusterRadius;

      for (let i = 0; i < starsPerCluster; i++) {
        const spread = 8;
        const x = clusterX + (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread * 0.3;
        const z = clusterZ + (Math.random() - 0.5) * spread;

        positions.push(x, y, z);

        // 恒星团颜色 - 偏蓝白色
        const brightness = 0.6 + Math.random() * 0.4;
        colors.push(brightness, brightness, brightness * 1.1);

        sizes.push(0.5 + Math.random() * 0.5);
      }
    }

    // 添加疏散恒星
    const scatteredStars = 500;
    for (let i = 0; i < scatteredStars; i++) {
      const radius = 50 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI; // 扁平分布

      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi) * 20 * 0.3;
      const z = radius * Math.sin(theta) * Math.cos(phi);

      positions.push(x, y, z);

      // 疏散恒星颜色 - 更多变化
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // 白色恒星
        const brightness = 0.5 + Math.random() * 0.5;
        colors.push(brightness, brightness, brightness);
      } else if (colorChoice < 0.6) {
        // 红色恒星
        const brightness = 0.5 + Math.random() * 0.3;
        colors.push(brightness, brightness * 0.6, brightness * 0.5);
      } else {
        // 蓝色恒星
        const brightness = 0.6 + Math.random() * 0.4;
        colors.push(brightness * 0.8, brightness * 0.85, brightness);
      }

      sizes.push(0.3 + Math.random() * 0.7);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return geometry;
  };

  const starTexture = createStarTexture();
  const nebulaTexture = createNebulaTexture();

  // 缓慢旋转背景
  useFrame((_state, delta) => {
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y += delta * 0.01;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * 0.005;
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <group>
      {/* 远场恒星背景 */}
      <points ref={starFieldRef} geometry={createFarStars()}>
        <pointsMaterial
          size={1.2 * starSize}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.4 * starBrightness}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 增强的银河系 */}
      <points ref={galaxyRef} geometry={createGalaxy()}>
        <pointsMaterial
          size={0.96 * starSize}
          sizeAttenuation={true}
          vertexColors
          map={starTexture}
          transparent
          opacity={0.7 * starBrightness}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 星云云雾 */}
      <points ref={nebulaRef} geometry={createNebulaClouds()}>
        <pointsMaterial
          size={120}
          sizeAttenuation={true}
          vertexColors
          map={nebulaTexture}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 宇宙背景渐变球体 */}
      <mesh scale={[2000, 2000, 2000]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          color="#020205"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
