import { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const BLOCKS = [
  { id: "goal", label: "DOEL / ADVIES", position: 5 },
  { id: "analyse1", label: "ANALYSERESULTAAT 1", position: 4 },
  { id: "analyse2", label: "ANALYSERESULTAAT 2", position: 4 },
  { id: "object1", label: "ONDERZOEKSOBJECT 1", position: 3 },
  { id: "object2", label: "ONDERZOEKSOBJECT 2", position: 3 },
  { id: "optic", label: "ONDERZOEKSOPTIEK", position: 2 },
  { id: "sources", label: "BRONNEN", position: 1 },
  { id: "vooronderzoek", label: "VOORONDERZOEK", position: 1 },
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

export default function Level1({ onComplete }) {
  const [placements, setPlacements] = useState({
    1: null, // Kolom 1: Bronnen
    2: null, // Kolom 1: Vooronderzoek
    3: null, // Kolom 2: Onderzoeksoptiek (centered)
    4: null, // Kolom 3: Onderzoeksobject 1
    5: null, // Kolom 3: Onderzoeksobject 2
    6: null, // Kolom 4: Analyseresultaat 1
    7: null, // Kolom 4: Analyseresultaat 2
    8: null, // Kolom 5: Doel/Advies (centered)
  });
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [unlockedColumns, setUnlockedColumns] = useState(new Set([5])); // Start with only column 5 unlocked
  const dragRefs = useRef({});
  const containerRef = useRef(null);
  const placementsRef = useRef({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null });
  const lastDragPosition = useRef({ x: 0, y: 0 });

  // Shuffle blocks on component mount
  useEffect(() => {
    setShuffledBlocks(shuffleArray(BLOCKS));
  }, []);

  // Sync ref with state
  useEffect(() => {
    placementsRef.current = placements;
  }, [placements]);

  // Progressive unlocking logic: 5 -> 4 -> 3 -> 2 -> 1
  useEffect(() => {
    const newUnlocked = new Set([5]); // Always start with column 5
    
    if (placements[8]) { // Doel placed -> unlock column 4 (both result slots)
      newUnlocked.add(4);
    }
    if (placements[6] && placements[7]) { // Both results placed -> unlock column 3 (both object slots)
      newUnlocked.add(3);
    }
    if (placements[4] && placements[5]) { // Both objects placed -> unlock column 2 (optic)
      newUnlocked.add(2);
    }
    if (placements[3]) { // Optic placed -> unlock column 1 (sources/vooronderzoek)
      newUnlocked.add(1);
    }
    
    setUnlockedColumns(newUnlocked);
  }, [placements]);

  const availableBlocks = useMemo(() => {
    const used = new Set(Object.values(placements).filter(Boolean));
    return shuffledBlocks.filter((block) => !used.has(block.id));
  }, [placements, shuffledBlocks]);

  const resetDragPosition = (blockId) => {
    const dragElement = dragRefs.current[blockId];
    if (dragElement) {
      dragElement.style.transform = 'translate(0px, 0px)';
      dragElement.style.x = '0px';
      dragElement.style.y = '0px';
      dragElement.style.display = 'block';
      dragElement.style.visibility = 'visible';
      dragElement.style.opacity = '1';
    }
  };

  const handleDragEnd = (block, info, event) => {
    const dropX = event?.clientX ?? info.point.x ?? lastDragPosition.current.x;
    const dropY = event?.clientY ?? info.point.y ?? lastDragPosition.current.y;

    const allDropZones = document.querySelectorAll("[data-slot]");
    let zoneElement = null;
    let closestZone = null;
    let closestDistance = Infinity;

    for (const zone of allDropZones) {
      const rect = zone.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));

      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        zoneElement = zone;
        break;
      }

      if (distance < closestDistance) {
        closestDistance = distance;
        closestZone = zone;
      }
    }

    if (!zoneElement && closestZone && closestDistance < 200) {
      zoneElement = closestZone;
    }

    if (!zoneElement) {
      setFeedback("Drop je blok in een van de blauwdruk-slots.");
      resetDragPosition(block.id);
      return;
    }

    const slotNumber = parseInt(zoneElement.dataset.slot, 10);
    const currentPlacements = placementsRef.current;

    // Determine which column this slot belongs to
    let columnNumber;
    if (slotNumber === 1 || slotNumber === 2) columnNumber = 1;
    else if (slotNumber === 3) columnNumber = 2;
    else if (slotNumber === 4 || slotNumber === 5) columnNumber = 3;
    else if (slotNumber === 6 || slotNumber === 7) columnNumber = 4;
    else if (slotNumber === 8) columnNumber = 5;
    else columnNumber = null;

    // Check if column is unlocked
    if (!unlockedColumns.has(columnNumber)) {
      setFeedback("Deze kolom is nog niet beschikbaar.");
      resetDragPosition(block.id);
      return;
    }

    // Check if slot is already filled
    if (currentPlacements[slotNumber]) {
      setFeedback("Dit slot is al gevuld. Kies een ander slot.");
      resetDragPosition(block.id);
      return;
    }

    // Validation logic
    if (slotNumber === 8) {
      // Slot 8 (Column 5): Must be DOEL
      if (block.id !== "goal") {
        setFeedback("Dit blok hoort op een andere positie.");
        resetDragPosition(block.id);
        return;
      }
    } else if (slotNumber === 6 || slotNumber === 7) {
      // Slots 6 & 7 (Column 4): Must be ANALYSERESULTAAT
      if (block.id !== "analyse1" && block.id !== "analyse2") {
        setFeedback("Dit blok hoort op een andere positie.");
        resetDragPosition(block.id);
        return;
      }
      // Check if the other result slot already has the same type
      const otherResultSlot = slotNumber === 6 ? 7 : 6;
      if (currentPlacements[otherResultSlot] === block.id) {
        setFeedback("Je hebt dit blok al geplaatst. Kies het andere resultaat-slot.");
        resetDragPosition(block.id);
        return;
      }
    } else if (slotNumber === 4 || slotNumber === 5) {
      // Slots 4 & 5 (Column 3): Must be ONDERZOEKSOBJECT
      if (block.id !== "object1" && block.id !== "object2") {
        setFeedback("Dit blok hoort op een andere positie.");
        resetDragPosition(block.id);
        return;
      }
      // Check if the other object slot already has the same type
      const otherObjectSlot = slotNumber === 4 ? 5 : 4;
      if (currentPlacements[otherObjectSlot] === block.id) {
        setFeedback("Je hebt dit blok al geplaatst. Kies het andere object-slot.");
        resetDragPosition(block.id);
        return;
      }
    } else if (slotNumber === 3) {
      // Slot 3 (Column 2): Must be ONDERZOEKSOPTIEK
      if (block.id !== "optic") {
        setFeedback("Dit blok hoort op een andere positie.");
        resetDragPosition(block.id);
        return;
      }
    } else if (slotNumber === 1 || slotNumber === 2) {
      // Slots 1 & 2 (Column 1): Must be BRONNEN or VOORONDERZOEK
      if (block.id !== "sources" && block.id !== "vooronderzoek") {
        setFeedback("Dit blok hoort op een andere positie.");
        resetDragPosition(block.id);
        return;
      }
      // Check if the other left slot already has the same type
      const otherLeftSlot = slotNumber === 1 ? 2 : 1;
      if (currentPlacements[otherLeftSlot] === block.id) {
        setFeedback("Je hebt dit blok al geplaatst. Kies het andere linker slot.");
        resetDragPosition(block.id);
        return;
      }
    }

    // Hide the dragged element immediately
    const dragElement = dragRefs.current[block.id];
    if (dragElement) {
      dragElement.style.display = 'none';
      dragElement.style.visibility = 'hidden';
      dragElement.style.opacity = '0';
    }

    // Update state
    const newPlacements = {
      ...currentPlacements,
      [slotNumber]: block.id,
    };

    placementsRef.current = newPlacements;
    setPlacements(newPlacements);

    // Check completion
    const allPlaced = 
      newPlacements[1] && 
      newPlacements[2] && 
      newPlacements[3] && 
      newPlacements[4] && 
      newPlacements[5] &&
      newPlacements[6] &&
      newPlacements[7] &&
      newPlacements[8];
    
    const hasSources = newPlacements[1] === "sources" || newPlacements[2] === "sources";
    const hasVooronderzoek = newPlacements[1] === "vooronderzoek" || newPlacements[2] === "vooronderzoek";
    const hasObject1 = newPlacements[4] === "object1" || newPlacements[5] === "object1";
    const hasObject2 = newPlacements[4] === "object2" || newPlacements[5] === "object2";
    const hasAnalyse1 = newPlacements[6] === "analyse1" || newPlacements[7] === "analyse1";
    const hasAnalyse2 = newPlacements[6] === "analyse2" || newPlacements[7] === "analyse2";
    
    const isCorrectOrder = 
      newPlacements[8] === "goal" &&
      hasAnalyse1 &&
      hasAnalyse2 &&
      hasObject1 &&
      hasObject2 &&
      newPlacements[3] === "optic" &&
      hasSources &&
      hasVooronderzoek;

    if (allPlaced && isCorrectOrder) {
      setTimeout(() => {
        setCompleted(true);
      }, 300);
      setFeedback("Perfect! Alle stappen liggen op de juiste plek.");
    } else {
      setFeedback("Mooi! Plaats nu het volgende blok.");
    }
  };

  // Helper to check if there's a connection
  const hasConnection = (fromCol, toCol) => {
    // Column 5 (slot 8) -> Column 4 (slots 6 & 7)
    if (fromCol === 5 && toCol === 4) {
      return placements[8] && (placements[6] || placements[7]);
    }
    // Column 4 (slots 6 & 7) -> Column 3 (slots 4 & 5)
    if (fromCol === 4 && toCol === 3) {
      return (placements[6] || placements[7]) && (placements[4] || placements[5]);
    }
    // Column 3 (slots 4 & 5) -> Column 2 (slot 3)
    if (fromCol === 3 && toCol === 2) {
      return (placements[4] || placements[5]) && placements[3];
    }
    // Column 2 (slot 3) -> Column 1 (slots 1 & 2)
    if (fromCol === 2 && toCol === 1) {
      return placements[3] && (placements[1] || placements[2]);
    }
    return false;
  };

  // Helper to check if both slots in a column are filled
  const bothFilled = (slot1, slot2) => {
    return placements[slot1] && placements[slot2];
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="text-left space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-lab-neon-blue/70 font-mono">
          Level 1 · Reverse Engineering
        </p>
        <h3 className="text-2xl font-semibold text-white">Blueprint Room</h3>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          OLO: "De blauwdruk van het onderzoek is gewist. Reconstructeer het model door de logische stroom te herstellen. Tip: Een goed onderzoeker begint bij het einde en werkt terug naar de bron."
        </p>
      </div>

      <div className="space-y-4">
        {/* Blueprint Grid - 5 columns: Left to Right with 1-to-2 relationships */}
        <div className="grid grid-cols-5 gap-4 p-4 rounded-3xl bg-gradient-to-r from-lab-surface via-[#0c141f] to-lab-surface border border-white/5 shadow-neon relative min-h-[400px]">
          {/* Arrow connections - Right pointing arrows with splits */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead-right" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
              </marker>
            </defs>
            
            {/* Arrow from Column 1 to Column 2 (single) */}
            {hasConnection(1, 2) && (
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                x1="10%"
                y1="50%"
                x2="30%"
                y2="50%"
                stroke="#22c55e"
                strokeWidth="2"
                markerEnd="url(#arrowhead-right)"
              />
            )}
            
            {/* Arrows from Column 2 (Optiek) to Column 3 (split to 2 Objects) */}
            {hasConnection(2, 3) && (
              <>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="30%"
                  y1="50%"
                  x2="50%"
                  y2="35%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="30%"
                  y1="50%"
                  x2="50%"
                  y2="65%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
              </>
            )}
            
            {/* Arrows from Column 3 (2 Objects) to Column 4 (2 Results) */}
            {hasConnection(3, 4) && (
              <>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="50%"
                  y1="35%"
                  x2="70%"
                  y2="35%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="50%"
                  y1="65%"
                  x2="70%"
                  y2="65%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
              </>
            )}
            
            {/* Arrows from Column 4 (2 Results) to Column 5 (Doel) - converge */}
            {hasConnection(4, 5) && (
              <>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="70%"
                  y1="35%"
                  x2="90%"
                  y2="50%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  x1="70%"
                  y1="65%"
                  x2="90%"
                  y2="50%"
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-right)"
                />
              </>
            )}
          </svg>

          {/* Column 1: Bronnen + Vooronderzoek (stacked) */}
          <div className="space-y-4 col-span-1 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
              Kolom 1
            </div>
            
            {/* Slot 1 */}
            <div className="space-y-2">
              <div
                data-slot={1}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(1)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[1]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[1] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[1])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(1) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(1) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>

            {/* Slot 2 */}
            <div className="space-y-2">
              <div
                data-slot={2}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(1)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[2]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[2] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[2])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(1) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(1) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Onderzoeksoptiek (centered vertically, normal block height) */}
          <div className="col-span-1 flex flex-col justify-center items-center h-full">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center mb-4">
              Kolom 2
            </div>
            <div
              data-slot={3}
              className={`w-full min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                !unlockedColumns.has(2)
                  ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                  : placements[3]
                  ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                  : "border-white/15 bg-white/5 text-slate-400"
              }`}
            >
              {placements[3] ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold shadow-neon whitespace-normal break-words text-center text-xs leading-tight"
                >
                  {BLOCKS.find((block) => block.id === placements[3])?.label}
                </motion.div>
              ) : (
                <span className={!unlockedColumns.has(2) ? "text-slate-600" : ""}>
                  {!unlockedColumns.has(2) ? "🔒" : "Sleep"}
                </span>
              )}
            </div>
          </div>

          {/* Column 3: Onderzoeksobjecten (2 slots stacked) */}
          <div className="space-y-4 col-span-1 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
              Kolom 3
            </div>
            
            {/* Slot 4 */}
            <div className="space-y-2">
              <div
                data-slot={4}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(3)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[4]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[4] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[4])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(3) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(3) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>

            {/* Slot 5 */}
            <div className="space-y-2">
              <div
                data-slot={5}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(3)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[5]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[5] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[5])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(3) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(3) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 4: Analyseresultaten (2 slots stacked) */}
          <div className="space-y-4 col-span-1 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
              Kolom 4
            </div>
            
            {/* Slot 6 */}
            <div className="space-y-2">
              <div
                data-slot={6}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(4)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[6]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[6] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[6])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(4) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(4) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>

            {/* Slot 7 */}
            <div className="space-y-2">
              <div
                data-slot={7}
                className={`min-h-[100px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                  !unlockedColumns.has(4)
                    ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                    : placements[7]
                    ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                    : "border-white/15 bg-white/5 text-slate-400"
                }`}
              >
                {placements[7] ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold text-xs shadow-neon whitespace-normal break-words text-center leading-tight"
                  >
                    {BLOCKS.find((block) => block.id === placements[7])?.label}
                  </motion.div>
                ) : (
                  <span className={!unlockedColumns.has(4) ? "text-slate-600 text-xs" : "text-xs"}>
                    {!unlockedColumns.has(4) ? "🔒" : "Sleep"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 5: Doel/Advies (centered vertically) */}
          <div className="space-y-2 col-span-1 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
              Kolom 5
            </div>
            <div
              data-slot={8}
              className={`min-h-[220px] rounded-2xl border-2 border-dashed flex items-center justify-center px-2 font-mono transition-all ${
                !unlockedColumns.has(5)
                  ? "border-slate-700/50 bg-slate-900/30 text-slate-600 opacity-50 cursor-not-allowed"
                  : placements[8]
                  ? "border-lab-neon-green/70 bg-lab-neon-green/10"
                  : "border-white/15 bg-white/5 text-slate-400"
              }`}
            >
              {placements[8] ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 text-white font-semibold shadow-neon whitespace-normal break-words text-center text-xs leading-tight"
                >
                  {BLOCKS.find((block) => block.id === placements[8])?.label}
                </motion.div>
              ) : (
                <span className={!unlockedColumns.has(5) ? "text-slate-600" : ""}>
                  {!unlockedColumns.has(5) ? "🔒" : "Sleep"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-[48px] text-sm text-lab-neon-blue">
          {feedback}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono">
          Componenten
        </p>
        <div className="flex flex-wrap gap-4">
          {availableBlocks.map((block) => {
            const isPlaced = Object.values(placements).includes(block.id);
            
            return (
              <motion.div
                key={block.id}
                ref={(el) => (dragRefs.current[block.id] = el)}
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white cursor-grab active:cursor-grabbing shadow-neon whitespace-normal break-words text-center text-xs leading-tight"
                drag
                dragElastic={0}
                dragMomentum={false}
                dragSnapToOrigin={false}
                onDrag={(event, info) => {
                  lastDragPosition.current = {
                    x: event.clientX || info.point.x,
                    y: event.clientY || info.point.y,
                  };
                }}
                onDragEnd={(event, info) => {
                  handleDragEnd(block, info, event);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: isPlaced ? 'none' : 'block'
                }}
              >
                {block.label}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            className="mt-6 p-6 rounded-3xl border border-lab-neon-green/40 bg-lab-neon-green/10 text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <h4 className="text-xl text-lab-neon-green font-semibold">Level Complete!</h4>
            <p className="text-slate-200 text-sm">
              OLO: "Access granted. De stroom loopt weer door het onderzoeksmodel."
            </p>
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-lab-neon-blue to-lab-neon-green text-gray-900 font-semibold shadow-neon"
            >
              Op naar Level 2
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Level1.propTypes = {
  onComplete: PropTypes.func.isRequired,
};
