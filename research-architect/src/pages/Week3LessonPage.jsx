import { useRef } from "react";
import { GameContainer } from "../components/game/GameContainer.jsx";

export default function Week3LessonPage() {
  const jumpToLevelRef = useRef(null);

  const handleJumpToLevel = (level) => {
    console.log('handleJumpToLevel called with level:', level);
    console.log('jumpToLevelRef.current:', jumpToLevelRef.current);
    if (jumpToLevelRef.current) {
      jumpToLevelRef.current(level);
    } else {
      console.error('jumpToLevelRef.current is null!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05070a] via-[#0b1118] to-[#05070a] text-white py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-lab-neon-blue/70">
            <span 
              className="relative z-50 select-none"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('OLO clicked, jumping to level 1');
                handleJumpToLevel(1);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              OLO
            </span>
            {" · "}
            <span 
              className="relative z-50 select-none"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Week 3 clicked, jumping to level 2');
                handleJumpToLevel(2);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Week 3
            </span>
            {" · "}
            <span 
              className="relative z-50 select-none"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Onderzoeksmodel clicked, jumping to level 3');
                handleJumpToLevel(3);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Onderzoeksmodel
            </span>
          </p>
        </header>

        <GameContainer onJumpToLevelRef={jumpToLevelRef} />
      </div>
    </main>
  );
}

