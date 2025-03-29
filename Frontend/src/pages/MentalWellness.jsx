import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MentalWellness() {
  // Breathing Exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // "Inhale" or "Exhale"
  const [seconds, setSeconds] = useState(4);

  // Mock data for prompts
  const prompts = [
    'What made you smile today?',
    'What are you grateful for right now?',
    'Describe a moment of peace you experienced today.',
  ];

  // Mock data for audio links
  const audioLinks = [
    { name: 'Calm Rain - Freesound.org', url: 'https://freesound.org/people/inchadney/sounds/123104/' },
    { name: 'Ocean Waves - Freesound.org', url: 'https://freesound.org/people/SoundJay/sounds/252978/' },
    { name: 'Forest Ambience - Freesound.org', url: 'https://freesound.org/people/klankbeeld/sounds/137149/' },
  ];

  // Breathing Exercise logic
  useEffect(() => {
    let timer;
    if (isBreathing) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 1) {
            setPhase(phase === 'Inhale' ? 'Exhale' : 'Inhale');
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathing, phase]);

  const handleStartStop = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setPhase('Inhale');
      setSeconds(4);
    } else {
      setIsBreathing(true);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Mental Wellness Corner</h2>

      {/* Breathing Exercise */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Breathing Exercise</h3>
        <div className="text-center">
          <p className="text-3xl mb-4">
            {phase} for {seconds}s
          </p>
          <button
            onClick={handleStartStop}
            className={`w-full py-2 rounded-lg transition-colors ${
              isBreathing
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            {isBreathing ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Prompts and Audio Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prompts */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Reflection Prompts</h3>
          {prompts.length > 0 ? (
            <ul className="space-y-4">
              {prompts.map((prompt, index) => (
                <li key={index}>
                  <Link
                    to={`/journal?prompt=${encodeURIComponent(prompt)}`}
                    className="text-purple-400 hover:text-purple-500"
                  >
                    {prompt}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No prompts available.</p>
          )}
        </div>

        {/* Audio Links */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Relaxation Audio</h3>
          {audioLinks.length > 0 ? (
            <ul className="space-y-4">
              {audioLinks.map((audio, index) => (
                <li key={index}>
                  <a
                    href={audio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-500"
                  >
                    {audio.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No audio links available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentalWellness;