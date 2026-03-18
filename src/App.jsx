import SolarSystem from './components/Scene/SolarSystem';
import ControlPanel from './components/UI/ControlPanel';
import PlanetInfo from './components/UI/PlanetInfo';
import Quiz from './components/UI/Quiz';
import Welcome from './components/UI/Welcome';
import AudioControls from './components/UI/AudioControls';
import { AudioProvider } from './components/Scene/AudioManager';

function App() {
  return (
    <AudioProvider>
      <div className="w-screen h-screen bg-black overflow-hidden">
        {/* 3D场景 */}
        <SolarSystem />

        {/* UI组件 */}
        <ControlPanel />
        <PlanetInfo />
        <Quiz />
        <Welcome />
        <AudioControls />
      </div>
    </AudioProvider>
  );
}

export default App;
