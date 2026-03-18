import { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function Welcome() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (!showWelcome) return null;

  const handleStart = () => {
    setShowWelcome(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-5 max-w-2xl w-full shadow-2xl border border-gray-700">
        {/* 标题 */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">🌌</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-1">
            探索太阳系
          </h1>
          <p className="text-gray-400 text-base">儿童宇宙学习之旅</p>
        </div>

        {/* 介绍 */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
          <h2 className="text-lg font-semibold text-yellow-400 mb-2">✨ 功能介绍</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5 text-sm">🪐</span>
              <span>观察八大行星的轨道运行，了解它们的运动规律</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5 text-sm">🔍</span>
              <span>点击行星查看详细介绍和趣味知识</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5 text-sm">⏱️</span>
              <span>控制时间速度，观察行星运动变化</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5 text-sm">🎮</span>
              <span>参与知识问答，检验学习成果</span>
            </li>
          </ul>
        </div>

        {/* 操作提示 */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-5">
          <h2 className="text-lg font-semibold text-yellow-400 mb-2">🎯 操作指南</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-gray-700/50 rounded-lg">
              <div className="text-xl mb-1">🖱️</div>
              <p className="text-gray-300 text-xs">拖拽旋转视角</p>
            </div>
            <div className="text-center p-2 bg-gray-700/50 rounded-lg">
              <div className="text-xl mb-1">🔭</div>
              <p className="text-gray-300 text-xs">滚轮缩放场景</p>
            </div>
            <div className="text-center p-2 bg-gray-700/50 rounded-lg">
              <div className="text-xl mb-1">👆</div>
              <p className="text-gray-300 text-xs">点击查看行星详情</p>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 shadow-lg"
        >
          🚀 开始探索
        </button>
      </div>
    </div>
  );
}
