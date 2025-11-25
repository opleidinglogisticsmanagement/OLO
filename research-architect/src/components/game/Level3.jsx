import { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Stap 1: Items voor Optiek Construeren
const STEP1_ITEMS = [
  { id: "theorie-kpi", label: "Theorie: Warehouse KPI's", isCorrect: true, type: "theorie" },
  { id: "theorie-herzberg", label: "Theorie: Herzberg (Motivatie Medewerkers)", isCorrect: true, type: "theorie" },
  { id: "theorie-trends", label: "Theorie: Global Supply Chain Trends", isCorrect: false, type: "theorie" },
  { id: "raamwerk-dmaic", label: "Raamwerk: Lean Six Sigma (DMAIC)", isCorrect: false, type: "raamwerk" },
  { id: "interview-manager", label: "Interview: Logistiek Manager", isCorrect: true, type: "praktijk" },
  { id: "vooronderzoek", label: "Vooronderzoek", isCorrect: true, type: "praktijk" },
];

// Stap 2: Items voor Analyseren
const STEP2_ITEMS = {
  "2a": [
    { id: "criteria", label: "BEOORDELINGSCRITERIA (Picks/Uur)", isCorrect: true },
    { id: "object-current", label: "Object: Huidig Manueel Proces", isCorrect: true },
    { id: "object-concurrentie", label: "Object: Concurrentie Analyse", isCorrect: false },
    { id: "data-kantine", label: "Kantine Roosters", isCorrect: false },
  ],
  "2b": [
    { id: "criteria", label: "BEOORDELINGSCRITERIA (Picks/Uur)", isCorrect: true },
    { id: "object-pilot", label: "Object: Pilot Robotopstelling", isCorrect: true },
    { id: "object-specificaties", label: "Object: Technische Specificaties", isCorrect: false },
    { id: "object-concurrentie-2b", label: "Object: Concurrentie Analyse", isCorrect: false },
  ],
};

// Stap 3: Resultaten voor Synthese
const STEP3_ITEMS = [
  { id: "result-a", label: "RESULTAAT A: Current State (100 picks/u)", isCorrect: true },
  { id: "result-b", label: "RESULTAAT B: Future State (150 picks/u)", isCorrect: true },
  { id: "result-c", label: "RESULTAAT C: ROI Berekening (Terugverdientijd)", isCorrect: false },
  { id: "result-d", label: "RESULTAAT D: Totale Voorraadhoogte", isCorrect: false },
];

export default function Level3({ onComplete, onRestart, onAddQuality, qualityPercentage, qualityRank }) {
  const [step, setStep] = useState(1); // 1, 2a, 2b, 3
  const [mixerSlots, setMixerSlots] = useState({ 1: null }); // Start with 1 empty slot
  const [slotCount, setSlotCount] = useState(1); // Track number of slots
  const [output, setOutput] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [shuffledInventory, setShuffledInventory] = useState([]);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  
  const dragRefs = useRef({});
  const mixerSlotsRef = useRef({ 1: null });
  const lastDragPosition = useRef({ x: 0, y: 0 });

  // Sync ref with state
  useEffect(() => {
    mixerSlotsRef.current = mixerSlots;
  }, [mixerSlots]);

  // Shuffle inventory ONLY when step changes (not on every mixerSlots change)
  useEffect(() => {
    let items = [];
    if (step === 1) {
      items = STEP1_ITEMS;
    } else if (step === "2a") {
      items = STEP2_ITEMS["2a"];
    } else if (step === "2b") {
      items = STEP2_ITEMS["2b"];
    } else if (step === 3) {
      items = STEP3_ITEMS;
    }
    
    // Shuffle all items once when step changes
    const shuffled = shuffleArray(items);
    setShuffledInventory(shuffled);
  }, [step]); // Only depend on step, not mixerSlots

  // Filter inventory based on what's in mixer slots (but keep order stable)
  const currentInventory = useMemo(() => {
    const used = new Set(Object.values(mixerSlots).filter(Boolean));
    return shuffledInventory.filter((item) => !used.has(item.id));
  }, [shuffledInventory, mixerSlots]);


  // Get number of slots required for current step (for validation)
  const slotsRequired = useMemo(() => {
    if (step === 1) return 4;
    if (step === "2a" || step === "2b" || step === 3) return 2;
    return 2;
  }, [step]);

  // Add slot function
  const addSlot = () => {
    const newSlotNumber = slotCount + 1;
    setSlotCount(newSlotNumber);
    setMixerSlots((prev) => ({
      ...prev,
      [newSlotNumber]: null,
    }));
    mixerSlotsRef.current = {
      ...mixerSlotsRef.current,
      [newSlotNumber]: null,
    };
  };

  // Remove slot function
  const removeSlot = (slotNumber) => {
    if (slotCount <= 1) return; // Keep at least 1 slot
    
    const currentSlots = { ...mixerSlots };
    const itemId = currentSlots[slotNumber];
    
    // Return item to inventory if slot was filled
    if (itemId) {
      returnItemToInventory(itemId);
    }
    
    // Remove slot
    delete currentSlots[slotNumber];
    
    // Reorganize slots to be sequential (1, 2, 3...)
    const newSlots = {};
    const slotNumbers = Object.keys(currentSlots)
      .map(Number)
      .filter(num => num !== slotNumber)
      .sort((a, b) => a - b);
    
    slotNumbers.forEach((num, index) => {
      newSlots[index + 1] = currentSlots[num];
    });
    
    setMixerSlots(newSlots);
    mixerSlotsRef.current = newSlots;
    setSlotCount(slotCount - 1);
  };

  // Get evolving context text (story accumulator)
  const evolvingContext = useMemo(() => {
    if (missionComplete) {
      return "SYSTEM STATUS: ONDERZOEKSCYCLUS VOLTOOID. RAPPORT GEGENEREERD.";
    }
    
    const baseGoal = "DOELSTELLING: Scania adviseren over robot-aanschaf (A-deel) door inzicht te geven in het effect op productiviteit en medewerkerstevredenheid (B-deel).";
    
    switch (step) {
      case 1:
        return baseGoal;
      case "2a":
        return `${baseGoal}\n\nSTATUS STAP 1: Beoordelingscriteria zijn vastgesteld (Picks/Uur & Motivatie factoren).`;
      case "2b":
        return `${baseGoal}\n\nSTATUS STAP 1: Beoordelingscriteria zijn vastgesteld (Picks/Uur & Motivatie factoren).`;
      case 3:
        return `${baseGoal}\n\nSTATUS STAP 1: Beoordelingscriteria zijn vastgesteld (Picks/Uur & Motivatie factoren).\nSTATUS STAP 2: Metingen verricht. Current State (100) vs Future State (150).`;
      default:
        return baseGoal;
    }
  }, [step, missionComplete]);

  // Get instruction text for current step
  const instructionText = useMemo(() => {
    switch (step) {
      case 1:
        return "STAP 1: DE OPTIEK CONSTRUEREN | Sleep items naar de mixer om de beoordelingscriteria samen te stellen.";
      case "2a":
        return "STAP 2A: ANALYSEREN | Pas de criteria toe op het huidige proces.";
      case "2b":
        return "STAP 2B: ANALYSEREN | Pas de criteria toe op de pilot robotopstelling.";
      case 3:
        return "STAP 3: SYNTHESE | Welke resultaten bewijzen de productiviteitsstijging?";
      default:
        return "";
    }
  }, [step]);

  // Get current step number for progress bar (1, 2, or 3)
  const currentStepNumber = useMemo(() => {
    if (step === 1) return 1;
    if (step === "2a" || step === "2b") return 2;
    if (step === 3) return 3;
    return 1;
  }, [step]);

  // Handle manual advance to next step
  const handleNextStep = () => {
    setStepCompleted(false);
    setIsSuccess(false);
    setMixerSlots({ 1: null });
    mixerSlotsRef.current = { 1: null };
    setSlotCount(1);
    setOutput(null);
    setFeedback(null);

    if (step === 1) {
      setStep("2a");
    } else if (step === "2a") {
      setStep("2b");
    } else if (step === "2b") {
      setStep(3);
    } else if (step === 3) {
      setMissionComplete(true);
      onComplete();
    }
  };

  const returnItemToInventory = (itemId) => {
    const dragElement = dragRefs.current[itemId];
    if (dragElement) {
      dragElement.style.display = 'flex';
      dragElement.style.visibility = 'visible';
      dragElement.style.opacity = '1';
      dragElement.style.transform = 'translate(0px, 0px)';
      dragElement.style.x = '0px';
      dragElement.style.y = '0px';
    }
  };

  const handleDragEnd = (item, info, event) => {
    const dropX = event?.clientX ?? info.point.x ?? lastDragPosition.current.x;
    const dropY = event?.clientY ?? info.point.y ?? lastDragPosition.current.y;

    const allSlots = document.querySelectorAll("[data-mixer-slot]");
    let slotElement = null;
    let closestSlot = null;
    let closestDistance = Infinity;

    for (const slot of allSlots) {
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));

      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        slotElement = slot;
        break;
      }

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSlot = slot;
      }
    }

    if (!slotElement && closestSlot && closestDistance < 200) {
      slotElement = closestSlot;
    }

    if (!slotElement) {
      setFeedback({
        type: "error",
        message: "Sleep het item naar een van de mixer-slots.",
      });
      // Item will snap back automatically due to dragSnapToOrigin={true}
      return;
    }

    const slotNumber = parseInt(slotElement.dataset.mixerSlot, 10);
    const currentSlots = mixerSlotsRef.current;

    // Swap/Overwrite: If slot is filled, return the old item to inventory
    if (currentSlots[slotNumber]) {
      const oldItemId = currentSlots[slotNumber];
      returnItemToInventory(oldItemId);
    }

    // Hide the dragged element immediately
    const dragElement = dragRefs.current[item.id];
    if (dragElement) {
      dragElement.style.display = 'none';
      dragElement.style.visibility = 'hidden';
      dragElement.style.opacity = '0';
    }

    const newSlots = {
      ...currentSlots,
      [slotNumber]: item.id,
    };

    mixerSlotsRef.current = newSlots;
    setMixerSlots(newSlots);
    setFeedback(null);
  };

  const handleSlotClick = (slotNumber) => {
    const currentSlots = mixerSlotsRef.current;
    const itemId = currentSlots[slotNumber];
    
    if (!itemId) return;

    // Return item to inventory
    returnItemToInventory(itemId);

    // Clear the slot
    const newSlots = {
      ...currentSlots,
      [slotNumber]: null,
    };

    mixerSlotsRef.current = newSlots;
    setMixerSlots(newSlots);
    setFeedback(null);
  };

  const validateStep = () => {
    const currentSlots = mixerSlotsRef.current;
    const filledSlots = Object.values(currentSlots).filter(Boolean);
    
    if (filledSlots.length === 0) {
      return { valid: false, message: "Sleep minimaal één item naar de mixer." };
    }

    if (step === 1) {
      // Stap 1: Vereist precies 4 items (2x Theorie, 1x Interview, 1x Vooronderzoek)
      const selectedItems = filledSlots.map(id => STEP1_ITEMS.find(item => item.id === id));
      
      // Check for specific wrong items first (most specific feedback)
      const hasTrends = selectedItems.some(item => item?.id === "theorie-trends");
      const hasDMAIC = selectedItems.some(item => item?.id === "raamwerk-dmaic");
      
      if (hasTrends) {
        return { valid: false, message: "Te generiek. Macro-economische trends zeggen niets over de specifieke prestaties in dit warehouse." };
      }
      
      if (hasDMAIC) {
        return { valid: false, message: "Dit is een verbetermethodiek, geen bron voor criteria. Je zoekt theorie die zegt WAT je moet meten (KPI's), niet HOE je verbetert." };
      }

      if (filledSlots.length < slotsRequired) {
        return { valid: false, message: "Je onderzoek is nog niet compleet. Voor een solide basis heb je zowel theorie (KPI's + Motivatie) als praktijkinput (Interview + Vooronderzoek) nodig." };
      }

      const theories = selectedItems.filter(item => item?.type === "theorie" && item?.isCorrect);
      const praktijk = selectedItems.filter(item => item?.type === "praktijk" && item?.isCorrect);
      const wrongItems = selectedItems.filter(item => !item?.isCorrect);

      if (wrongItems.length > 0) {
        return { valid: false, message: `${wrongItems[0].label} hoort hier niet thuis.` };
      }

      // Check for correct items: Warehouse KPI's, Herzberg, Interview, Vooronderzoek
      const hasKPI = selectedItems.some(item => item?.id === "theorie-kpi");
      const hasHerzberg = selectedItems.some(item => item?.id === "theorie-herzberg");
      const hasInterview = selectedItems.some(item => item?.id === "interview-manager");
      const hasVooronderzoek = selectedItems.some(item => item?.id === "vooronderzoek");

      if (!hasKPI || !hasHerzberg || !hasInterview || !hasVooronderzoek) {
        return { valid: false, message: "Je hebt 2 relevante theorieën (Warehouse KPI's + Herzberg) én 2 praktijkbronnen (Interview + Vooronderzoek) nodig." };
      }

      if (theories.length !== 2 || praktijk.length !== 2) {
        return { valid: false, message: "Je hebt precies 2 theorieën én 2 praktijkbronnen nodig." };
      }

      return { valid: true };
    } else if (step === "2a") {
      // Stap 2a: Vereist precies 2 items (Criteria + Huidig Object)
      if (filledSlots.length < slotsRequired) {
        return { valid: false, message: `Je mist nog items. Je hebt ${filledSlots.length} van ${slotsRequired} items.` };
      }

      const selectedItems = filledSlots.map(id => STEP2_ITEMS["2a"].find(item => item.id === id));
      const wrongItems = selectedItems.filter(item => !item?.isCorrect);

      if (wrongItems.length > 0) {
        return { valid: false, message: `${wrongItems[0].label} hoort hier niet thuis.` };
      }

      const combination = filledSlots.sort().join('+');
      if (combination !== "criteria+object-current") {
        return { valid: false, message: "Je moet de BEOORDELINGSCRITERIA toepassen op het Huidig Manueel Proces." };
      }

      return { valid: true };
    } else if (step === "2b") {
      // Stap 2b: Vereist precies 2 items (Criteria + Robot Object)
      if (filledSlots.length < slotsRequired) {
        return { valid: false, message: `Je mist nog items. Je hebt ${filledSlots.length} van ${slotsRequired} items.` };
      }

      const selectedItems = filledSlots.map(id => STEP2_ITEMS["2b"].find(item => item.id === id));
      const hasSpecificaties = selectedItems.some(item => item?.id === "object-specificaties");
      const hasConcurrentie = selectedItems.some(item => item?.id === "object-concurrentie-2b");

      if (hasSpecificaties) {
        return { valid: false, message: "Fout. Specificaties vertellen wat de robot op papier kan. Jij moet de werkelijke prestatie in de pilot meten." };
      }

      if (hasConcurrentie) {
        return { valid: false, message: "Fout. Wat de concurrent doet zegt niets over hoe de robot in ons proces presteert." };
      }

      const combination = filledSlots.sort().join('+');
      if (combination !== "criteria+object-pilot") {
        return { valid: false, message: "Je moet de BEOORDELINGSCRITERIA toepassen op de Pilot Robotopstelling." };
      }

      return { valid: true };
    } else if (step === 3) {
      // Stap 3: Vereist precies 2 items (Resultaat A + Resultaat B)
      if (filledSlots.length < slotsRequired) {
        return { valid: false, message: `Je mist nog resultaten. Je hebt ${filledSlots.length} van ${slotsRequired} items.` };
      }

      const selectedItems = filledSlots.map(id => STEP3_ITEMS.find(item => item.id === id));
      const wrongItems = selectedItems.filter(item => !item?.isCorrect);

      if (wrongItems.length > 0) {
        const wrongItem = wrongItems[0];
        if (wrongItem.id === "result-c") {
          return { valid: false, message: "Fout. ROI gaat over geld, niet over de prestatie van de robot zelf. Blijf bij de hoofdvraag: werkt het sneller?" };
        } else if (wrongItem.id === "result-d") {
          return { valid: false, message: "Fout. De voorraadhoogte verandert niet door de snelheid van picken. Zoek de prestatiemetingen." };
        }
        return { valid: false, message: `${wrongItem.label} hoort hier niet thuis.` };
      }

      const combination = filledSlots.sort().join('+');
      if (combination !== "result-a+result-b") {
        return { valid: false, message: "Je moet beide prestatiemetingen (Current State en Future State) selecteren om de conclusie te kunnen trekken." };
      }

      return { valid: true };
    }

    return { valid: false, message: "Onbekende stap." };
  };

  const handleMix = () => {
    const validation = validateStep();

    if (!validation.valid) {
      setIsShaking(true);
      setFeedback({
        type: "error",
        message: validation.message,
      });
    // Stap 3 fout: verkeerd advies -> -10 punten
    if (step === 3 && onAddQuality) {
      onAddQuality(-10);
    }
      setTimeout(() => {
        setIsShaking(false);
        // DO NOT reset slots - let player correct their mistake
        // Items stay in slots so player can remove wrong ones and add correct ones
      }, 1500);
      return;
    }

    setIsMixing(true);
    const currentSlots = mixerSlotsRef.current;
    const filledSlots = Object.values(currentSlots).filter(Boolean);

    setTimeout(() => {
      setIsMixing(false);

      if (step === 1) {
        setIsSuccess(true);
        setOutput("BEOORDELINGSCRITERIA (Picks/Uur)");
        setFeedback({
          type: "success",
          message: "Correct! Je hebt een solide fundering gelegd voor je meetlat (Optiek):\n\n• Theorie (KPI's): Geeft standaard meetwaarden zoals Picks/Uur en Foutpercentage.\n\n• Theorie (Herzberg - Motivatie Medewerkers): Zorgt dat je ook 'zachte' criteria zoals werkplezier en motivatie meetbaar maakt.\n\n• Vooronderzoek: Door je gesprekken op de werkvloer, deskresearch en het leren kennen van de organisatie, weet je wat de context is.\n\n• Interview: De manager bevestigt wat strategisch belangrijk is. Samen zorgt dit dat je criteria perfect passen bij Scania.",
        });
        setStepCompleted(true);
        // Stap 1 voltooid: +10 punten
        if (onAddQuality) {
          onAddQuality(10);
        }
      } else if (step === "2a") {
        setIsSuccess(true);
        setOutput("RESULTAAT A: Current State (100 picks/u)");
        setFeedback({
          type: "success",
          message: "Correct! Je hebt de nulmeting bepaald: 100 picks per uur.",
        });
        setStepCompleted(true);
      } else if (step === "2b") {
        setIsSuccess(true);
        setOutput("RESULTAAT B: Future State (150 picks/u)");
        setFeedback({
          type: "success",
          message: "Correct! Je hebt de pilot-meting bepaald: 150 picks per uur.",
        });
        setStepCompleted(true);
        // Stap 2 voltooid (na afronden 2b): +10 punten
        if (onAddQuality) {
          onAddQuality(10);
        }
      } else if (step === 3) {
        setIsSuccess(true);
        setOutput("CONCLUSIE: Productiviteit +50%");
        setFeedback({
          type: "success",
          message: "Gefeliciteerd! Je hebt het B-deel (inzicht in productiviteit) geleverd. Hiermee kan het A-deel (Advies aan Scania: Aanschaffen!) worden ingevuld. Doelstelling behaald!",
        });
        setStepCompleted(true);
        // Stap 3 (advies) correct: +20 punten
        if (onAddQuality) {
          onAddQuality(20);
        }
      }
    }, 1500);
  };

  const filledSlotsCount = useMemo(() => {
    const currentSlots = mixerSlotsRef.current;
    return Object.values(currentSlots).filter(Boolean).length;
  }, [mixerSlots]);

  const canStartMix = filledSlotsCount > 0;

  // Get items to display in slots
  const getItemLabel = (itemId) => {
    if (step === 1) {
      return STEP1_ITEMS.find(item => item.id === itemId)?.label;
    } else if (step === "2a") {
      return STEP2_ITEMS["2a"].find(item => item.id === itemId)?.label;
    } else if (step === "2b") {
      return STEP2_ITEMS["2b"].find(item => item.id === itemId)?.label;
    } else if (step === 3) {
      return STEP3_ITEMS.find(item => item.id === itemId)?.label;
    }
    return "";
  };

  // Reset slots when step changes
  useEffect(() => {
    setMixerSlots({ 1: null });
    mixerSlotsRef.current = { 1: null };
    setSlotCount(1);
    setStepCompleted(false);
  }, [step]);

  return (
    <div className="space-y-8">
      {!missionComplete && (
      <div className="text-left space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-lab-neon-blue/70 font-mono">
          Level 3 · The Research Cycle
        </p>
        <h3 className="text-2xl font-semibold text-white">Research Cycle Lab</h3>
      </div>
      )}

      {/* Progress Bar */}
      {!missionComplete && (
      <div className="flex items-center justify-center gap-4 py-6">
        {/* Step 1 */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-semibold text-sm transition-all ${
                currentStepNumber >= 1
                  ? "border-lab-neon-green bg-lab-neon-green/20 text-lab-neon-green shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : "border-slate-600 bg-slate-800/50 text-slate-500"
              }`}
            >
              1
            </div>
            <div className={`text-xs font-mono ${currentStepNumber >= 1 ? "text-lab-neon-green" : "text-slate-500"}`}>
              OPTIEK
            </div>
          </div>
          <div
            className={`h-0.5 w-16 transition-all ${
              currentStepNumber >= 2 ? "bg-lab-neon-green" : "bg-slate-700"
            }`}
          />
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-semibold text-sm transition-all ${
                currentStepNumber >= 2
                  ? "border-lab-neon-green bg-lab-neon-green/20 text-lab-neon-green shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : "border-slate-600 bg-slate-800/50 text-slate-500"
              }`}
            >
              2
            </div>
            <div className={`text-xs font-mono ${currentStepNumber >= 2 ? "text-lab-neon-green" : "text-slate-500"}`}>
              ANALYSE
            </div>
          </div>
          <div
            className={`h-0.5 w-16 transition-all ${
              currentStepNumber >= 3 ? "bg-lab-neon-green" : "bg-slate-700"
            }`}
          />
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-semibold text-sm transition-all ${
              currentStepNumber >= 3
                ? "border-lab-neon-green bg-lab-neon-green/20 text-lab-neon-green shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                : "border-slate-600 bg-slate-800/50 text-slate-500"
            }`}
          >
            3
          </div>
          <div className={`text-xs font-mono ${currentStepNumber >= 3 ? "text-lab-neon-green" : "text-slate-500"}`}>
            CONCLUSIE
          </div>
        </div>
      </div>
      )}

      {/* Evolving Context Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-lab-surface via-[#0c141f] to-lab-surface border border-lab-neon-green/30 backdrop-blur-sm">
        <div className="text-xs uppercase tracking-[0.3em] text-lab-neon-green/70 font-mono mb-3">
          CONTEXT
        </div>
        <p className="text-white font-mono text-sm leading-relaxed whitespace-pre-line">
          {evolvingContext}
        </p>
      </div>

      {/* Instruction Terminal */}
      {!missionComplete && (
        <div className="p-4 rounded-2xl bg-black/50 border border-lab-neon-green/30 font-mono text-sm">
          <div className="text-white">{instructionText}</div>
        </div>
      )}

      {/* Main Game Area */}
      {!missionComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory (Left) */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono text-center">
            Inventory
          </div>
          <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 min-h-[300px]">
            {currentInventory.length === 0 ? (
              <div className="text-xs text-slate-500 font-mono text-center py-8">
                Alle items gebruikt
              </div>
            ) : (
              currentInventory.map((item) => (
                <motion.div
                  key={item.id}
                  ref={(el) => (dragRefs.current[item.id] = el)}
                  className="h-auto min-h-[80px] flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white cursor-grab active:cursor-grabbing shadow-neon whitespace-normal break-words text-center"
                  drag
                  dragElastic={0}
                  dragMomentum={false}
                  dragSnapToOrigin={true}
                  layoutId={undefined}
                  onDrag={(event, info) => {
                    lastDragPosition.current = {
                      x: event.clientX || info.point.x,
                      y: event.clientY || info.point.y,
                    };
                  }}
                  onDragEnd={(event, info) => {
                    handleDragEnd(item, info, event);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    visibility: 'visible',
                    opacity: 1,
                  }}
                >
                  {item.label}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Mixer (Center) - Vertical Stack */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono text-center">
            Mixer
          </div>
          <motion.div
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              isShaking
                ? "border-red-500/70 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                : isSuccess
                ? "border-lab-neon-green/70 bg-lab-neon-green/10 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                : "border-lab-neon-blue/30 bg-white/5 shadow-neon"
            }`}
            animate={
              isShaking
                ? {
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }
                : isSuccess
                ? {
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.5 },
                  }
                : {}
            }
          >
            {/* Vertical Stack of Slots */}
            <div className="space-y-3 mb-4">
              {Array.from({ length: slotCount }, (_, i) => i + 1).map((slotNum) => (
                <div key={slotNum} className="relative">
                  {slotNum > 1 && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-lab-neon-blue/30" />
                  )}
                  <div
                    data-mixer-slot={slotNum}
                    onClick={() => handleSlotClick(slotNum)}
                    className={`min-h-[100px] rounded-xl border-2 border-dashed flex items-center justify-center p-4 transition-all relative ${
                      mixerSlots[slotNum]
                        ? "border-lab-neon-green/70 bg-lab-neon-green/10 cursor-pointer hover:bg-lab-neon-green/20"
                        : "border-white/20 bg-white/5"
                    }`}
                    title={mixerSlots[slotNum] ? "Klik om item te verwijderen" : ""}
                  >
                    {/* Remove slot button (X) */}
                    {slotCount > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSlot(slotNum);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 flex items-center justify-center text-xs font-mono transition-all"
                        title="Verwijder slot"
                      >
                        ×
                      </button>
                    )}
                    {mixerSlots[slotNum] ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full text-center pr-6"
                      >
                        <div className="text-xs text-slate-500 font-mono mb-1">Slot {slotNum}</div>
                        <div className="font-mono font-semibold text-lab-neon-green text-xs whitespace-normal break-words">
                          {getItemLabel(mixerSlots[slotNum])}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs text-slate-500 font-mono">Slot {slotNum}</div>
                        <div className="text-xs text-slate-400 mt-1">Leeg</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Slot Button */}
            {!stepCompleted && (
              <motion.button
                onClick={addSlot}
                disabled={slotCount >= 6} // Max 6 slots
                className={`w-full py-2 rounded-xl border-2 font-mono text-sm font-semibold transition-all mb-4 ${
                  slotCount >= 6
                    ? "border-white/20 bg-white/5 text-slate-500 cursor-not-allowed opacity-50"
                    : "border-lab-neon-blue/50 bg-lab-neon-blue/10 text-lab-neon-blue hover:bg-lab-neon-blue/20 cursor-pointer"
                }`}
                whileHover={slotCount < 6 ? { scale: 1.02 } : {}}
                whileTap={slotCount < 6 ? { scale: 0.98 } : {}}
              >
                + Voeg Bron Toe
              </motion.button>
            )}

            {/* Mix Button */}
            <motion.button
              onClick={handleMix}
              disabled={!canStartMix || isMixing || isSuccess || stepCompleted}
              className={`w-full py-3 rounded-xl border-2 font-mono font-semibold transition-all ${
                canStartMix && !isMixing && !isSuccess && !stepCompleted
                  ? "border-lab-neon-blue bg-lab-neon-blue/20 text-lab-neon-blue hover:bg-lab-neon-blue/30 cursor-pointer"
                  : "border-white/20 bg-white/5 text-slate-500 cursor-not-allowed opacity-50"
              }`}
              whileHover={canStartMix && !isMixing && !isSuccess && !stepCompleted ? { scale: 1.02 } : {}}
              whileTap={canStartMix && !isMixing && !isSuccess && !stepCompleted ? { scale: 0.98 } : {}}
            >
              {isMixing ? "MIXING..." : stepCompleted ? "STAP VOLTOOID" : "START CONFRONTATIE"}
            </motion.button>

            {/* Smoke effect on fail */}
            <AnimatePresence>
              {isShaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Output Zone (Right) */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-mono text-center">
            Output
          </div>
          <div className="min-h-[300px] p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center w-full"
                >
                  <div className="px-6 py-4 rounded-xl bg-gradient-to-r from-lab-neon-green/30 to-lab-neon-blue/20 border border-lab-neon-green/50 w-full">
                    <div className="font-mono font-semibold text-lab-neon-green text-sm whitespace-normal break-words text-center">
                      {output}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-slate-500 font-mono text-center"
                >
                  Wacht op output...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      )}

      {/* Next Step Button - Outside Output Box, Centered Below Mixer */}
      {!missionComplete && (
      <AnimatePresence>
        {stepCompleted && output && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mt-6"
          >
            <motion.button
              onClick={handleNextStep}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-lab-neon-blue to-lab-neon-green text-gray-900 font-semibold font-mono shadow-neon hover:scale-[1.02] transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step === 3 ? "MISSION COMPLETE >" : "DOORGAAN NAAR VOLGENDE STAP >"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      )}

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedback && !missionComplete && (
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
            <p className="text-sm font-mono whitespace-pre-line break-words">
              <span className="font-semibold">OLO:</span> {feedback.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Research Report - Final Screen */}
      <AnimatePresence>
        {missionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-8 rounded-3xl border-2 border-lab-neon-green/50 bg-gradient-to-br from-lab-surface via-[#0c141f] to-lab-surface backdrop-blur-sm"
          >
            <div className="space-y-6">
              {/* Report Header */}
              <div className="text-center border-b border-lab-neon-green/30 pb-4">
                <h4 className="text-2xl font-mono font-semibold text-lab-neon-green mb-2">
                  MISSION REPORT: SCANIA ROBOTICS
                </h4>
                <div className="text-xs text-slate-400 font-mono">
                  ONDERZOEKSCYCLUS VOLTOOID
                </div>
              </div>

              {/* Report Content */}
              <div className="space-y-4 font-mono text-sm text-white">
                {/* Research Quality Index & Rank */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="text-lab-neon-green/70 mb-1">RESEARCH QUALITY INDEX (RQI):</div>
                    <div className="text-slate-200 pl-4">
                      {typeof qualityPercentage === "number" ? `${qualityPercentage}%` : "n.v.t."}
                    </div>
                  </div>
                  <div>
                    <div className="text-lab-neon-green/70 mb-1">RANK:</div>
                    <div className="text-slate-200 pl-4">
                      {qualityRank || "Onbekend"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-lab-neon-green/70 mb-1">DOELSTELLING:</div>
                  <div className="text-slate-200 pl-4">
                    Advies geven over productiviteitsverhoging (A) door inzet van robots (B).
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lab-neon-green text-lg">✓</span>
                    <div className="flex-1">
                      <div className="text-lab-neon-green/70 mb-1">STAP 1 (OPTIEK):</div>
                      <div className="text-slate-200 pl-4">
                        Criteria vastgesteld o.b.v. Warehouse KPI's & Herzberg.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lab-neon-green text-lg">✓</span>
                    <div className="flex-1">
                      <div className="text-lab-neon-green/70 mb-1">STAP 2 (ANALYSE):</div>
                      <div className="text-slate-200 pl-4">
                        Meting verricht. Current (100) vs Future (150).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lab-neon-green text-lg">✓</span>
                    <div className="flex-1">
                      <div className="text-lab-neon-green/70 mb-1">STAP 3 (CONCLUSIE):</div>
                      <div className="text-slate-200 pl-4">
                        Productiviteit stijgt met 50%.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-lab-neon-green/30 pt-4 mt-6">
                  <div className="text-lab-neon-green/70 mb-1">ADVIES:</div>
                  <div className="text-lab-neon-green font-semibold pl-4">
                    Positief. Implementatie aanbevolen.
                  </div>
                </div>
              </div>

              {/* Restart Button */}
              <div className="flex justify-center pt-6 border-t border-white/10">
                <motion.button
                  onClick={onRestart}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-lab-neon-blue to-lab-neon-green text-gray-900 font-semibold font-mono shadow-neon hover:scale-[1.02] transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  OPNIEUW STARTEN
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Level3.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onRestart: PropTypes.func,
  onAddQuality: PropTypes.func,
  qualityPercentage: PropTypes.number,
  qualityRank: PropTypes.string,
};
