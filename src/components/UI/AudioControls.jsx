import { useState, useEffect, useContext } from 'react';
import { BackgroundMusic, AudioContext } from '../Scene/AudioManager';

export default function AudioControls() {
  const { backgroundAudioRef, isInitialized } = useContext(AudioContext);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const audio = backgroundAudioRef?.current;

  const toggleMute = () => {
    console.log('Toggle mute - audio:', audio, 'current muted:', audio?.muted);
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!audio.muted);
      console.log('New muted state:', audio.muted);
    } else {
      console.warn('Audio element not found');
    }
  };

  const adjustVolume = (newVolume) => {
    console.log('Adjust volume - audio:', audio, 'new volume:', newVolume);
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      console.log('Volume set to:', audio.volume);
    } else {
      console.warn('Audio element not found');
    }
  };

  // 初始化状态
  useEffect(() => {
    if (audio) {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    }
  }, [audio, isInitialized]);

  // 监听音频元素的音量和静音状态变化
  useEffect(() => {
    if (audio) {
      const handleVolumeChange = () => {
        setVolume(audio.volume);
        setIsMuted(audio.muted);
      };
      audio.addEventListener('volumechange', handleVolumeChange);
      return () => audio.removeEventListener('volumechange', handleVolumeChange);
    }
  }, [audio]);

  return (
    <>
      <BackgroundMusic />
      <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-md rounded-xl p-4 text-white shadow-xl border border-gray-700">
        <div className="flex items-center gap-3">
          {/* 音量按钮 */}
          <button
            onClick={toggleMute}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* 音量滑块 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">音量</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => adjustVolume(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isMuted}
            />
          </div>

          {/* 音量数值 */}
          <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </>
  );
}
