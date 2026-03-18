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
  const { zoomMultiplier, cameraTarget, setCameraTarget, setSelectedPlanet } = useStore();
  const { camera, scene } = useThree();
  const controls = useContext(ControlsContext);

  console.log('CameraJumper render:', { cameraTarget, hasCamera: !!camera, hasControls: !!controls });

  useEffect(() => {
    console.log('CameraJumper useEffect triggered:', { cameraTarget });
    if (cameraTarget && camera && controls) {
      console.log('Jumping to:', cameraTarget);

      // 短暂延迟确保所有元素都已渲染
      setTimeout(() => {

      // 查找目标（行星或月球）
      const planet = planetsData.find(p => p.id === cameraTarget);
      const moon = cameraTarget === 'moon' ? moonData : null;
      const targetData = planet || moon;

      if (targetData) {
        // 自动选中行星，显示详情
        setSelectedPlanet(targetData);

        // 查找目标在场景中的实际世界位置
        let targetPosition = new THREE.Vector3();
        let foundTarget = false;

        console.log('Starting scene traverse to find planet:', cameraTarget);

        scene.traverse((object) => {
          // 优先查找标记为 isPlanetMesh 的 mesh，这是行星或月球的实际网格
          if (object.userData && object.userData.planetId === cameraTarget) {
            // 如果找到了标记为 isPlanetMesh 的 mesh，直接使用其位置
            if (object.userData.isPlanetMesh) {
              const worldPosition = new THREE.Vector3();
              object.getWorldPosition(worldPosition);
              targetPosition.copy(worldPosition);
              foundTarget = true;
              console.log('Found planet/moon mesh at real position:', targetPosition, 'object:', object);
            }
            // 如果是 group 但还没有找到 mesh，继续查找（向后兼容）
            else if (!foundTarget && object.isGroup) {
              object.traverse((child) => {
                if (child.userData && child.userData.isPlanetMesh) {
                  const worldPosition = new THREE.Vector3();
                  child.getWorldPosition(worldPosition);
                  targetPosition.copy(worldPosition);
                  foundTarget = true;
                  console.log('Found planet mesh via group traverse:', targetPosition, 'object:', child);
                }
              });
            }
            // 如果是 mesh 但没有 isPlanetMesh 标记（向后兼容月球）
            else if (!foundTarget && object.isMesh && object.geometry) {
              const worldPosition = new THREE.Vector3();
              object.getWorldPosition(worldPosition);
              targetPosition.copy(worldPosition);
              foundTarget = true;
              console.log('Found mesh at real position (fallback):', targetPosition, 'object:', object);
            }
          }
        });

        console.log('Scene traverse completed, foundTarget:', foundTarget, 'targetPosition:', targetPosition);

        // 如果没找到，使用计算的位置作为备用
        if (!foundTarget) {
          if (planet) {
            const orbitRadius = 2 + Math.log10(planet.distanceFromSun) * 15;
            targetPosition.set(orbitRadius, 0, 0);
          } else {
            // 月球使用固定偏移
            const earthOrbitRadius = 2 + Math.log10(149.6) * 15;
            targetPosition.set(earthOrbitRadius + 3, 0, 0);
          }
          console.log('Using calculated position as fallback:', targetPosition);
        }

        const planetSize = scale * 0.3 + Math.log10(targetData.diameter / 1000) * 0.3;
        const distance = planetSize * 10 * zoomMultiplier;

        console.log('Camera jump details:', { planetSize, distance, targetPosition, foundTarget });

        // 计算相机位置：从目标位置向外延伸，使目标在屏幕中央
        const startPos = camera.position.clone();
        // 从正前方稍上方视角看行星，确保行星在屏幕中央
        const endPos = targetPosition.clone().add(new THREE.Vector3(0, distance * 0.2, distance));

        const duration = 1000; // 1秒
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // 使用缓动函数
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          // 插值相机位置
          const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, easeProgress);
          camera.position.copy(currentPos);

          // 设置 controls.target 为目标位置，使目标位于屏幕中央
          controls.target.lerpVectors(controls.target.clone(), targetPosition, easeProgress);
          controls.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // 动画完成后，确保target精确对准目标位置
            controls.target.copy(targetPosition);
            camera.lookAt(targetPosition);
            controls.update();
            console.log('Camera jump completed:', {
              cameraPosition: camera.position,
              targetPosition: controls.target,
              planetPosition: targetPosition
            });
          }
        };

        animate();
        setCameraTarget(null);
      }
      }, 100); // 100ms延迟
    }
  }, [cameraTarget, planetsData, scale, zoomMultiplier, setCameraTarget, setSelectedPlanet, camera, controls, scene, moonData]);

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
