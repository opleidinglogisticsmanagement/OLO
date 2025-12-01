/**
 * Server-side Proxy voor Google Gemini API
 * 
 * Deze server handelt Gemini API calls af om CORS-problemen te voorkomen
 * en API keys veilig te beheren.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// 1. Security headers met Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://media.windesheim.nl", "https://sts.windesheim.nl"]
        }
    },
    crossOriginEmbedderPolicy: false // Voor externe CDN's
}));

// 2. CORS beperken tot specifieke origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5500'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl, or same-origin requests)
        if (!origin) return callback(null, true);
        
        // On Vercel, allow requests from vercel.app domains (for production and preview deployments)
        if (process.env.VERCEL) {
            // Allow all vercel.app domains (includes production and preview deployments)
            if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
                return callback(null, true);
            }
            // Allow the specific Vercel deployment URL if set
            if (process.env.VERCEL_URL) {
                const vercelUrl = `https://${process.env.VERCEL_URL}`;
                if (origin === vercelUrl) {
                    return callback(null, true);
                }
            }
        }
        
        // Check against allowed origins list (for local development)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`[Security] CORS blocked origin: ${origin}`);
            callback(new Error('Deze origin is niet toegestaan'));
        }
    },
    credentials: true
}));

// 3. Request size limits (prevent DoS)
app.use(express.json({ limit: '1mb' })); // Max 1MB voor JSON bodies
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Rate limiting voor API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuten
    max: 100, // Max 100 requests per IP per window
    message: {
        error: 'Rate limit exceeded',
        message: 'Te veel requests van dit IP-adres, probeer het later opnieuw.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// API Key validation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Optionele specifieke key voor bouwsteenmethode
const GEMINI_BOUWSTEEN_API_KEY = process.env.GEMINI_BOUWSTEEN_API_KEY || GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('⚠️  WARNING: GEMINI_API_KEY is not set in .env file');
    console.error('   Please create a .env file with: GEMINI_API_KEY=your_api_key_here');
}

// Cache voor beschikbare Gemini modellen
let cachedAvailableModels = [];
let modelCacheTimestamp = null;
const MODEL_CACHE_TTL = 60 * 60 * 1000; // 1 uur cache

/**
 * Haal beschikbare Gemini modellen op en cache ze
 * @returns {Promise<Array>} Array van beschikbare model namen
 */
async function fetchAndCacheAvailableModels() {
    if (!GEMINI_API_KEY) {
        console.warn('[Gemini Proxy] No API key, cannot fetch models');
        return [];
    }

    try {
        const fetch = globalThis.fetch || require('node-fetch');
        const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        console.log('[Gemini Proxy] Fetching available models (cache miss)...');
        
        const listResponse = await fetch(listModelsUrl);
        if (listResponse.ok) {
            const modelsData = await listResponse.json();
            const models = modelsData.models
                ?.filter(m => {
                    // Only include models that support generateContent
                    if (!m.supportedGenerationMethods?.includes('generateContent')) {
                        return false;
                    }
                    // Exclude image-specific models (they have -image suffix or contain 'image' in name)
                    if (m.name.includes('-image') || m.name.includes('image')) {
                        return false;
                    }
                    // Exclude embedding models
                    if (m.name.includes('embedding') || m.name.includes('embed')) {
                        return false;
                    }
                    return true;
                })
                ?.map(m => m.name.replace('models/', '')) || [];
            
            // Sort models: flash first (fastest), then pro, then others
            const sorted = models.sort((a, b) => {
                if (a.includes('flash')) return -1;
                if (b.includes('flash')) return 1;
                if (a.includes('pro') && !b.includes('pro')) return -1;
                if (b.includes('pro') && !a.includes('pro')) return 1;
                return 0;
            });
            
            cachedAvailableModels = sorted;
            modelCacheTimestamp = Date.now();
            
            console.log(`[Gemini Proxy] ✅ Cached ${sorted.length} available models with generateContent (text-only)`);
            console.log('[Gemini Proxy] Available models (sorted, flash first):', sorted.slice(0, 5));
            
            return sorted;
        } else {
            console.warn('[Gemini Proxy] Could not list models, using defaults');
            return [];
        }
    } catch (listError) {
        console.warn('[Gemini Proxy] Could not list models:', listError.message);
        return [];
    }
}

/**
 * Get cached available models, or fetch if cache is empty/expired
 * Returns models sorted by speed preference (flash first)
 * @returns {Promise<Array>} Array van beschikbare model namen (flash first)
 */
async function getAvailableModels() {
    // Check if cache is valid
    const now = Date.now();
    if (cachedAvailableModels.length > 0 && modelCacheTimestamp && (now - modelCacheTimestamp) < MODEL_CACHE_TTL) {
        console.log(`[Gemini Proxy] Using cached models (${cachedAvailableModels.length} models)`);
        
        // Sort models: flash first (fastest), then pro, then others
        const sorted = [...cachedAvailableModels].sort((a, b) => {
            if (a.includes('flash')) return -1;
            if (b.includes('flash')) return 1;
            if (a.includes('pro') && !b.includes('pro')) return -1;
            if (b.includes('pro') && !a.includes('pro')) return 1;
            return 0;
        });
        
        return sorted;
    }
    
    // Cache is empty or expired, fetch new
    return await fetchAndCacheAvailableModels();
}

/**
 * Input validatie middleware voor generate-questions
 */
const validateGenerateQuestions = [
    body('theoryContent')
        .isString()
        .trim()
        .isLength({ min: 10, max: 10000 })
        .withMessage('theoryContent must be between 10 and 10000 characters'),
    body('numberOfQuestions')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('numberOfQuestions must be between 1 and 10'),
    body('segmentIndex')
        .optional()
        .isInt({ min: 0 })
        .withMessage('segmentIndex must be a non-negative integer')
];

/**
 * Proxy endpoint voor Gemini API generateContent
 * POST /api/generate-questions
 * Body: { theoryContent: string, numberOfQuestions: number }
 */
app.post('/api/generate-questions', validateGenerateQuestions, async (req, res) => {
    try {
        // Check voor validatie errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Invalid input', 
                message: 'Input validation failed',
                errors: errors.array()
            });
        }

        // Check if API key is set
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'GEMINI_API_KEY is not set in server environment'
            });
        }

        // Get request body (already validated and sanitized)
        const { theoryContent, numberOfQuestions = 3, segmentIndex = 0 } = req.body;

        // Bloom's taxonomie niveaus voor variatie in vraagtypen
        const bloomLevels = ['kennen', 'begrijpen', 'analyseren', 'evalueren'];
        // Willekeurig selecteren van een Bloom niveau voor deze vraag
        const randomBloomLevel = bloomLevels[Math.floor(Math.random() * bloomLevels.length)];
        
        // Build prompt for Gemini
        // Use segment-based approach for variety (no hardcoded topics)
        const segmentInfo = segmentIndex !== undefined ? ` (Dit is segment ${segmentIndex + 1} van de theorie tekst)` : '';
        
        const bloomInstructions = {
            'kennen': 'Test kennis van feiten, begrippen en definities. Vraag naar wat de student weet of kan herkennen.',
            'begrijpen': 'Test begrip van concepten en relaties. Vraag naar uitleg, interpretatie of samenvatting van informatie.',
            'analyseren': 'Test analytisch vermogen. Vraag naar het onderscheiden van onderdelen, het identificeren van patronen, oorzaken of gevolgen.',
            'evalueren': 'Test beoordelingsvermogen. Vraag naar het beoordelen, vergelijken, of het maken van keuzes op basis van criteria.'
        };
        
        const prompt = `Genereer ${numberOfQuestions} multiple choice vraag${numberOfQuestions > 1 ? 'en' : ''} in het Nederlands op basis van de volgende theorie tekst.${segmentInfo}

BELANGRIJK: 
- Zorg ervoor dat de vraag over een specifiek aspect/concept uit DEZE DEEL van de theorie gaat.
- Gebruik informatie uit dit specifieke deel van de theorie tekst voor je vraag.
- Als je meerdere vragen genereert, zorg dat ze over verschillende aspecten/concepten uit dit deel gaan.
- Varieer in vraagtype: gebruik willekeurig verschillende cognitieve niveaus (kennen, begrijpen, analyseren, evalueren).

BLOOM'S TAXONOMIE:
Voor deze vraag gebruik je het niveau: **${randomBloomLevel}**
${bloomInstructions[randomBloomLevel]}

Elke vraag moet:
- Een duidelijke vraag bevatten over een specifiek aspect/concept uit deze deel van de theorie
- Het juiste cognitieve niveau gebruiken (${randomBloomLevel})
- 4 antwoordopties hebben (a, b, c, d)
- Een correct antwoord hebben (aangegeven met "correct": true)
- Feedback bevatten bij het juiste antwoord (feedbackGoed)
- Feedback bevatten bij een fout antwoord (feedbackFout)

Geef het antwoord terug in JSON format met deze structuur:
{
  "vragen": [
    {
      "id": "vraag1",
      "vraag": "Hier komt de vraag",
      "antwoorden": [
        { "id": "a", "tekst": "Antwoord optie A", "correct": false },
        { "id": "b", "tekst": "Antwoord optie B", "correct": true },
        { "id": "c", "tekst": "Antwoord optie C", "correct": false },
        { "id": "d", "tekst": "Antwoord optie D", "correct": false }
      ],
      "feedbackGoed": "Uitleg waarom dit antwoord correct is",
      "feedbackFout": "Uitleg waarom andere antwoorden niet correct zijn"
    }
  ]
}

Theorie tekst:
${theoryContent.substring(0, 8000)}`; // Limit to 8000 chars

        // Use Google Generative AI SDK
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        // OPTIE 3: Use fastest model from cache (gemini-1.5-flash preferred)
        // Get cached available models (sorted with flash first)
        let availableModels = await getAvailableModels();
        
        // Filter out preview/experimental models that might not be stable
        // But keep stable models like gemini-1.5-flash, gemini-flash-latest, etc.
        const stableModels = availableModels.filter(m => {
            // Exclude preview models (but allow -latest models)
            if (m.includes('-preview-') || m.includes('-experimental-')) {
                return false;
            }
            // Exclude specific problematic preview models
            if (m.includes('lite-preview') || m.includes('2.5-flash-lite-preview')) {
                return false;
            }
            // Prefer models with known stable names
            if (m.includes('1.5-flash') || m.includes('1.5-pro') || m.includes('-latest') || m.includes('gemini-pro')) {
                return true;
            }
            // Allow other models that don't have preview in the name
            return !m.includes('preview') && !m.includes('experimental');
        });
        
        // If no stable models in cache, try fallback models first
        // Only fetch fresh if we really have no options
        let models;
        if (stableModels.length > 0) {
            models = stableModels.slice(0, 3); // Use first 3 stable models (flash will be first)
        } else if (availableModels.length > 0) {
            // If no stable models but we have some models, try them anyway
            // Filter out only the most problematic ones
            const filteredModels = availableModels.filter(m => 
                !m.includes('-preview-') && 
                !m.includes('lite-preview')
            );
            models = filteredModels.length > 0 
                ? filteredModels.slice(0, 3)
                : availableModels.slice(0, 3); // Last resort: try any model
        } else {
            // No models in cache at all, use known working models
            models = [
                'gemini-1.5-flash',  // Fastest model - try first
                'gemini-1.5-pro',    // Fallback if flash fails
                'gemini-pro'          // Last resort
            ];
        }
        
        console.log(`[Gemini Proxy] Will try models in order:`, models);
        
        let responseText;
        let lastError;
        let modelCacheInvalid = false;
        
        for (const modelName of models) {
            try {
                console.log(`[Gemini Proxy] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseText = response.text();
                console.log(`[Gemini Proxy] ✅ Success with model: ${modelName}`);
                console.log(`[Gemini Proxy] Response length: ${responseText.length} characters`);
                break;
            } catch (error) {
                const errorMsg = error.message || error.toString();
                console.error(`[Gemini Proxy] ❌ Model ${modelName} failed:`, errorMsg);
                
                // If model not found (404), mark cache as potentially invalid
                if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('not supported')) {
                    console.warn(`[Gemini Proxy] Model ${modelName} not found - cache may be invalid`);
                    modelCacheInvalid = true;
                }
                
                lastError = {
                    model: modelName,
                    message: errorMsg,
                    error: error
                };
            }
        }
        
        // If all models failed and cache might be invalid, clear cache and retry with fresh fetch
        if (!responseText && modelCacheInvalid) {
            console.log('[Gemini Proxy] Cache appears invalid, clearing and fetching fresh models...');
            cachedAvailableModels = [];
            modelCacheTimestamp = null;
            const freshModels = await fetchAndCacheAvailableModels();
            
            // Try known working models first
            const knownWorkingModels = [
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-pro'
            ];
            
            // Also try fresh models that look stable
            const freshStableModels = freshModels.filter(m => {
                if (m.includes('1.5-flash') || m.includes('1.5-pro') || m.includes('-latest')) {
                    return true;
                }
                return !m.includes('-preview-') && !m.includes('lite-preview');
            });
            
            // Combine known working with fresh stable models
            const retryModels = [...knownWorkingModels, ...freshStableModels.slice(0, 3)];
            
            console.log(`[Gemini Proxy] Retrying with models:`, retryModels);
            for (const modelName of retryModels) {
                try {
                    console.log(`[Gemini Proxy] Retrying with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    responseText = response.text();
                    console.log(`[Gemini Proxy] ✅ Success with model: ${modelName}`);
                    break;
                } catch (retryError) {
                    console.error(`[Gemini Proxy] ❌ Model ${modelName} also failed:`, retryError.message);
                }
            }
        }
        
        if (!responseText) {
            console.error('[Gemini Proxy] All models failed');
            return res.status(502).json({
                error: 'All Gemini models failed',
                message: lastError?.message || 'Could not generate content',
                details: lastError
            });
        }
        console.log('[Gemini Proxy] Received response text length:', responseText?.length || 0);

        // Parse JSON from response (Gemini might wrap it in markdown code blocks)
        let jsonText = responseText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/m, '').replace(/\s*```$/m, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*/m, '').replace(/\s*```$/m, '');
        }

        // Try to find JSON object in response if not at start
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonText = jsonMatch[0];
        }

        // Parse JSON
        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('[Gemini Proxy] JSON parse error:', parseError);
            console.error('[Gemini Proxy] Text to parse:', jsonText.substring(0, 1000));
            return res.status(502).json({
                error: 'Failed to parse Gemini response',
                message: 'Response is not valid JSON',
                parseError: parseError.message,
                responseText: jsonText.substring(0, 500)
            });
        }

        // Validate response structure
        if (!parsed.vragen || !Array.isArray(parsed.vragen) || parsed.vragen.length === 0) {
            console.error('[Gemini Proxy] Invalid questions structure:', parsed);
            return res.status(502).json({
                error: 'Invalid questions structure',
                message: 'Response does not contain valid vragen array',
                response: parsed
            });
        }

        // Add IDs if missing
        const questions = parsed.vragen.map((vraag, index) => ({
            id: vraag.id || `vraag${index + 1}`,
            vraag: vraag.vraag || `Vraag ${index + 1}`,
            antwoorden: (vraag.antwoorden || []).map((antwoord, answerIndex) => ({
                id: antwoord.id || String.fromCharCode(97 + answerIndex), // a, b, c, d
                tekst: antwoord.tekst || `Antwoord ${answerIndex + 1}`,
                correct: antwoord.correct === true
            })),
            feedbackGoed: vraag.feedbackGoed || 'Goed gedaan! Dit is het juiste antwoord.',
            feedbackFout: vraag.feedbackFout || 'Niet helemaal juist. Bekijk de theorie nog eens.'
        }));

        console.log(`[Gemini Proxy] Successfully generated ${questions.length} questions`);

        // Return questions
        return res.json({
            success: true,
            vragen: questions
        });

    } catch (error) {
        console.error('[Gemini Proxy] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * Input validatie middleware voor generate-query-scenario
 */
const validateGenerateQueryScenario = [
    body('theoryContent')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('theoryContent must be max 5000 characters'),
    body('availableTerms')
        .isArray({ min: 1 })
        .withMessage('availableTerms must be a non-empty array'),
    body('availableTerms.*')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 }),
    body('scenarioCount')
        .optional()
        .isInt({ min: 0, max: 10 })
        .withMessage('scenarioCount must be between 0 and 10')
];

/**
 * Generate a new query scenario based on theory
 * POST /api/generate-query-scenario
 */
app.post('/api/generate-query-scenario', validateGenerateQueryScenario, async (req, res) => {
    try {
        // Check voor validatie errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Invalid input', 
                message: 'Input validation failed',
                errors: errors.array()
            });
        }

        const { theoryContent, availableTerms } = req.body;

        console.log('[generate-query-scenario] Received request');
        console.log('[generate-query-scenario] theoryContent length:', theoryContent?.length || 0);
        console.log('[generate-query-scenario] availableTerms:', availableTerms);

        if (!availableTerms || !Array.isArray(availableTerms) || availableTerms.length === 0) {
            console.error('[generate-query-scenario] Missing or invalid availableTerms');
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'availableTerms is required and must be a non-empty array'
            });
        }

        // If theory content is empty or too short, use a default prompt about Boolean operators
        const actualTheoryContent = theoryContent.trim().length > 0 
            ? theoryContent 
            : `Booleaanse operatoren zijn logische operatoren die gebruikt worden in zoekmachines om zoektermen te combineren:
- AND: Beide termen moeten voorkomen in de resultaten
- OR: Minstens één van de termen moet voorkomen
- NOT: De term mag niet voorkomen in de resultaten
- Haakjes: Gebruikt om de volgorde van operaties te bepalen, bijvoorbeeld (term1 OR term2) AND term3`;

        if (actualTheoryContent !== theoryContent) {
            console.warn('[generate-query-scenario] Using default theory content as fallback');
        }

        if (!GEMINI_API_KEY) {
            console.error('[generate-query-scenario] API key not configured');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'GEMINI_API_KEY is not set in environment variables'
            });
        }

        // Determine difficulty based on scenario count (progressive difficulty)
        // MAXIMUM 4 TERMS TOTAL across all scenarios
        const scenarioCount = parseInt(req.body.scenarioCount || '0');
        let difficultyLevel = 'easy';
        let difficultyInstructions = '';
        let maxTerms = 2;
        
        // Select a random subset of available terms for this scenario (4-6 terms)
        // This ensures variety - each scenario uses different terms
        const shuffledTerms = [...availableTerms].sort(() => Math.random() - 0.5);
        const termsForScenario = shuffledTerms.slice(0, Math.min(6, availableTerms.length));
        
        if (scenarioCount === 0) {
            difficultyLevel = 'easy';
            maxTerms = 2;
            difficultyInstructions = 'Maak een EENVOUDIG scenario met alleen de AND-operator. Gebruik PRECIES 2 zoektermen uit de beschikbare termen. Voorbeeld: "Je zoekt naar artikelen die zowel over [term1] als over [term2] gaan."';
        } else if (scenarioCount === 1) {
            difficultyLevel = 'easy-medium';
            maxTerms = 2;
            difficultyInstructions = 'Maak een scenario met de OR-operator. Gebruik PRECIES 2 zoektermen uit de beschikbare termen. Voorbeeld: "Je zoekt naar artikelen die over [term1] of [term2] gaan."';
        } else if (scenarioCount === 2) {
            difficultyLevel = 'medium';
            maxTerms = 3;
            difficultyInstructions = 'Maak een scenario met AND en OR operatoren. Gebruik PRECIES 3 zoektermen uit de beschikbare termen. Voorbeeld: "Je zoekt naar artikelen over [term1] die ([term2] of [term3]) bevatten."';
        } else if (scenarioCount === 3) {
            difficultyLevel = 'medium-hard';
            maxTerms = 3;
            difficultyInstructions = 'Maak een scenario met AND en NOT operatoren. Gebruik PRECIES 3 zoektermen uit de beschikbare termen. Voorbeeld: "Je zoekt naar artikelen over [term1] en [term2], maar niet over [term3]."';
        } else {
            difficultyLevel = 'hard';
            maxTerms = 4;
            difficultyInstructions = 'Maak een COMPLEX scenario met AND, OR, NOT operatoren EN haakjes voor groepering. Gebruik MAXIMAAL 4 zoektermen uit de beschikbare termen. Voorbeeld: "Je zoekt naar artikelen over ([term1] of [term2]) en [term3], maar niet over [term4]."';
        }

        const prompt = `Je bent een expert in informatievaardigheden en Booleaanse zoekoperatoren.

Op basis van de volgende theorie tekst over Booleaanse operatoren en zoektermen:
${actualTheoryContent.substring(0, 4000)}

Beschikbare zoektermen voor DIT scenario: ${termsForScenario.join(', ')}

BELANGRIJK - Moeilijkheidsniveau: ${difficultyLevel}
${difficultyInstructions}

KRITIEK: 
- Gebruik MAXIMAAL ${maxTerms} zoektermen in totaal. NIET meer!
- Gebruik ALLEEN de zoektermen uit de lijst hierboven (${termsForScenario.join(', ')})
- Maak een UNIEK scenario met een andere context dan eerdere scenario's

Genereer een oefening scenario waarbij een student een zoekquery moet schrijven. Het scenario moet:
1. Een duidelijke, beknopte beschrijving bevatten van wat de student moet zoeken (maximaal 2 zinnen)
2. Passen bij het moeilijkheidsniveau (${difficultyLevel})
3. Gebruik maken van PRECIES ${maxTerms} zoektermen uit de beschikbare lijst hierboven
4. Een correcte query hebben die de student moet schrijven
5. Een UNIEKE context hebben (andere situatie/onderwerp dan standaard voorbeelden)

Geef je antwoord terug in JSON format:
{
  "description": "Beknopte beschrijving van wat de student moet zoeken (maximaal 2 zinnen)",
  "correctQuery": "De correcte query (bijvoorbeeld: 'transport AND optimalisatie')",
  "difficulty": "${difficultyLevel}",
  "explanation": "Korte uitleg waarom deze query correct is"
}

Antwoord alleen met de JSON, geen extra tekst.`;

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        let availableModels = [];
        try {
            availableModels = await getAvailableModels();
            console.log('[generate-query-scenario] Available models count:', availableModels.length);
            console.log('[generate-query-scenario] Available models:', availableModels.slice(0, 10));
        } catch (modelError) {
            console.warn('[generate-query-scenario] Error getting models, using defaults:', modelError.message);
        }
        
        // Use models from the available models list (they're already filtered to support generateContent)
        // Prefer flash models (faster), then pro models
        let models = [];
        
        if (availableModels.length > 0) {
            // Filter to prefer stable models, exclude preview/experimental
            const preferred = availableModels.filter(m => {
                if (m.includes('-preview-') || m.includes('-experimental-')) return false;
                if (m.includes('lite-preview')) return false;
                // Exclude models that might not work with v1 API
                if (m.includes('-latest') && !m.includes('flash-latest') && !m.includes('pro-latest')) return false;
                return true;
            });
            
            // Sort: flash first, then pro, then others
            preferred.sort((a, b) => {
                if (a.includes('flash') && !b.includes('flash')) return -1;
                if (b.includes('flash') && !a.includes('flash')) return 1;
                if (a.includes('pro') && !b.includes('pro')) return -1;
                if (b.includes('pro') && !a.includes('pro')) return 1;
                return 0;
            });
            
            models = preferred.length > 0 ? preferred.slice(0, 3) : availableModels.slice(0, 3);
            console.log('[generate-query-scenario] Filtered preferred models:', preferred.slice(0, 5));
        } else {
            // Fallback: use only gemini-1.5-flash (most reliable)
            models = ['gemini-1.5-flash'];
            console.log('[generate-query-scenario] No available models, using fallback');
        }
        
        console.log('[generate-query-scenario] Will try models in order:', models);
        
        let lastError = null;
        for (const modelName of models) {
            try {
                console.log(`[generate-query-scenario] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                console.log(`[generate-query-scenario] Response from ${modelName} (first 500 chars):`, text.substring(0, 500));
                
                // Try to extract JSON from response
                // First, try to find JSON object (most common case)
                let jsonMatch = text.match(/\{[\s\S]*\}/);
                
                // If no match, try to find JSON wrapped in markdown code blocks
                if (!jsonMatch) {
                    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                    if (codeBlockMatch) {
                        jsonMatch = codeBlockMatch;
                    }
                }
                
                if (jsonMatch) {
                    try {
                        const jsonStr = jsonMatch[0].replace(/```json\s*/g, '').replace(/```/g, '').trim();
                        const parsed = JSON.parse(jsonStr);
                        console.log('[generate-query-scenario] Successfully parsed JSON');
                        // Always use the selected subset of terms for this scenario
                        // This ensures each scenario has different available terms (variety)
                        const scenarioTerms = termsForScenario;
                        
                        return res.json({
                            success: true,
                            description: parsed.description || 'Geen beschrijving beschikbaar',
                            correctQuery: parsed.correctQuery || '',
                            difficulty: parsed.difficulty || 'medium',
                            explanation: parsed.explanation || 'Geen uitleg beschikbaar',
                            availableTerms: scenarioTerms // Terms to display for this scenario
                        });
                    } catch (parseError) {
                        console.error('[generate-query-scenario] JSON parse error:', parseError.message);
                        console.error('[generate-query-scenario] JSON string:', jsonMatch[0].substring(0, 200));
                        throw new Error(`Failed to parse JSON: ${parseError.message}`);
                    }
                } else {
                    console.error('[generate-query-scenario] No JSON found in response');
                    console.error('[generate-query-scenario] Full response:', text);
                    throw new Error('No JSON found in AI response');
                }
            } catch (error) {
                console.error(`[generate-query-scenario] Error with model ${modelName}:`, error.message);
                console.error(`[generate-query-scenario] Error stack:`, error.stack);
                lastError = error;
                continue;
            }
        }

        console.error('[generate-query-scenario] All models failed');
        throw lastError || new Error('All models failed');

    } catch (error) {
        console.error('[Gemini Proxy] Error generating scenario:', error);
        console.error('[Gemini Proxy] Error stack:', error.stack);
        console.error('[Gemini Proxy] Error details:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * Input validatie middleware voor validate-query
 */
const validateQuery = [
    body('description')
        .isString()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('description must be between 10 and 500 characters'),
    body('userQuery')
        .isString()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('userQuery must be between 1 and 500 characters'),
    body('availableTerms')
        .isArray({ min: 1 })
        .withMessage('availableTerms must be a non-empty array'),
    body('availableTerms.*')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 }),
    body('correctQuery')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
];

/**
 * Validate boolean query with AI feedback
 * POST /api/validate-query
 */
app.post('/api/validate-query', validateQuery, async (req, res) => {
    try {
        // Check voor validatie errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Invalid input', 
                message: 'Input validation failed',
                errors: errors.array()
            });
        }

        const { description, userQuery, availableTerms, correctQuery } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'GEMINI_API_KEY is not set in environment variables'
            });
        }

        // Build prompt with correct query if available
        const correctQueryInfo = correctQuery 
            ? `\nDe correcte query voor dit scenario is: "${correctQuery}"\nGebruik deze exacte query als suggestedQuery als de student query niet correct is.`
            : '';

        const prompt = `Je bent een expert in informatievaardigheden en Booleaanse zoekoperatoren.

Een student heeft de volgende zoekopdracht beschrijving gekregen:
"${description}"

Beschikbare zoektermen: ${availableTerms.join(', ')}${correctQueryInfo}

De student heeft de volgende query ingevoerd:
"${userQuery}"

Geef beknopte, bemoedigende feedback op de query (MAXIMAAL 4-5 zinnen). Beoordeel:
1. Of de query correct is voor de beschrijving
2. Of de juiste operatoren (AND, OR, NOT) zijn gebruikt
3. Of haakjes correct zijn gebruikt waar nodig
4. Of alle benodigde termen zijn gebruikt (NIET alle beschikbare termen, alleen de benodigde!)
5. Geef één constructieve suggestie voor verbetering als de query nog niet volledig correct is

BELANGRIJK: 
- Feedback moet MAXIMAAL 4-5 zinnen zijn. Wees beknopt!
- Gebruik bemoedigende taal en spreek de student direct aan met "je/jouw"
- Als de query niet correct is en er is een correcte query gegeven, gebruik die EXACT als suggestedQuery
- De suggestedQuery moet alleen de benodigde termen bevatten voor het scenario, NIET alle beschikbare termen
- Focus op het belangrijkste punt - niet alle details uitleggen

SPECIALE INSTRUCTIE VOOR "BIJNA CORRECTE" QUERIES:
Als de query bijna correct is (goede termen, goede operatoren, maar één kleine verbetering nodig), geef dan een concrete, praktische tip:
- Multi-word termen (zoals "supply chain"): "Gebruik aanhalingstekens rond 'supply chain' zodat het als één exacte uitdrukking wordt behandeld."
- Operator volgorde: "Zet de AND-operator tussen de termen, niet aan het begin."
- Haakjes plaatsing: "Gebruik haakjes om (term1 OR term2) te groeperen voordat je AND gebruikt."
- Spaties: "Zorg voor spaties rond operatoren: term1 AND term2 (niet term1ANDterm2)."
- Termen die ontbreken: "Voeg ook [term] toe met de AND-operator."

Voorbeelden van beknopte feedback met praktische tips:
* "Je bent al heel goed op weg! Je hebt de juiste operatoren gebruikt. Om 'supply chain' als één exacte uitdrukking te behandelen, gebruik aanhalingstekens: \"supply chain\"."
* "Goed begin! Je hebt de juiste termen gekozen. Voor deze opdracht heb je echter de AND-operator nodig in plaats van OR."
* "Je query is correct! Je hebt perfect begrepen hoe de AND-operator werkt."
* "Bijna perfect! Je mist alleen aanhalingstekens rond 'supply chain' om het als één exacte uitdrukking te behandelen."

Geef je antwoord terug in JSON format:
{
  "isCorrect": true/false,
  "feedback": "Beknopte bemoedigende feedback in het Nederlands (MAXIMAAL 4-5 zinnen, gebruik 'je/jouw')",
  "suggestedQuery": "${correctQuery || 'De correcte query (alleen als isCorrect false is, gebruik alleen benodigde termen)'}",
  "explanation": "Korte uitleg waarom de query wel/niet correct is (maximaal 1-2 zinnen)"
}

Antwoord alleen met de JSON, geen extra tekst.`;

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        let availableModels = await getAvailableModels();
        
        // Use models from the available models list (they're already filtered to support generateContent)
        // Prefer flash models (faster), then pro models
        let models = [];
        
        if (availableModels.length > 0) {
            // Filter to prefer stable models, exclude preview/experimental
            const preferred = availableModels.filter(m => {
                if (m.includes('-preview-') || m.includes('-experimental-')) return false;
                if (m.includes('lite-preview')) return false;
                return true;
            });
            
            // Sort: flash first, then pro, then others
            preferred.sort((a, b) => {
                if (a.includes('flash') && !b.includes('flash')) return -1;
                if (b.includes('flash') && !a.includes('flash')) return 1;
                if (a.includes('pro') && !b.includes('pro')) return -1;
                if (b.includes('pro') && !a.includes('pro')) return 1;
                return 0;
            });
            
            models = preferred.length > 0 ? preferred.slice(0, 3) : availableModels.slice(0, 3);
        } else {
            // Fallback: use only gemini-1.5-flash (most reliable)
            models = ['gemini-1.5-flash'];
        }
        
        let lastError = null;
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const jsonStr = jsonMatch[0].replace(/```json\s*/g, '').replace(/```/g, '').trim();
                        const parsed = JSON.parse(jsonStr);
                        
                        // Use correct query as suggested query if provided and query is incorrect
                        let suggestedQuery = parsed.suggestedQuery || null;
                        if (!parsed.isCorrect && correctQuery) {
                            suggestedQuery = correctQuery;
                        }
                        
                        return res.json({
                            success: true,
                            isCorrect: parsed.isCorrect === true,
                            feedback: parsed.feedback || 'Geen feedback beschikbaar',
                            suggestedQuery: suggestedQuery,
                            explanation: parsed.explanation || parsed.feedback
                        });
                    } catch (parseError) {
                        console.error('[validate-query] JSON parse error:', parseError.message);
                        throw new Error(`Failed to parse JSON: ${parseError.message}`);
                    }
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (error) {
                console.error(`[Gemini Proxy] Error with model ${modelName}:`, error.message);
                lastError = error;
                continue;
            }
        }

        throw lastError || new Error('All models failed');

    } catch (error) {
        console.error('[Gemini Proxy] Error validating query:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Input validatie middleware voor generate-bouwsteen
 */
const validateBouwsteenGenerator = [
    body('word')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('word is required and must be between 1 and 100 characters'),
    body('context')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
        .withMessage('context must be max 500 characters')
];

/**
 * Generate Bouwsteen table based on word and context
 * POST /api/generate-bouwsteen
 */
app.post('/api/generate-bouwsteen', validateBouwsteenGenerator, async (req, res) => {
    try {
        // Check voor validatie errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Invalid input', 
                message: 'Input validation failed',
                errors: errors.array()
            });
        }

        const { word, context } = req.body;

        // Use specific key if available, otherwise fallback to general key
        const apiKey = GEMINI_BOUWSTEEN_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'GEMINI_API_KEY is not set in environment variables'
            });
        }

        const contextInfo = context ? `\nContext: "${context}"` : '';

        const prompt = `Je bent een expert in informatievaardigheden en het opstellen van zoekstrategieën met de bouwsteenmethode.

Genereer een tabel voor de bouwsteenmethode voor het woord: "${word}"${contextInfo}

De tabel moet de volgende kolommen bevatten:
1. Synoniemen (Andere woorden met dezelfde betekenis)
2. Vertalingen (Engels is de standaard, eventueel andere relevante talen)
3. Afkortingen (Indien van toepassing)
4. Spellingsvormen (Enkelvoud/meervoud, alternatieve spellingen)
5. Vaktermen (Specifieke jargon of technische termen)
6. Bredere termen (Algemenere begrippen)
7. Nauwere termen (Specifiekere begrippen)

Geef voor elke categorie minimaal 2-3 relevante suggesties als die er zijn. Als er voor een categorie echt niets relevants is, laat deze dan leeg of geef "n.v.t." aan.

Geef het antwoord terug in JSON format met deze structuur:
{
  "synoniemen": ["...", "..."],
  "vertalingen": ["...", "..."],
  "afkortingen": ["...", "..."],
  "spellingsvormen": ["...", "..."],
  "vaktermen": ["...", "..."],
  "bredere_termen": ["...", "..."],
  "nauwere_termen": ["...", "..."]
}

    Antwoord alleen met de JSON, geen extra tekst.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // We gebruiken expliciet de nieuwere modellen omdat 1.5-flash/pro 404 errors geven
        // gemini-2.5-flash-lite bleek te werken in de logs voor de andere generator
        const models = [
            'gemini-2.5-flash-lite', 
            'gemini-flash-latest', 
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash' // Fallback
        ];
        
        console.log(`[generate-bouwsteen] Using API key ending in ...${apiKey.slice(-4)}`);
        console.log(`[generate-bouwsteen] Will try models in order:`, models);
        
        let lastError = null;
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const jsonStr = jsonMatch[0].replace(/```json\s*/g, '').replace(/```/g, '').trim();
                        const parsed = JSON.parse(jsonStr);
                        
                        return res.json({
                            success: true,
                            data: parsed
                        });
                    } catch (parseError) {
                        console.error('[generate-bouwsteen] JSON parse error:', parseError.message);
                        throw new Error(`Failed to parse JSON: ${parseError.message}`);
                    }
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (error) {
                console.error(`[Gemini Proxy] Error with model ${modelName}:`, error.message);
                lastError = error;
                continue;
            }
        }

        throw lastError || new Error('All models failed');

    } catch (error) {
        console.error('[Gemini Proxy] Error generating bouwsteen:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        apiKeyConfigured: !!GEMINI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

/**
 * Test Gemini API connection and list available models
 * GET /api/test-gemini
 */
app.get('/api/test-gemini', async (req, res) => {
    if (!GEMINI_API_KEY) {
        return res.status(500).json({
            error: 'API key not configured'
        });
    }

    try {
        // First, try to list available models via REST API
        const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        console.log('[Test] Fetching available models from:', listModelsUrl.replace(GEMINI_API_KEY, 'API_KEY_HIDDEN'));
        
        const fetch = globalThis.fetch || require('node-fetch');
        const listResponse = await fetch(listModelsUrl);
        
        if (listResponse.ok) {
            const modelsData = await listResponse.json();
            const availableModels = modelsData.models?.map(m => m.name) || [];
            console.log('[Test] Available models:', availableModels);
            
            // Try SDK with first available model
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const testModel = availableModels.find(m => m.includes('flash') || m.includes('gemini')) || 'gemini-1.5-flash';
            const model = genAI.getGenerativeModel({ model: testModel.replace('models/', '') });
            
            const result = await model.generateContent('Say "Hello" in Dutch');
            const response = await result.response;
            const text = response.text();
            
            res.json({
                success: true,
                message: 'Gemini API connection successful',
                response: text,
                model: testModel,
                availableModels: availableModels.slice(0, 10) // First 10 models
            });
        } else {
            const errorText = await listResponse.text();
            res.status(502).json({
                error: 'Cannot list models',
                status: listResponse.status,
                message: errorText.substring(0, 500),
                apiKeyLength: GEMINI_API_KEY.length,
                apiKeyPrefix: GEMINI_API_KEY.substring(0, 10) + '...'
            });
        }
    } catch (error) {
        res.status(502).json({
            error: 'Gemini API test failed',
            message: error.message,
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Static files moeten NA API routes worden geladen
// Anders worden API routes overschreven door static file serving
// Op Vercel: __dirname in server.js is altijd de root directory waar server.js staat
// Maar op Vercel serverless kunnen bestanden op een andere locatie staan
let rootDir = __dirname;

// Als we op Vercel draaien en er is een VERCEL_ROOT_DIR environment variable, gebruik die
if (process.env.VERCEL && process.env.VERCEL_ROOT_DIR) {
    rootDir = process.env.VERCEL_ROOT_DIR;
    console.log(`Using Vercel root directory: ${rootDir}`);
} else if (process.env.VERCEL) {
    // Op Vercel serverless is __dirname /var/task/, maar bestanden staan in de root
    // Probeer parent directory
    const parentDir = path.join(__dirname, '..');
    if (fs.existsSync(path.join(parentDir, 'index.html'))) {
        rootDir = parentDir;
        console.log(`Found root directory on Vercel: ${rootDir}`);
    } else {
        // Laatste redmiddel: gebruik __dirname en log voor debugging
        console.log(`Warning: Could not find root directory. Using __dirname: ${__dirname}`);
        rootDir = __dirname;
    }
}

// Serveer index.html voor root route
app.get('/', (req, res, next) => {
    // Eerst proberen: gebruik in-memory cache (voor Vercel serverless)
    // MAAR: Als er query parameters zijn, lees altijd van disk
    const hasQueryParams = req.url.includes('?') || (req.query && Object.keys(req.query).length > 0);
    
    if (global.htmlFilesCache && global.htmlFilesCache['index.html'] && !hasQueryParams) {
        console.log(`✅ Serving index.html from memory cache`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.send(global.htmlFilesCache['index.html']);
    }
    
    if (hasQueryParams) {
        console.log(`🔄 Serving index.html from disk (query params detected - bypassing cache)`);
    }
    
    // Fallback: probeer bestand van disk te lezen
    const indexPath = path.join(rootDir, 'index.html');
    // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
    res.setHeader('Cache-Control', 'no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            next(err);
        }
    });
});

// Serveer game/index.html expliciet
app.get('/game/index.html', (req, res, next) => {
    const filePath = path.join(rootDir, 'game', 'index.html');
    console.log(`Attempting to serve game/index.html from: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving game/index.html:', err);
                next(err);
            }
        });
    } else {
        console.error(`❌ Game file not found: ${filePath}`);
        res.status(404).send(`Game not found: ${filePath}`);
    }
});

// Serveer game assets (CSS, JS, SVG) - moet VOOR de algemene static middleware komen
app.get('/game/assets/:filename', (req, res, next) => {
    const filename = req.params.filename;
    
    // Security: voorkom path traversal (../, /, \ of andere onveilige tekens)
    // Sta alleen "veilige" bestandsnamen toe: letters, cijfers, punt, underscore en streepje
    const safeFilenamePattern = /^[a-zA-Z0-9._-]+$/;
    if (!safeFilenamePattern.test(filename)) {
        console.warn(`[Security] Blocked invalid game asset filename: ${filename}`);
        return res.status(400).send('Invalid asset path');
    }

    const filePath = path.join(rootDir, 'game', 'assets', filename);
    console.log(`Attempting to serve game asset: ${filename} from ${filePath}`);
    
    if (fs.existsSync(filePath)) {
        // Set correct MIME type based on file extension
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.json': 'application/json'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error serving game asset ${filename}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`❌ Game asset not found: ${filePath}`);
        res.status(404).send(`Game asset not found: ${filename}`);
    }
});

// Serveer game vite.svg
app.get('/game/vite.svg', (req, res, next) => {
    const filePath = path.join(rootDir, 'game', 'vite.svg');
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving game vite.svg:', err);
                next(err);
            }
        });
    } else {
        next();
    }
});

// Serveer alle HTML bestanden expliciet (week1.html, week2.html, instructies.html, etc.)
// Deze route moet VOOR de static middleware komen om zeker te zijn dat HTML files worden geserveerd
app.get(/\.html$/, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. week1.html (zonder leading slash)
    
    // Eerst proberen: gebruik in-memory cache (voor Vercel serverless)
    // MAAR: Als er query parameters zijn in de request URL, lees altijd van disk
    // Dit zorgt ervoor dat nieuwe versies worden geladen
    const hasQueryParams = req.url.includes('?') || (req.query && Object.keys(req.query).length > 0);
    
    if (global.htmlFilesCache && global.htmlFilesCache[fileName] && !hasQueryParams) {
        console.log(`✅ Serving ${fileName} from memory cache`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return res.send(global.htmlFilesCache[fileName]);
    }
    
    if (hasQueryParams) {
        console.log(`🔄 Serving ${fileName} from disk (query params detected - bypassing cache)`);
    }
    
    // Fallback: probeer bestand van disk te lezen
    const filePath = path.join(rootDir, fileName);
    console.log(`Attempting to serve from disk: ${fileName}`);
    console.log(`filePath: ${filePath}`);
    
    // Probeer verschillende paden
    const possiblePaths = [
        filePath,
        path.join('/var/task', fileName),
        path.join(process.cwd(), fileName),
        path.join(__dirname, fileName),
    ];
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            foundPath = possiblePath;
            console.log(`✅ Found file at: ${foundPath}`);
            break;
        }
    }
    
    if (foundPath) {
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error(`Error serving ${fileName}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`❌ File not found: ${fileName}`);
        console.error(`Tried paths:`, possiblePaths);
        res.status(404).send(`File not found: ${fileName}`);
    }
});

// Serve static files (CSS, JS, images, JSON, etc.) - maar NIET HTML (die handlen we hierboven)
// Belangrijk: JavaScript bestanden moeten beschikbaar zijn voor de HTML pagina's
app.use(express.static(rootDir, { 
    index: false, // We handlen index.html expliciet
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    maxAge: '1y' // Cache static files for 1 year
}));

// Expliciete route voor JavaScript bestanden (fallback als static middleware faalt)
app.get(/\.js$/, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. pages/Week2LessonPage.js
    const filePath = path.join(rootDir, fileName);
    
    // Probeer verschillende paden
    const possiblePaths = [
        filePath,
        path.join('/var/task', fileName),
        path.join(process.cwd(), fileName),
        path.join(__dirname, fileName),
    ];
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            foundPath = possiblePath;
            break;
        }
    }
    
    if (foundPath) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error(`Error serving JS file ${fileName}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`❌ JS file not found: ${fileName}`);
        res.status(404).send(`// File not found: ${fileName}`);
    }
});

// Serve static files (CSS, JS, images, JSON, etc.) - maar NIET HTML (die handlen we hierboven)
// Belangrijk: JavaScript bestanden moeten beschikbaar zijn voor de HTML pagina's
app.use(express.static(rootDir, { 
    index: false, // We handlen index.html expliciet
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    maxAge: '1y' // Cache static files for 1 year
}));

// Expliciete route voor JSON bestanden (content files) - NA static middleware als fallback
app.get(/\.json$/, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. content/week2.content.json
    const filePath = path.join(rootDir, fileName);
    
    // Probeer verschillende paden
    const possiblePaths = [
        filePath,
        path.join('/var/task', fileName),
        path.join(process.cwd(), fileName),
        path.join(__dirname, fileName),
    ];
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            foundPath = possiblePath;
            break;
        }
    }
    
    if (foundPath) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        // Strict no-cache beleid om te forceren dat de browser altijd bij de server checkt
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error(`Error serving JSON file ${fileName}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`❌ JSON file not found: ${fileName}`);
        res.status(404).json({ error: `File not found: ${fileName}` });
    }
});

// Expliciete route voor afbeeldingen en andere assets - NA static middleware als fallback
app.get(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|docx)$/i, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. assets/images/Praktijkprobleem.png
    const filePath = path.join(rootDir, fileName);
    
    // Probeer verschillende paden
    const possiblePaths = [
        filePath,
        path.join('/var/task', fileName),
        path.join(process.cwd(), fileName),
        path.join(__dirname, fileName),
    ];
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            foundPath = possiblePath;
            break;
        }
    }
    
    if (foundPath) {
        // Bepaal content type op basis van extensie
        const ext = path.extname(fileName).toLowerCase();
        const contentTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error(`Error serving asset ${fileName}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`❌ Asset not found: ${fileName}`);
        res.status(404).send(`Asset not found: ${fileName}`);
    }
});

// Expliciete route voor config.js (kan in .gitignore staan)
app.get('/config.js', (req, res, next) => {
    const possiblePaths = [
        path.join(rootDir, 'config.js'),
        path.join('/var/task', 'config.js'),
        path.join(process.cwd(), 'config.js'),
    ];
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            foundPath = possiblePath;
            break;
        }
    }
    
    if (foundPath) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error('Error serving config.js:', err);
                // Als config.js niet bestaat, stuur een lege config
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                res.send('// Config file not found');
            }
        });
    } else {
        // Stuur een lege config als fallback
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.send('// Config file not found');
    }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Global error handler (moet als laatste middleware komen)
app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    
    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS error',
            message: 'Deze origin is niet toegestaan'
        });
    }
    
    // Rate limit errors
    if (err.status === 429) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Te veel requests, probeer het later opnieuw'
        });
    }
    
    // Default error response
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Er is een fout opgetreden' 
            : err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler voor onbekende routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} niet gevonden`
    });
});

// Export voor Vercel serverless
module.exports = app;

// Start server alleen lokaal (niet op Vercel)
if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 API Key configured: ${!!GEMINI_API_KEY ? '✅ Yes' : '❌ No'}`);
        console.log(`🔒 Security: Helmet, Rate Limiting, CORS, Input Validation enabled`);
        console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
        if (!GEMINI_API_KEY) {
            console.log(`⚠️  Please set GEMINI_API_KEY in .env file`);
        }
        console.log(`\n📚 E-Learning template is available at: http://localhost:${PORT}`);
        console.log(`🔧 API endpoint: http://localhost:${PORT}/api/generate-questions`);
        
        // Pre-load available models cache on server start
        if (GEMINI_API_KEY) {
            console.log('[Gemini Proxy] Pre-loading available models cache...');
            await fetchAndCacheAvailableModels();
        }
    });
}

