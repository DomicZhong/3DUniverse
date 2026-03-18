import { useRef, useEffect, createContext, useContext, useState } from 'react';
import { useStore } from '../../store/useStore';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化音频系统
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('AudioProvider: Initializing audio system...');
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // 创建背景音乐音频元素
      backgroundAudioRef.current = new Audio('/music/background.mp3');
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = 0.3;
      backgroundAudioRef.current.id = 'background-music';
      backgroundAudioRef.current.preload = 'auto';

      console.log('AudioProvider: Audio element created:', backgroundAudioRef.current);
      setIsInitialized(true);
    }

    return () => {
      if (audioRef.current && audioRef.current.state !== 'closed') {
        audioRef.current.close();
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.src = '';
      }
    };
  }, []);

  const value = {
    audioRef,
    backgroundAudioRef,
    isInitialized,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

// 背景音乐播放器
export function BackgroundMusic() {
  const { audioRef, backgroundAudioRef, isInitialized } = useContext(AudioContext);
  const { isPaused } = useStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('BackgroundMusic - isInitialized:', isInitialized, 'backgroundAudioRef:', backgroundAudioRef?.current);

    if (!backgroundAudioRef.current) {
      console.warn('backgroundAudioRef not initialized yet');
      return;
    }

    const audio = backgroundAudioRef.current;
    console.log('Audio element found:', audio, 'volume:', audio.volume);

    // 尝试播放
    const playAudio = () => {
      console.log('Attempting to play background music...');
      if (audioRef.current && audioRef.current.state === 'suspended') {
        audioRef.current.resume();
      }
      audio.play().then(() => {
        console.log('Background music started playing');
      }).catch(err => {
        console.log('Background music play failed:', err);
      });
    };

    // 用户首次交互后播放
    const handleUserInteraction = () => {
      console.log('User interaction detected, playing music');
      playAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isInitialized]);

  // 根据暂停状态控制音乐
  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (isPaused) {
        backgroundAudioRef.current.pause();
      } else {
        backgroundAudioRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  return null;
}

export { AudioContext };

// 音效播放器
export function playSoundEffect(type) {
  const audio = new Audio();

  switch (type) {
    case 'jump':
      audio.src = '/sounds/jump.mp3';
      audio.volume = 0.4;
      break;
    case 'click':
      audio.src = '/sounds/click.mp3';
      audio.volume = 0.3;
      break;
    case 'hover':
      audio.src = '/sounds/hover.mp3';
      audio.volume = 0.2;
      break;
    default:
      return;
  }

  audio.play().catch(() => {});
}
