import { create } from 'zustand';

export const useStore = create((set) => ({
  // 选中的行星
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),

  // 时间流逝速度
  timeSpeed: 1,
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),

  // 缩放模式
  scaleMode: 'realistic', // 'realistic' | 'educational'
  setScaleMode: (mode) => set({ scaleMode: mode }),

  // 缩放倍数
  zoomMultiplier: 1,
  setZoomMultiplier: (multiplier) => set({ zoomMultiplier: multiplier }),

  // 轨道颜色
  orbitColor: '#FFFFFF',
  setOrbitColor: (color) => set({ orbitColor: color }),

  // 轨道粗细
  orbitThickness: 2,
  setOrbitThickness: (thickness) => set({ orbitThickness: thickness }),

  // 暂停/播放
  isPaused: false,
  setIsPaused: (paused) => set({ isPaused: paused }),

  // 漫游模式
  isRoaming: false,
  setIsRoaming: (roaming) => set({ isRoaming: roaming }),

  // 知识问答面板
  showQuiz: false,
  setShowQuiz: (show) => set({ showQuiz: show }),

  // 问答进度
  quizScore: 0,
  currentQuestionIndex: 0,
  setQuizScore: (score) => set({ quizScore: score }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  // 相机目标位置
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // 控制面板显示状态
  showControlPanel: true,
  setShowControlPanel: (show) => set({ showControlPanel: show }),

  // 音量面板显示状态
  showAudioPanel: true,
  setShowAudioPanel: (show) => set({ showAudioPanel: show }),
}));
