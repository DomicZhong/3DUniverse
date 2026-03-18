import { useStore } from '../../store/useStore';
import { planetsData, moonData } from '../../data/planets';
import { playSoundEffect } from '../Scene/AudioManager';

export default function ControlPanel() {
  const {
    timeSpeed,
    setTimeSpeed,
    isPaused,
    setIsPaused,
    scaleMode,
    setScaleMode,
    zoomMultiplier,
    setZoomMultiplier,
    orbitColor,
    setOrbitColor,
    orbitThickness,
    setOrbitThickness,
    showQuiz,
    setShowQuiz,
    setCameraTarget,
    showControlPanel,
    setShowControlPanel,
    starSize,
    setStarSize,
    starBrightness,
    setStarBrightness
  } = useStore();

  const zoomOptions = [0.5, 1, 2, 3, 5, 10];
  const thicknessOptions = [0, 1, 2, 3, 5, 10];
  const starSizeOptions = [0.3, 0.5, 0.8, 1.0, 1.5, 2.0];
  const starBrightnessOptions = [0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0];

  const orbitColors = [
    { name: '灰色', value: '#333333' },
    { name: '白色', value: '#FFFFFF' },
    { name: '金色', value: '#FFD700' },
    { name: '蓝色', value: '#4169E1' },
    { name: '红色', value: '#DC143C' },
    { name: '绿色', value: '#228B22' }
  ];

  return (
    <>
      {/* 折叠按钮 */}
      <button
        onClick={() => setShowControlPanel(!showControlPanel)}
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-all ${
          showControlPanel ? 'hidden' : 'block'
        }`}
        title="显示控制面板"
      >
        ⚙️
      </button>

      {/* 主面板 */}
      <div
        className={`fixed top-4 left-4 bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-700 text-white transition-all duration-300 ${
          showControlPanel ? 'max-h-[90vh] overflow-y-auto p-4' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-yellow-400">控制面板</h3>
          <button
            onClick={() => setShowControlPanel(false)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="隐藏面板"
          >
            ✕
          </button>
        </div>

      {/* 播放/暂停 */}
      <div className="mb-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
        >
          {isPaused ? '▶ 继续' : '⏸ 暂停'}
        </button>
      </div>

      {/* 快速跳转 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">🚀 快速跳转</label>
        <div className="grid grid-cols-3 gap-2">
          {planetsData.map((planet) => (
            <button
              key={planet.id}
              onClick={() => {
                setCameraTarget(planet.id);
                playSoundEffect('jump');
              }}
              className="px-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
              title={planet.name}
            >
              {planet.name}
            </button>
          ))}
          <button
            key={moonData.id}
            onClick={() => {
              setCameraTarget(moonData.id);
              playSoundEffect('jump');
            }}
            className="px-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
            title={moonData.name}
          >
            {moonData.name}
          </button>
        </div>
      </div>

      {/* 时间速度 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-gray-300">⏱️ 时间速度</label>
          <span className="text-sm text-yellow-400 font-semibold">{timeSpeed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="-10"
          max="30"
          step="1"
          value={Math.log10(timeSpeed) * 10}
          onChange={(e) => setTimeSpeed(Math.pow(10, parseFloat(e.target.value) / 10))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1x</span>
          <span>1x</span>
          <span>10x</span>
          <span>100x</span>
          <span>1000x</span>
        </div>
      </div>

      {/* 相机视角距离 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-gray-300">📷 相机距离</label>
          <span className="text-sm text-yellow-400 font-semibold">{zoomMultiplier.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={zoomMultiplier}
          onChange={(e) => setZoomMultiplier(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0x</span>
          <span>1x</span>
          <span>2x</span>
          <span>3x</span>
          <span>4x</span>
          <span>5x</span>
        </div>
      </div>

      {/* 轨道颜色 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">🎨 轨道颜色</label>
        <div className="flex gap-2 flex-wrap">
          {orbitColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setOrbitColor(color.value)}
              className={`px-3 py-2 rounded text-sm border-2 transition-colors ${
                orbitColor === color.value
                  ? 'border-white bg-gray-600'
                  : 'border-transparent bg-gray-700 hover:bg-gray-600'
              }`}
              style={{
                backgroundColor: color.value,
                color: color.value === '#FFFFFF' ? '#000000' : '#FFFFFF'
              }}
              title={color.name}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* 轨道粗细 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">📏 轨道粗细</label>
        <div className="flex gap-2">
          {thicknessOptions.map((thickness) => (
            <button
              key={thickness}
              onClick={() => setOrbitThickness(thickness)}
              className={`px-4 py-2 rounded text-sm ${
                orbitThickness === thickness
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              } transition-colors`}
            >
              {thickness}
            </button>
          ))}
        </div>
      </div>

      {/* 恒星大小 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">✨ 恒星大小</label>
        <div className="flex gap-2 flex-wrap">
          {starSizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => setStarSize(size)}
              className={`px-3 py-1 rounded text-sm ${
                starSize === size
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              } transition-colors`}
            >
              {size}x
            </button>
          ))}
        </div>
      </div>

      {/* 恒星亮度 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">💡 恒星亮度</label>
        <div className="flex gap-2 flex-wrap">
          {starBrightnessOptions.map((brightness) => (
            <button
              key={brightness}
              onClick={() => setStarBrightness(brightness)}
              className={`px-3 py-1 rounded text-sm ${
                starBrightness === brightness
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              } transition-colors`}
            >
              {brightness}x
            </button>
          ))}
        </div>
      </div>

      {/* 缩放模式 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">显示模式</label>
        <div className="flex gap-2">
          <button
            onClick={() => setScaleMode('realistic')}
            className={`px-3 py-2 rounded text-sm ${
              scaleMode === 'realistic'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            写实模式
          </button>
          <button
            onClick={() => setScaleMode('educational')}
            className={`px-3 py-2 rounded text-sm ${
              scaleMode === 'educational'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            } transition-colors`}
          >
            教育模式
          </button>
        </div>
      </div>

      {/* 知识问答 */}
      <button
        onClick={() => setShowQuiz(true)}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-semibold"
      >
        🎮 知识问答
      </button>
      </div>
    </>
  );
}
