import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Level1 from "./Level1.jsx";
import Level2 from "./Level2.jsx";
import Level3 from "./Level3.jsx";

/**
 * GameContainer vormt de basis van The Research Architect.
 * Het component bewaart globale game-state zodat toekomstige levels kunnen inhaken.
 */
export function GameContainer({ title = "The Research Architect", onJumpToLevelRef }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [qualityIndex, setQualityIndex] = useState(50); // Research Quality Index (0-100)
  const [isStarted, setIsStarted] = useState(false);

  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

  const percentage = useMemo(() => Math.round(clamp(qualityIndex)), [qualityIndex]);

  const rank = useMemo(() => {
    if (percentage < 55) return "Junior Intern";
    if (percentage < 75) return "Research Assistant";
    if (percentage < 90) return "Logistics Architect";
    return "Chief Visionary Officer";
  }, [percentage]);

  const addQuality = useCallback((delta) => {
    setQualityIndex((prev) => clamp(prev + delta));
  }, []);

  const resetGame = () => {
    setIsStarted(false);
    setCurrentLevel(0);
    setQualityIndex(50);
  };

  const restartFromLevel1 = () => {
    setIsStarted(true);
    setCurrentLevel(1);
    setQualityIndex(50);
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentLevel(1);
  };

  const handleLevelComplete = () => {
    setCurrentLevel((prev) => Math.min(prev + 1, 3));
  };

  const renderLevelContent = () => {
    switch (currentLevel) {
      case 1:
        return <Level1 onComplete={handleLevelComplete} onAddQuality={addQuality} />;
      case 2:
        return <Level2 onComplete={handleLevelComplete} onAddQuality={addQuality} />;
      case 3:
        return (
          <Level3
            onComplete={handleLevelComplete}
            onRestart={restartFromLevel1}
            onAddQuality={addQuality}
            qualityPercentage={percentage}
            qualityRank={rank}
          />
        );
      default:
        return null;
    }
  };

  const handleJumpToLevel = useCallback((level) => {
    console.log('handleJumpToLevel called in GameContainer with level:', level);
    setIsStarted(true);
    setCurrentLevel(level);
  }, []);

  // Expose jump function via ref callback
  useEffect(() => {
    if (onJumpToLevelRef) {
      onJumpToLevelRef.current = handleJumpToLevel;
      console.log('Jump function exposed via ref');
    }
  }, [onJumpToLevelRef, handleJumpToLevel]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 relative" data-game-container>
      <motion.section
        className="bg-lab-surface/80 border border-white/5 rounded-3xl p-8 shadow-neon backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <header className="flex flex-row items-center justify-between w-full p-4 border-b border-white/10 mb-6">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>

          {isStarted && (
            <div className="flex gap-6 text-sm text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-slate-500">Level</span>
                <span className="text-white font-semibold">{currentLevel}/3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-slate-500">RQI</span>
                <span
                  className={`font-semibold ${
                    percentage < 55
                      ? "text-red-400"
                      : percentage < 75
                      ? "text-orange-300"
                      : "text-green-400"
                  }`}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          )}
        </header>

        {!isStarted && (
          <div className="text-center space-y-4 mb-6">
            <p className="text-gray-400 text-sm max-w-3xl mx-auto leading-relaxed">
              Welkom in het Logistics Lab. Scania staat voor een cruciale keuze: mens of machine? Jouw missie: Ontwerp en valideer het onderzoek dat bepaalt of robots de productiviteit daadwerkelijk verhogen. Van blauwdruk tot advies – jij bouwt de fundering voor deze strategische beslissing.
            </p>
          </div>
        )}

        {!isStarted ? (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-slate-300 mb-6">
              Zet je AR-bril op, kalibreer de mixers en bereid je voor om het onderzoeksmodel van Scania te reconstrueren.
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-lab-neon-blue to-lab-neon-green text-gray-900 font-semibold shadow-neon hover:scale-[1.02] transition-transform"
            >
              Start Mission
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`level-${currentLevel}`}
            className="mt-6 border border-white/10 rounded-3xl p-4 md:p-6 bg-white/5 text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderLevelContent()}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

GameContainer.propTypes = {
  title: PropTypes.string,
};

