import { useRef, useEffect, createContext, useContext, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { planetsData, moonData } from '../../data/planets';
import Sun from './Sun';
import Planet from './Planet';
import UniverseBackground from './UniverseBackground';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

// 创建 Context 来共享 controls ref
const ControlsContext = createContext(null);

// 提供 controls ref 的包装组件
function ControlsProvider({ children }) {
  const controlsRef = useRef(null);
  const [controls, setControls] = useState(null);

  useEffect(() => {
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, []);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={300}
        maxPolarAngle={Math.PI / 1.5}
      />
      <ControlsContext.Provider value={controls}>
        {children}
      </ControlsContext.Provider>
    </>
  );
}

// 相机跳转组件
function CameraJumper({ scale }) {
  const { zoomMultiplier, cameraTarget, setCameraTarget } = useStore();
  const { camera, scene } = useThree();
  const controls = useContext(ControlsContext);

  console.log('CameraJumper render:', { cameraTarget, hasCamera: !!camera, hasControls: !!controls });

  useEffect(() => {
    console.log('CameraJumper useEffect triggered:', { cameraTarget });
    if (cameraTarget && camera && controls) {
      console.log('Jumping to:', cameraTarget);

      // 查找目标（行星或月球）
      const planet = planetsData.find(p => p.id === cameraTarget);
      const moon = cameraTarget === 'moon' ? moonData : null;
      const targetData = planet || moon;

      if (targetData) {
        // 查找目标在场景中的实际世界位置
        let targetPosition = new THREE.Vector3();
        let foundTarget = false;
        scene.traverse((object) => {
          if (object.userData && object.userData.planetId === cameraTarget) {
            // 获取世界坐标
            const worldPosition = new THREE.Vector3();
            object.getWorldPosition(worldPosition);
            targetPosition.copy(worldPosition);
            foundTarget = true;
            console.log('Found target at:', targetPosition);
          }
        });

        // 如果没找到，使用计算的位置（不太可能发生）
        if (!foundTarget) {
          if (planet) {
            const orbitRadius = 5 + Math.log10(planet.distanceFromSun) * 15;
            targetPosition.set(orbitRadius, 0, 0);
          } else {
            // 月球使用固定偏移
            const earthOrbitRadius = 5 + Math.log10(149.6) * 15;
            targetPosition.set(earthOrbitRadius + 2.5, 0, 0);
          }
          console.log('Using calculated position:', targetPosition);
        }

        const planetSize = scale * 0.3 + Math.log10(targetData.diameter / 1000) * 0.3;
        const distance = planetSize * 8 * zoomMultiplier;

        console.log('Camera jump details:', { planetSize, distance, targetPosition });

        // 计算相机位置：从目标位置向外延伸，使目标在屏幕中央
        const startPos = camera.position.clone();
        const endPos = targetPosition.clone().add(new THREE.Vector3(distance, distance * 0.3, distance));

        const duration = 1000; // 1秒
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // 使用缓动函数
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          // 插值位置
          const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, easeProgress);
          camera.position.copy(currentPos);

          // 设置 controls.target 为目标位置，使目标位于屏幕中央
          controls.target.lerpVectors(controls.target.clone(), targetPosition, easeProgress);
          controls.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            console.log('Camera jump completed');
          }
        };

        animate();
        setCameraTarget(null);
      }
    }
  }, [cameraTarget, planetsData, scale, zoomMultiplier, setCameraTarget, camera, controls, scene, moonData]);

  return null;
}

export default function SolarSystem() {
  const { scaleMode, starSize, starBrightness } = useStore();
  const scale = scaleMode === 'educational' ? 2 : 1;

  return (
    <div className="w-full h-full">
      <Canvas>
        {/* 摄像机 */}
        <PerspectiveCamera makeDefault position={[0, 30, 50]} fov={60} />

        {/* 宇宙背景 */}
        <UniverseBackground starSize={starSize} starBrightness={starBrightness} />

        {/* 轨道控制器和提供者 */}
        <ControlsProvider>
          {/* 相机跳转器 */}
          <CameraJumper scale={scale} />

          {/* 太阳 */}
          <Sun />

          {/* 行星 */}
          {planetsData.map((planet) => (
            <Planet
              key={planet.id}
              data={planet}
              scale={scale}
            />
          ))}
        </ControlsProvider>

        {/* 灯光 */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[100, 50, 100]} intensity={0.5} />
      </Canvas>
    </div>
  );
}
