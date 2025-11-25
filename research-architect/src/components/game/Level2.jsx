import { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const CASES = [
  {
    id: 1,
    question: "Manager: 'Houden chauffeurs zich aan de regels?'",
    correctAnswer: "normatief",
    correctSource: "Het Veiligheidsprotocol",
    wrongSources: [
      {
        name: "Logboek Ongevallen",
        feedback: "Fout. Het logboek toont de feiten (wat er misging). Voor een Normatieve optiek zoek je eerst de regel (Norm) waaraan je toetst.",
      },
      {
        name: "Interview Chauffeur",
        feedback: "Dit is een mening, geen objectieve norm.",
      },
    ],
    explanation: "Dit toetst aan een norm (het veiligheidsprotocol).",
    wrongExplanation: "Dit is geen feitelijke vraag. Het gaat om het toetsen aan een norm.",
  },
  {
    id: 2,
    question: "Manager: 'Verhogen robots de productiviteit?'",
    correctAnswer: "feitelijk",
    correctSource: "Productiviteitsdata (Output/Uur)",
    wrongSources: [
      {
        name: "Technische Specificaties Robot",
        feedback: "Niet juist. Specificaties beloven wat de robot kan. Jij zoekt harde data uit de praktijk om de stijging te bewijzen.",
      },
      {
        name: "Offerte Leverancier",
        feedback: "Niet juist. Specificaties beloven wat de robot kan. Jij zoekt harde data uit de praktijk om de stijging te bewijzen.",
      },
    ],
    explanation: "Dit zoekt naar een verband tussen robots en productiviteit.",
    wrongExplanation: "Dit is geen normatieve vraag. Het gaat om het vinden van feitelijke verbanden.",
  },
  {
    id: 3,
    question: "Inkoop wil de leverbetrouwbaarheid toetsen. Welke bron gebruik je om de norm (de harde eis) vast te stellen waaraan de leverancier moet voldoen?",
    correctAnswer: "normatief",
    correctSource: "Service Level Agreement (SLA)",
    wrongSources: [
      {
        name: "Leveranciersbeoordeling Q1",
        feedback: "Logische gedachte, maar niet juist in deze stap. De beoordeling is de data (de meting achteraf). Om te kunnen meten, moet je eerst de meetlat (de afspraken) hebben. Waar staan die afspraken in?",
      },
      {
        name: "Algemene Inkoopvoorwaarden",
        feedback: "Fout. De beoordeling is de meting (Data). Je zoekt de afspraak (Norm) waartegen je die meting houdt.",
      },
    ],
    explanation: "Correct. In de SLA staan de criteria (de norm) vastgelegd. Dit is je meetlat. Pas in de volgende fase leg je de beoordeling (data) hierlangs.",
    wrongExplanation: "Onjuist. Je hoeft geen verborgen verband te zoeken. Er ligt een harde afspraak (norm) en je kijkt simpelweg: voldoet het wel of niet?",
  },
  {
    id: 4,
    question: "Hypothese: Dialecten veroorzaken pickfouten.",
    correctAnswer: "feitelijk",
    correctSource: "Foutenrapportage & Audio-logs",
    wrongSources: [
      {
        name: "Klachtenprocedure Klant",
        feedback: "Fout. Procedures beschrijven hoe het hoort. Om een oorzaak (dialect) te vinden, heb je data nodig die fouten koppelt aan spraak.",
      },
      {
        name: "Training Voice-systeem",
        feedback: "Fout. Procedures beschrijven hoe het hoort. Om een oorzaak (dialect) te vinden, heb je data nodig die fouten koppelt aan spraak.",
      },
    ],
    explanation: "Juist! Je spreekt een verwachting uit (hypothese): 'Het voice-systeem veroorzaakt fouten door dialect'. Je gaat onderzoeken of dit oorzakelijke verband echt bestaat.",
    wrongExplanation: "Niet juist. Er is geen 'norm' voor hoeveel dialect een systeem mag verstaan. Je onderzoekt hier een oorzaak-gevolg relatie (Voice picking -> Fouten).",
  },
  {
    id: 5,
    question: "De Supply Chain Director eist een voorraadbetrouwbaarheid van minimaal 98% om de leverbetrouwbaarheid naar klanten te garanderen.",
    correctAnswer: "normatief",
    correctSource: "Accountantsverklaring / Normkader",
    wrongSources: [
      {
        name: "Huidige Voorraadlijst",
        feedback: "Fout. De lijst is de huidige situatie (Data). Je zoekt het criterium (de Norm) van de Supply Chain Director: welk percentage is vereist?",
      },
      {
        name: "WMS Handleiding",
        feedback: "Fout. De lijst is de huidige situatie (Data). Je zoekt het criterium (de Norm) van de Supply Chain Director: welk percentage is vereist?",
      },
    ],
    explanation: "Correct. De 98% is het criterium (de norm). Je kijkt of de werkelijkheid in het magazijn voldoet aan deze eis.",
    wrongExplanation: "Onjuist. Dit is geen hypothese. Het is een harde check: halen we het cijfer wel of niet?",
  },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Level2({ onComplete, onAddQuality }) {
  const [currentCase, setCurrentCase] = useState(1);
  const [phase, setPhase] = useState("choice"); // "choice" or "evidence"
  const [selectedOptics, setSelectedOptics] = useState(null); // "normatief" or "feitelijk"
  const [attachedSource, setAttachedSource] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [caseCompleted, setCaseCompleted] = useState(false);
  const [shakingSource, setShakingSource] = useState(null);
  const [shuffledSources, setShuffledSources] = useState([]);
  const [caseScores, setCaseScores] = useState(() => CASES.map(() => 0)); // Max 15 per case
  
  const dragRefs = useRef({});
  const lastDragPosition = useRef({ x: 0, y: 0 });

  const currentCaseData = CASES.find((c) => c.id === currentCase);

  // Shuffle sources when case changes or phase changes to evidence
  useEffect(() => {
    if (phase === "evidence" && selectedOptics) {
      const wrongSourceNames = currentCaseData.wrongSources.map((ws) => ws.name);
      const allSources = [currentCaseData.correctSource, ...wrongSourceNames];
      const shuffled = shuffleArray(allSources);
      setShuffledSources(shuffled);
    }
  }, [currentCase, phase, selectedOptics, currentCaseData]);

  // Available sources (not yet attached) - use shuffled order
  const availableSources = useMemo(() => {
    if (shuffledSources.length === 0) return [];
    return shuffledSources.filter((source) => source !== attachedSource);
  }, [shuffledSources, attachedSource]);

  // Helper to get feedback for wrong source
  const getWrongSourceFeedback = (sourceName) => {
    const wrongSource = currentCaseData.wrongSources.find((ws) => ws.name === sourceName);
    return wrongSource?.feedback || "Dit bewijst niets. Zoek de bron die past bij je optiek.";
  };

  const handleOpticsChoice = (optics) => {
    if (phase !== "choice") return;

    const isCorrect = optics === currentCaseData.correctAnswer;

    if (isCorrect) {
      setSelectedOptics(optics);
      setPhase("evidence");
      setFeedback({
        type: "info",
        message: `Je hebt ${optics === "normatief" ? "Normatief" : "Feitelijk"} gekozen. Sleep nu de juiste bron naar de actieve knop om je keuze te onderbouwen.`,
      });
    } else {
      setIsShaking(true);
      setFeedback({
        type: "error",
        message: `Negatief. ${currentCaseData.wrongExplanation}`,
      });

      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  const handleDragEnd = (source, info, event) => {
    // Lock: prevent any drag operations if case is already completed
    if (caseCompleted) {
      // Reset drag position if user tries to drag after completion
      const dragElement = dragRefs.current[source];
      if (dragElement) {
        dragElement.style.transform = 'translate(0px, 0px)';
        dragElement.style.x = '0px';
        dragElement.style.y = '0px';
      }
      return;
    }

    if (phase !== "evidence" || !selectedOptics) return;

    // Try multiple methods to get the drop coordinates (same as Level 1)
    const dropX = event?.clientX ?? info.point.x ?? lastDragPosition.current.x;
    const dropY = event?.clientY ?? info.point.y ?? lastDragPosition.current.y;

    // Find the active button (selectedOptics)
    const activeButton = document.querySelector(
      `[data-optics-button="${selectedOptics}"]`
    );

    if (!activeButton) {
      setFeedback({
        type: "error",
        message: "Sleep de bron naar de actieve knop.",
      });
      return;
    }

    const buttonRect = activeButton.getBoundingClientRect();
    const isOverButton =
      dropX >= buttonRect.left &&
      dropX <= buttonRect.right &&
      dropY >= buttonRect.top &&
      dropY <= buttonRect.bottom;

    if (!isOverButton) {
      setFeedback({
        type: "error",
        message: "Sleep de bron naar de actieve knop.",
      });
      return;
    }

    // Check if source is correct
    const isCorrect = source === currentCaseData.correctSource;

    if (isCorrect) {
      // Success!
      setIsSuccess(true);
      setAttachedSource(source);
      setFeedback({
        type: "success",
        message: `Correct. ${currentCaseData.explanation}`,
      });
      // Beloon deze casus tot max 15 punten
      const caseIndex = currentCase - 1;
      setCaseScores((prev) => {
        const next = [...prev];
        const remaining = Math.max(0, 15 - next[caseIndex]);
        if (remaining > 0 && onAddQuality) {
          onAddQuality(remaining);
        }
        next[caseIndex] = Math.min(15, next[caseIndex] + remaining);
        return next;
      });
      setCaseCompleted(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    } else {
      // Wrong source - shake the source item with specific feedback
      setShakingSource(source);
      setIsShaking(true);
      const specificFeedback = getWrongSourceFeedback(source);
      setFeedback({
        type: "error",
        message: specificFeedback,
      });
      // Foute bron: -5 punten
      if (onAddQuality) {
        onAddQuality(-5);
      }

      setTimeout(() => {
        setIsShaking(false);
        setShakingSource(null);
      }, 600);
    }
  };

  const handleNext = () => {
    if (currentCase < CASES.length) {
      // Move to next case
      setCurrentCase(currentCase + 1);
      setPhase("choice");
      setSelectedOptics(null);
      setAttachedSource(null);
      setFeedback(null);
      setCaseCompleted(false);
      setIsSuccess(false);
      setIsShaking(false);
      setShuffledSources([]);
    } else {
      // All cases completed
      onComplete();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-left space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-lab-neon-blue/70 font-mono">
          Level 2 · Choose Your Lens
        </p>
        <h3 className="text-2xl font-semibold text-white">AR Goggles</h3>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          OLO: "Activeer je AR-bril en kies de juiste modus voor elke situatie. Normatief toetst aan normen, Feitelijk zoekt naar verbanden."
        </p>
      </div>

      {/* AR HUD Container */}
      <motion.div
        className={`relative rounded-3xl border-2 p-8 bg-gradient-to-br from-lab-surface via-[#0c141f] to-lab-surface backdrop-blur-sm transition-all duration-300 ${
          isShaking
            ? "border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            : isSuccess
            ? "border-lab-neon-green/70 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
            : "border-lab-neon-blue/30 shadow-neon"
        }`}
        animate={
          isShaking
            ? {
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 },
              }
            : isSuccess
            ? {
                scale: [1, 1.02, 1],
                transition: { duration: 0.3 },
              }
            : {}
        }
      >
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div className="flex gap-4">
            {CASES.map((caseItem) => (
              <div
                key={caseItem.id}
                className={`px-4 py-2 rounded-lg border font-mono text-sm transition-all ${
                  caseItem.id === currentCase
                    ? "border-lab-neon-blue bg-lab-neon-blue/20 text-lab-neon-blue"
                    : caseItem.id < currentCase
                    ? "border-lab-neon-green bg-lab-neon-green/10 text-lab-neon-green"
                    : "border-white/20 bg-white/5 text-slate-400"
                }`}
              >
                CASE {caseItem.id}/{CASES.length}
              </div>
            ))}
          </div>
        </div>

        {/* Situation Display */}
        <div className="mb-8 space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono mb-2">
            Situatie
          </div>
          <motion.div
            key={currentCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="text-lg text-white font-mono leading-relaxed">
              {currentCaseData.question}
            </p>
          </motion.div>
        </div>

        {/* Phase A: Answer Buttons */}
        <AnimatePresence mode="wait">
          {phase === "choice" && (
            <motion.div
              key="choice-phase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  onClick={() => handleOpticsChoice("normatief")}
                  disabled={caseCompleted}
                  className={`px-6 py-4 rounded-2xl border-2 font-mono font-semibold text-lg transition-all ${
                    caseCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  } ${
                    feedback?.type === "error" && currentCaseData.correctAnswer === "normatief"
                      ? "border-red-500/70 bg-red-500/10 text-red-400"
                      : "border-lab-neon-blue/50 bg-lab-neon-blue/10 text-lab-neon-blue hover:border-lab-neon-blue hover:bg-lab-neon-blue/20"
                  }`}
                  whileHover={!caseCompleted ? { scale: 1.02 } : {}}
                  whileTap={!caseCompleted ? { scale: 0.98 } : {}}
                >
                  [ MODUS: NORMATIEF ]
                </motion.button>

                <motion.button
                  onClick={() => handleOpticsChoice("feitelijk")}
                  disabled={caseCompleted}
                  className={`px-6 py-4 rounded-2xl border-2 font-mono font-semibold text-lg transition-all ${
                    caseCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  } ${
                    feedback?.type === "error" && currentCaseData.correctAnswer === "feitelijk"
                      ? "border-red-500/70 bg-red-500/10 text-red-400"
                      : "border-lab-neon-blue/50 bg-lab-neon-blue/10 text-lab-neon-blue hover:border-lab-neon-blue hover:bg-lab-neon-blue/20"
                  }`}
                  whileHover={!caseCompleted ? { scale: 1.02 } : {}}
                  whileTap={!caseCompleted ? { scale: 0.98 } : {}}
                >
                  [ MODUS: FEITELIJK ]
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Phase B: Evidence Tray + Active Button */}
          {phase === "evidence" && (
            <motion.div
              key="evidence-phase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Active Button (highlighted) */}
              <div className="flex justify-center">
                <motion.div
                  data-optics-button={selectedOptics}
                  className={`px-8 py-5 rounded-2xl border-2 font-mono font-semibold text-xl transition-all ${
                    attachedSource === currentCaseData.correctSource
                      ? "border-lab-neon-green bg-lab-neon-green/20 text-lab-neon-green shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                      : caseCompleted
                      ? "border-lab-neon-green/50 bg-lab-neon-green/10 text-lab-neon-green/70"
                      : "border-lab-neon-blue bg-lab-neon-blue/20 text-lab-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  }`}
                  animate={
                    caseCompleted
                      ? {}
                      : attachedSource === currentCaseData.correctSource
                      ? {
                          scale: [1, 1.05, 1],
                          transition: { duration: 0.5 },
                        }
                      : {
                          boxShadow: [
                            "0_0_15px_rgba(59,130,246,0.5)",
                            "0_0_25px_rgba(59,130,246,0.7)",
                            "0_0_15px_rgba(59,130,246,0.5)",
                          ],
                          transition: { duration: 2, repeat: Infinity },
                        }
                  }
                >
                  {attachedSource ? (
                    <div className="text-center">
                      <div>[ MODUS: {selectedOptics === "normatief" ? "NORMATIEF" : "FEITELIJK"} ]</div>
                      <div className="mt-2 text-sm font-normal text-lab-neon-green border-t border-lab-neon-green/30 pt-2">
                        {attachedSource}
                      </div>
                    </div>
                  ) : (
                    `[ MODUS: ${selectedOptics === "normatief" ? "NORMATIEF" : "FEITELIJK"} ]`
                  )}
                </motion.div>
              </div>

              {/* Evidence Tray */}
              <div className="mt-8 py-6 space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono text-center">
                  Evidence Tray
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {availableSources.map((source) => (
                    <motion.div
                      key={source}
                      ref={(el) => (dragRefs.current[source] = el)}
                      className={`h-auto min-h-[100px] flex items-center justify-center px-3 py-3 rounded-xl border-2 font-mono text-sm font-semibold text-white shadow-neon transition-all ${
                        caseCompleted
                          ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                          : shakingSource === source
                          ? "border-red-500/70 bg-red-500/10 cursor-grab active:cursor-grabbing"
                          : "border-white/20 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing"
                      }`}
                      drag={!caseCompleted}
                      dragElastic={0}
                      dragMomentum={false}
                      dragSnapToOrigin={true}
                      onDrag={(event, info) => {
                        if (caseCompleted) return;
                        lastDragPosition.current = {
                          x: event.clientX || info.point.x,
                          y: event.clientY || info.point.y,
                        };
                      }}
                      onDragEnd={(event, info) => {
                        handleDragEnd(source, info, event);
                      }}
                      animate={
                        shakingSource === source && !caseCompleted
                          ? {
                              x: [0, -5, 5, -5, 5, 0],
                              transition: { duration: 0.5 },
                            }
                          : {}
                      }
                      whileHover={!caseCompleted ? { scale: 1.05 } : {}}
                      whileTap={!caseCompleted ? { scale: 0.95 } : {}}
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-words",
                        textAlign: "center",
                      }}
                    >
                      {source}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OLO Feedback */}
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-2xl border-2 ${
                feedback.type === "success"
                  ? "border-lab-neon-green/50 bg-lab-neon-green/10 text-lab-neon-green"
                  : feedback.type === "info"
                  ? "border-lab-neon-blue/50 bg-lab-neon-blue/10 text-lab-neon-blue"
                  : "border-red-500/50 bg-red-500/10 text-red-400"
              }`}
            >
              <p className="text-sm font-mono">
                <span className="font-semibold">OLO:</span> {feedback.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {caseCompleted && feedback?.type === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex justify-center"
            >
              <motion.button
                onClick={handleNext}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-lab-neon-blue to-lab-neon-green text-gray-900 font-semibold font-mono shadow-neon hover:scale-[1.02] transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentCase < CASES.length ? "Volgende Case" : "Op naar Level 3"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

Level2.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onAddQuality: PropTypes.func,
};
