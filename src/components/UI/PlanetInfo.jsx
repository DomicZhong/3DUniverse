import { useStore } from '../../store/useStore';

export default function PlanetInfo() {
  const { selectedPlanet, setSelectedPlanet } = useStore();

  if (!selectedPlanet) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-md rounded-xl p-5 text-white shadow-2xl border border-gray-700 animate-fade-in">
      {/* 关闭按钮 */}
      <button
        onClick={() => setSelectedPlanet(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
      >
        ✕
      </button>

      {/* 行星名称 */}
      <h2 className="text-2xl font-bold mb-1 text-yellow-400">{selectedPlanet.name}</h2>
      <p className="text-sm text-gray-400 mb-4">{selectedPlanet.nameEn}</p>

      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">直径</p>
          <p className="font-semibold">{selectedPlanet.diameter.toLocaleString()} km</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">距离太阳</p>
          <p className="font-semibold">{selectedPlanet.distanceFromSun} 百万km</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">公转周期</p>
          <p className="font-semibold">{selectedPlanet.orbitalPeriod} 地球日</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">自转周期</p>
          <p className="font-semibold">{selectedPlanet.rotationPeriod} 地球日</p>
        </div>
      </div>

      {/* 描述 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">介绍</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{selectedPlanet.description}</p>
      </div>

      {/* 趣味知识 */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-700/30">
        <h3 className="text-sm font-semibold text-yellow-400 mb-2">💡 趣味知识</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{selectedPlanet.funFact}</p>
      </div>
    </div>
  );
}
