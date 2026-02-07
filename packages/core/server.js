/**
 * Server-side Proxy voor DeepSeek API
 * 
 * Deze server handelt DeepSeek API calls af om CORS-problemen te voorkomen
 * en API keys veilig te beheren.
 */

// Load .env from monorepo root (not from packages/core)
const path = require('path');
const fs = require('fs');
// Determine monorepo root (go up from packages/core)
const monorepoRoot = path.resolve(__dirname, '..', '..');
const envPath = path.join(monorepoRoot, '.env');
// Try to load .env from root, fallback to local .env
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`[Monorepo] ✅ Loaded .env from: ${envPath}`);
} else {
    require('dotenv').config(); // Fallback to local .env
    console.log(`[Monorepo] ⚠️  .env not found at ${envPath}, using local .env`);
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
// OpenAI SDK for DeepSeek (OpenAI-compatible API)
let OpenAI;
try {
    OpenAI = require('openai');
} catch (e) {
    console.error('[Server] ❌ OpenAI SDK not installed. DeepSeek support requires the "openai" package.');
    console.error('[Server] Run: npm install openai');
    process.exit(1);
}

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
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://*.vercel.app"],
        scriptSrcAttr: ["'unsafe-inline'"], // Toestaan van inline event handlers (onerror, onload)
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: [
                "'self'", 
                "https://*.vercel.app", 
                "https://generativelanguage.googleapis.com",
                "http://127.0.0.1:7242", // Debug logging endpoint (development only)
                "http://localhost:7242"  // Alternative debug logging endpoint
            ],
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
        if (!origin) {
            console.log('[CORS] Allowing request with no origin (same-origin or server-to-server)');
            return callback(null, true);
        }
        
        console.log(`[CORS] Checking origin: ${origin}`);
        
        // On Vercel, allow requests from vercel.app domains (for production and preview deployments)
        if (process.env.VERCEL) {
            // Allow all vercel.app domains (includes production and preview deployments)
            if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
                console.log(`[CORS] ✅ Allowing Vercel domain: ${origin}`);
                return callback(null, true);
            }
            // Allow the specific Vercel deployment URL if set
            if (process.env.VERCEL_URL) {
                const vercelUrl = `https://${process.env.VERCEL_URL}`;
                if (origin === vercelUrl) {
                    console.log(`[CORS] ✅ Allowing specific Vercel URL: ${origin}`);
                    return callback(null, true);
                }
            }
            // Also allow custom domains if VERCEL_ENV is set
            if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
                console.log(`[CORS] ✅ Allowing Vercel ${process.env.VERCEL_ENV} environment: ${origin}`);
                return callback(null, true);
            }
        }
        
        // Check against allowed origins list (for local development)
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log(`[CORS] ✅ Allowing origin from allowed list: ${origin}`);
            callback(null, true);
        } else {
            console.warn(`[CORS] ❌ Blocked origin: ${origin}`);
            console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
            console.warn(`[CORS] VERCEL env: ${process.env.VERCEL}`);
            console.warn(`[CORS] VERCEL_URL: ${process.env.VERCEL_URL}`);
            callback(new Error('Deze origin is niet toegestaan'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request size limits (prevent DoS)
// Request logging middleware (voor debugging)
app.use((req, res, next) => {
    if (req.path.startsWith('/core/')) {
        console.log(`[Request Logger] ${req.method} ${req.path} - Will be handled by /core/* route`);
    }
    next();
});

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

// API Key validation (DeepSeek only)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const AI_PROVIDER = process.env.AI_PROVIDER || 'deepseek'; // Always use DeepSeek

// Log global API configuration
if (DEEPSEEK_API_KEY) {
    console.log('[API Config] ✅ Global DeepSeek API configured');
} else {
    console.error('⚠️  WARNING: DEEPSEEK_API_KEY is not set in .env file');
    console.error('   Please set: DEEPSEEK_API_KEY=your_deepseek_key');
    console.error('   Get your API key at: https://platform.deepseek.com/api_keys');
}

// Functions will be defined after availableApps is initialized
let detectAppFromPath, getAppAPIConfig, parseEnvFile;

// DeepSeek uses fixed model: deepseek-chat (no model caching needed)

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
 * Proxy endpoint voor DeepSeek API generateContent
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

        // Detect app from request path, referer header, or origin header
        let appName = detectAppFromPath(req.path);
        if (!appName && req.headers.referer) {
            appName = detectAppFromPath(req.headers.referer);
        }
        if (!appName && req.headers.origin) {
            appName = detectAppFromPath(req.headers.origin);
        }
        
        // Get app-specific API configuration
        const apiConfig = getAppAPIConfig(appName);
        
        // Check if API key is set
        if (!apiConfig.apiKey) {
            return res.status(500).json({
                error: 'API key not configured',
                message: `DEEPSEEK_API_KEY is not set${appName ? ` for app: ${appName}` : ''}`
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

        let responseText;
        let lastError;
        
        // Use DeepSeek API if configured
        if (apiConfig.provider === 'deepseek') {
            if (!OpenAI) {
                return res.status(500).json({
                    error: 'OpenAI SDK not installed',
                    message: 'DeepSeek support requires the "openai" package. Run: npm install openai'
                });
            }
            
            try {
                console.log(`[DeepSeek Proxy] Using DeepSeek API for app: ${appName || 'default'}`);
                const openai = new OpenAI({
                    apiKey: apiConfig.apiKey,
                    baseURL: 'https://api.deepseek.com'
                });
                
                const completion = await openai.chat.completions.create({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                });
                
                responseText = completion.choices[0]?.message?.content;
                
                if (!responseText) {
                    throw new Error('Empty response from DeepSeek API');
                }
                
                console.log(`[DeepSeek Proxy] ✅ Success`);
                console.log(`[DeepSeek Proxy] Response length: ${responseText.length} characters`);
            } catch (error) {
                const errorMsg = error.message || error.toString();
                const statusCode = error.status || error.statusCode || (error.response ? error.response.status : null);
                console.error(`[DeepSeek Proxy] ❌ API call failed:`, errorMsg);
                
                // Check for 429 Rate Limit error
                if (statusCode === 429 || errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('Quota') || errorMsg.includes('rate limit')) {
                    return res.status(429).json({
                        success: false,
                        error: 'QUOTA_EXCEEDED',
                        message: 'API quota exceeded. Please try again tomorrow or continue working with the theory content.'
                    });
                }
                
                return res.status(502).json({
                    error: 'DeepSeek API failed',
                    message: errorMsg,
                    details: error
                });
            }
        } else {
            // This should never happen - only DeepSeek is supported
            throw new Error('Only DeepSeek API is supported. Please configure DEEPSEEK_API_KEY.');
        }
        console.log(`[DeepSeek] Received response text length:`, responseText?.length || 0);

        // Parse JSON from response (DeepSeek might wrap it in markdown code blocks)
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
            console.error(`[DeepSeek] JSON parse error:`, parseError);
            console.error(`[DeepSeek] Text to parse:`, jsonText.substring(0, 1000));
            return res.status(502).json({
                error: 'Failed to parse DeepSeek response',
                message: 'Response is not valid JSON',
                parseError: parseError.message,
                responseText: jsonText.substring(0, 500)
            });
        }

        // Validate response structure
        if (!parsed.vragen || !Array.isArray(parsed.vragen) || parsed.vragen.length === 0) {
            console.error(`[DeepSeek] Invalid questions structure:`, parsed);
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

        console.log(`[DeepSeek] Successfully generated ${questions.length} questions`);

        // Return questions
        return res.json({
            success: true,
            vragen: questions
        });

    } catch (error) {
        console.error('[DeepSeek] Error:', error);
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

        if (!DEEPSEEK_API_KEY) {
            console.error('[generate-query-scenario] API key not configured');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'DEEPSEEK_API_KEY is not set in environment variables'
            });
        }
        
        if (!OpenAI) {
            return res.status(500).json({
                error: 'OpenAI SDK not installed',
                message: 'DeepSeek support requires the "openai" package. Run: npm install openai'
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

        // Use DeepSeek API
        const openai = new OpenAI({
            apiKey: DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com'
        });
        
        try {
            console.log('[generate-query-scenario] Using DeepSeek API');
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
            
            const text = completion.choices[0]?.message?.content || '';
            console.log(`[generate-query-scenario] Response from DeepSeek (first 500 chars):`, text.substring(0, 500));
            
            // Try to extract JSON from response
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
                    const scenarioTerms = termsForScenario;
                    
                    return res.json({
                        success: true,
                        description: parsed.description || 'Geen beschrijving beschikbaar',
                        correctQuery: parsed.correctQuery || '',
                        difficulty: parsed.difficulty || 'medium',
                        explanation: parsed.explanation || 'Geen uitleg beschikbaar',
                        availableTerms: scenarioTerms
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
            console.error('[generate-query-scenario] Error:', error.message);
            throw error;
        }

    } catch (error) {
        console.error('[DeepSeek] Error generating scenario:', error);
        console.error('[DeepSeek] Error stack:', error.stack);
        console.error('[DeepSeek] Error details:', {
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

        if (!DEEPSEEK_API_KEY) {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'DEEPSEEK_API_KEY is not set in environment variables'
            });
        }
        
        if (!OpenAI) {
            return res.status(500).json({
                error: 'OpenAI SDK not installed',
                message: 'DeepSeek support requires the "openai" package. Run: npm install openai'
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

        // Use DeepSeek API
        const openai = new OpenAI({
            apiKey: DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com'
        });
        
        try {
            console.log('[generate-query-feedback] Using DeepSeek API');
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });
            
            const text = completion.choices[0]?.message?.content || '';
            
            // Try to extract JSON from response
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
                    
                    return res.json({
                        success: true,
                        isCorrect: parsed.isCorrect || false,
                        feedback: parsed.feedback || 'Geen feedback beschikbaar',
                        suggestedQuery: parsed.suggestedQuery || '',
                        explanation: parsed.explanation || 'Geen uitleg beschikbaar'
                    });
                } catch (parseError) {
                    console.error('[generate-query-feedback] JSON parse error:', parseError.message);
                    throw new Error(`Failed to parse JSON: ${parseError.message}`);
                }
            } else {
                throw new Error('No JSON found in AI response');
            }
        } catch (error) {
            console.error('[generate-query-feedback] Error:', error.message);
            return res.status(502).json({
                error: 'Failed to generate feedback',
                message: error.message
            });
        }

    } catch (error) {
        console.error('[DeepSeek] Error validating query:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Input validatie middleware voor generate-bouwsteen-tabel
 */
const validateBouwsteenTabel = [
    body('keyword')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('keyword must be between 1 and 100 characters'),
    body('context')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 200 })
        .withMessage('context must be max 200 characters')
];

/**
 * Generate bouwsteen tabel using AI
 * POST /api/generate-bouwsteen-tabel
 */
app.post('/api/generate-bouwsteen-tabel', validateBouwsteenTabel, async (req, res) => {
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

        const { keyword, context } = req.body;

        console.log('[generate-bouwsteen-tabel] Received request');
        console.log('[generate-bouwsteen-tabel] keyword:', keyword);
        console.log('[generate-bouwsteen-tabel] context:', context || 'none');

        if (!DEEPSEEK_API_KEY) {
            console.error('[generate-bouwsteen-tabel] API key not configured');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'DEEPSEEK_API_KEY is not set in environment variables'
            });
        }
        
        if (!OpenAI) {
            return res.status(500).json({
                error: 'OpenAI SDK not installed',
                message: 'DeepSeek support requires the "openai" package. Run: npm install openai'
            });
        }

        // Build prompt for DeepSeek
        const contextInfo = context ? ` binnen de context: "${context}"` : '';
        const prompt = `Je bent een expert in informatievaardigheden en de bouwsteenmethode voor literatuuronderzoek.

Voor het zoekwoord "${keyword}"${contextInfo}, genereer een bouwsteentabel met de volgende categorieën:

1. **Synoniemen**: Woorden met dezelfde of vergelijkbare betekenis (3-5 suggesties)
2. **Vertalingen**: Vertalingen in andere talen, vooral Engels en Frans (2-4 suggesties, format: "woord (TAAL)")
3. **Afkortingen**: Veelgebruikte afkortingen met uitleg (1-3 suggesties, format: "AFK (Uitleg)")
4. **Spellingsvormen**: Verschillende spellingsvarianten, meervoudsvormen, etc. (2-4 suggesties)
5. **Vaktermen**: Specifieke vakjargon termen die gerelateerd zijn (3-5 suggesties)
6. **Bredere termen**: Meer algemene termen die het begrip omvatten (2-4 suggesties)
7. **Nauwere termen**: Meer specifieke termen die onder het begrip vallen (3-5 suggesties)

Geef de output ALLEEN als JSON in het volgende formaat (geen extra tekst, geen markdown):
{
  "synoniemen": ["term1", "term2", "term3"],
  "vertalingen": ["term (EN)", "term (FR)"],
  "afkortingen": ["AFK (Uitleg)"],
  "spellingsvormen": ["vorm1", "vorm2"],
  "vaktermen": ["term1", "term2"],
  "bredereTermen": ["term1", "term2"],
  "nauwereTermen": ["term1", "term2", "term3"]
}

Zorg ervoor dat:
- Alle suggesties relevant zijn voor het zoekwoord${context ? ' en de context' : ''}
- Suggesties praktisch en bruikbaar zijn voor literatuuronderzoek
- Geen duplicaten voorkomen
- De suggesties in het Nederlands zijn, tenzij het vertalingen zijn`;

        // Use DeepSeek API
        const openai = new OpenAI({
            apiKey: DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com'
        });
        
        try {
            console.log('[generate-bouwsteen-tabel] Using DeepSeek API');
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            });
            
            const text = completion.choices[0]?.message?.content || '';
            console.log(`[generate-bouwsteen-tabel] Response from DeepSeek (first 500 chars):`, text.substring(0, 500));
            
            // Try to extract JSON from response
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
                    console.log('[generate-bouwsteen-tabel] Successfully parsed JSON');
                    
                    // Validate structure
                    const requiredKeys = ['synoniemen', 'vertalingen', 'afkortingen', 'spellingsvormen', 'vaktermen', 'bredereTermen', 'nauwereTermen'];
                    const hasAllKeys = requiredKeys.every(key => key in parsed);
                    
                    if (!hasAllKeys) {
                        throw new Error('Missing required keys in response');
                    }
                    
                    return res.json({
                        success: true,
                        table: parsed
                    });
                } catch (parseError) {
                    console.error('[generate-bouwsteen-tabel] JSON parse error:', parseError.message);
                    console.error('[generate-bouwsteen-tabel] JSON string:', jsonMatch[0].substring(0, 200));
                    throw new Error(`Failed to parse JSON: ${parseError.message}`);
                }
            } else {
                console.error('[generate-bouwsteen-tabel] No JSON found in response');
                console.error('[generate-bouwsteen-tabel] Full response:', text);
                throw new Error('No JSON found in AI response');
            }
        } catch (error) {
            console.error('[generate-bouwsteen-tabel] Error:', error.message);
            
            // Check for 429 Rate Limit error
            const errorMsg = error.message || error.toString();
            const statusCode = error.status || error.statusCode || (error.response ? error.response.status : null);
            
            if (statusCode === 429 || errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('Quota') || errorMsg.includes('rate limit')) {
                return res.status(429).json({
                    success: false,
                    error: 'QUOTA_EXCEEDED',
                    message: 'API quota exceeded. Please try again tomorrow or continue working with the theory content.'
                });
            }
            
            throw error;
        }

    } catch (error) {
        console.error('[generate-bouwsteen-tabel] Error generating bouwsteen tabel:', error);
        console.error('[generate-bouwsteen-tabel] Error stack:', error.stack);
        
        // Return more detailed error in development
        const errorResponse = {
            error: 'Internal server error',
            message: error.message || 'Unknown error occurred'
        };
        
        if (process.env.NODE_ENV === 'development') {
            errorResponse.details = error.stack;
            errorResponse.fullError = error.toString();
        }
        
        return res.status(500).json(errorResponse);
    }
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        apiKeyConfigured: !!DEEPSEEK_API_KEY,
        provider: 'deepseek',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint om te zien wat er wordt geserveerd voor /core/* requests
app.get('/api/test-core-file', (req, res) => {
    const testFilePath = req.query.file || 'js/DarkMode.js';
    const filePath = path.join(coreDir, testFilePath);
    
    console.log(`[Test Core File] Requested file: ${testFilePath}`);
    console.log(`[Test Core File] coreDir: ${coreDir}`);
    console.log(`[Test Core File] Full path: ${filePath}`);
    console.log(`[Test Core File] File exists: ${fs.existsSync(filePath)}`);
    
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const firstLines = content.split('\n').slice(0, 5);
            const hasServerCode = content.includes('require(') || content.includes('const path = require');
            
            res.json({
                success: true,
                file: testFilePath,
                path: filePath,
                exists: true,
                firstLines: firstLines,
                hasServerCode: hasServerCode,
                contentLength: content.length,
                preview: content.substring(0, 200)
            });
        } catch (e) {
            res.json({
                success: false,
                error: e.message,
                file: testFilePath,
                path: filePath
            });
        }
    } else {
        res.json({
            success: false,
            file: testFilePath,
            path: filePath,
            exists: false,
            coreDir: coreDir,
            possiblePaths: [
                path.join(coreDir, testFilePath),
                path.join('/var/task', 'packages', 'core', testFilePath),
                path.join(rootDir, 'packages', 'core', testFilePath),
                path.join(monorepoRoot, 'packages', 'core', testFilePath),
            ]
        });
    }
});

/**
 * Test DeepSeek API connection
 * GET /api/test-deepseek
 */
app.get('/api/test-deepseek', async (req, res) => {
    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({
            error: 'API key not configured',
            message: 'DEEPSEEK_API_KEY is not set in environment variables'
        });
    }
    
    if (!OpenAI) {
        return res.status(500).json({
            error: 'OpenAI SDK not installed',
            message: 'DeepSeek support requires the "openai" package. Run: npm install openai'
        });
    }

    try {
        console.log('[Test] Testing DeepSeek API connection...');
        
        const openai = new OpenAI({
            apiKey: DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com'
        });
        
        const completion = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: 'Say "Hello" in Dutch'
                }
            ],
            max_tokens: 50
        });
        
        const text = completion.choices[0]?.message?.content || 'No response';
        
        res.json({
            success: true,
            message: 'DeepSeek API connection successful',
            response: text,
            model: 'deepseek-chat',
            provider: 'deepseek'
        });
    } catch (error) {
        res.status(502).json({
            error: 'DeepSeek API test failed',
            message: error.message,
            details: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// ============================================
// MONOREPO DIRECTORY STRUCTURE
// ============================================
// monorepoRoot is al gedeclareerd bovenaan (regel 12)
const coreDir = __dirname; // packages/core
// Determine app directory - use APP_DIR env var or find first available app
let appDir = process.env.APP_DIR;
const gameDir = path.join(monorepoRoot, 'game');

// Multi-app support: detect all available apps
const appsDir = path.join(monorepoRoot, 'apps');
let availableApps = {};
if (fs.existsSync(appsDir)) {
    const appDirs = fs.readdirSync(appsDir).filter(f => {
        const fullPath = path.join(appsDir, f);
        return fs.statSync(fullPath).isDirectory() && 
               fs.existsSync(path.join(fullPath, 'index.html'));
    });
    appDirs.forEach(appName => {
        availableApps[appName] = path.join(appsDir, appName);
    });
    console.log(`[Multi-App] Detected ${Object.keys(availableApps).length} apps: ${Object.keys(availableApps).join(', ')}`);
}

/**
 * Detect app name from request path or URL
 * @param {string} pathOrUrl - Request path or full URL
 * @returns {string|null} App name or null
 */
detectAppFromPath = function(pathOrUrl) {
    if (!pathOrUrl) return null;
    
    // Extract app name from path like /apps/ICTO-BMR/... or /ICTO-BMR/... or http://localhost:3000/ICTO-BMR/...
    const appMatch = pathOrUrl.match(/\/(?:apps\/)?([^\/\?#]+)/);
    if (appMatch && appMatch[1]) {
        const appName = appMatch[1];
        // Check if it's a known app directory
        if (availableApps[appName]) {
            return appName;
        }
        // Also check case-insensitive match
        const lowerAppName = appName.toLowerCase();
        for (const [key, value] of Object.entries(availableApps)) {
            if (key.toLowerCase() === lowerAppName) {
                return key;
            }
        }
    }
    return null;
};

/**
 * Parse .env file manually (to avoid conflicts with dotenv.config())
 * @param {string} envPath - Path to .env file
 * @returns {Object} Parsed environment variables
 */
parseEnvFile = function(envPath) {
    const env = {};
    try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith('#')) {
                continue;
            }
            
            // Parse KEY=VALUE format
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                env[key] = value;
            }
        }
    } catch (error) {
        console.error(`[API Config] Error reading .env file ${envPath}:`, error.message);
    }
    return env;
}

/**
 * Get app-specific API configuration
 * @param {string} appName - App name (e.g., 'ICTO-BMR')
 * @returns {Object} API config with provider and apiKey
 */
getAppAPIConfig = function(appName) {
    // Always use DeepSeek - no fallback to Gemini
    if (!DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY is not configured. Please set DEEPSEEK_API_KEY in the global .env file.');
    }

    // All apps use global DeepSeek configuration
    // App-specific .env files are no longer supported - all apps use the global config
    console.log(`[API Config] Using global DeepSeek config for app: ${appName || 'default'}`);
    return {
        provider: 'deepseek',
        apiKey: DEEPSEEK_API_KEY
    };
};

// Multi-app mode: if MULTI_APP=true, enable routing for all apps
const MULTI_APP_MODE = process.env.MULTI_APP === 'true' || process.env.MULTI_APP === '1';
console.log(`[Multi-App] MULTI_APP_MODE: ${MULTI_APP_MODE}, MULTI_APP env: ${process.env.MULTI_APP}`);

console.log(`[Multi-App] Available apps count: ${Object.keys(availableApps).length}`);
if (Object.keys(availableApps).length > 0) {
    console.log(`[Multi-App] Available apps: ${Object.keys(availableApps).join(', ')}`);
}

// Log API configuration for all apps
console.log(`[API Config] All apps will use global DeepSeek configuration`);
if (DEEPSEEK_API_KEY) {
    console.log(`[API Config] ✅ DeepSeek API key configured: ${DEEPSEEK_API_KEY.substring(0, 10)}...`);
    console.log(`[API Config] All ${Object.keys(availableApps).length} apps will use DeepSeek API`);
} else {
    console.error(`[API Config] ❌ ERROR: DEEPSEEK_API_KEY not configured!`);
    console.error(`[API Config] Please set DEEPSEEK_API_KEY in the global .env file`);
}

// Fallback voor Vercel: probeer verschillende locaties
let rootDir = monorepoRoot;
if (process.env.VERCEL && process.env.VERCEL_ROOT_DIR) {
    rootDir = process.env.VERCEL_ROOT_DIR;
    console.log(`[Monorepo] Using Vercel root directory: ${rootDir}`);
    // Probeer app directory te vinden
    if (!appDir) {
        const appsDir = path.join(rootDir, 'apps');
        if (fs.existsSync(appsDir)) {
            const apps = fs.readdirSync(appsDir).filter(d => 
                d !== 'core' && fs.statSync(path.join(appsDir, d)).isDirectory()
            );
            if (apps.length > 0) {
                // Use first available app
                appDir = path.join(appsDir, apps[0]);
                console.log(`[Monorepo] Found app directory: ${appDir}`);
            }
        }
    }
    } else {
    console.log(`[Monorepo] Root: ${monorepoRoot}`);
    console.log(`[Monorepo] Core: ${coreDir}`);
    console.log(`[Monorepo] App: ${appDir}`);
    console.log(`[Monorepo] Game: ${gameDir}`);
}

// Verifieer dat directories bestaan en bepaal appDir als het nog niet is ingesteld
if (!appDir || !fs.existsSync(appDir)) {
    if (appDir) {
        console.warn(`[Monorepo] ⚠️ App directory not found: ${appDir}`);
    }
    console.warn(`[Monorepo] Looking for apps in: ${path.join(monorepoRoot, 'apps')}`);
    const appsDir = path.join(monorepoRoot, 'apps');
    if (fs.existsSync(appsDir)) {
        const apps = fs.readdirSync(appsDir).filter(f => 
            fs.statSync(path.join(appsDir, f)).isDirectory()
        );
        console.warn(`[Monorepo] Available apps: ${apps.join(', ')}`);
        if (apps.length > 0) {
            appDir = path.join(appsDir, apps[0]);
            console.log(`[Monorepo] Using first available app: ${appDir}`);
        } else {
            console.error(`[Monorepo] ❌ No apps found in ${appsDir}`);
        }
    } else {
        console.error(`[Monorepo] ❌ Apps directory not found: ${appsDir}`);
    }
}

// ============================================
// STATIC FILE SERVING - MONOREPO STRUCTURE
// ============================================

// Expliciete route voor /core/* bestanden (voor Vercel serverless)
// Dit zorgt ervoor dat bestanden correct worden geserveerd met juiste content-type
// Deze route moet VOOR de static middleware komen
// Express ondersteunt /core/* niet direct - gebruik regex of parameter
// Regex pattern: /^\/core\/.*$/ matcht alle paden die beginnen met /core/
app.get(/^\/core\/.*$/, (req, res, next) => {
    console.log(`[Core Route] ✅✅✅ Route matched for: ${req.path}`);
    console.log(`[Core Route] Request method: ${req.method}`);
    console.log(`[Core Route] Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    const filePath = req.path.replace(/^\/core\//, ''); // Verwijder /core/ prefix
    console.log(`[Core Route] Extracted file path: ${filePath}`);
    console.log(`[Core Route] coreDir: ${coreDir}`);
    console.log(`[Core Route] rootDir: ${rootDir}`);
    console.log(`[Core Route] monorepoRoot: ${monorepoRoot}`);

    // Set no-cache headers voor JS bestanden
    if (filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    
    // Probeer verschillende paden (voor Vercel serverless)
    // Belangrijk: coreDir is packages/core, dus filePath moet relatief zijn vanaf daar
    const possiblePaths = [
        path.join(coreDir, filePath), // coreDir (packages/core) + filePath
        path.join('/var/task', 'packages', 'core', filePath), // Vercel default
        path.join(rootDir, 'packages', 'core', filePath), // Vercel rootDir
        path.join(monorepoRoot, 'packages', 'core', filePath), // Monorepo root
    ];
    
    // DEBUG: Log welke bestanden wel beschikbaar zijn in coreDir
    if (!fs.existsSync(possiblePaths[0])) {
        console.log(`[Core Route] DEBUG: Checking what files exist in coreDir: ${coreDir}`);
        try {
            const coreDirContents = fs.readdirSync(coreDir);
            console.log(`[Core Route] DEBUG: Files in coreDir (first 20):`, coreDirContents.slice(0, 20));

            // Check if js directory exists
            const jsDir = path.join(coreDir, 'js');
            if (fs.existsSync(jsDir)) {
                const jsDirContents = fs.readdirSync(jsDir);
                console.log(`[Core Route] DEBUG: Files in coreDir/js (first 20):`, jsDirContents.slice(0, 20));
            } else {
                console.log(`[Core Route] DEBUG: js directory does not exist in coreDir`);
            }
        } catch (e) {
            console.error(`[Core Route] DEBUG: Error reading coreDir:`, e.message);
        }
    }
    
    let foundPath = null;
    for (const possiblePath of possiblePaths) {
        console.log(`[Core Route] Checking path: ${possiblePath}`);
        if (fs.existsSync(possiblePath)) {
            // Extra check: lees eerste regel om te verifiëren dat het geen server.js is
            try {
                const firstLine = fs.readFileSync(possiblePath, 'utf8').split('\n')[0];
                console.log(`[Core Route] First line of ${possiblePath}: ${firstLine.substring(0, 100)}`);
                if (firstLine.includes('const path = require') || firstLine.includes('const express = require')) {
                    console.error(`⚠️ WARNING: File appears to be server-side code: ${possiblePath}`);
                    console.error(`First line: ${firstLine.substring(0, 100)}`);
                    // Skip dit pad en probeer volgende
                    continue;
                }
            } catch (e) {
                console.error(`⚠️ Could not read file for check: ${possiblePath}`, e.message);
                // Kan bestand niet lezen, skip check maar gebruik het pad wel
            }
            
            foundPath = possiblePath;
            console.log(`✅ Found file at: ${foundPath}`);
            break;
        } else {
            console.log(`❌ Path does not exist: ${possiblePath}`);
        }
    }
    
    if (foundPath) {
        // Lees bestand en controleer of het client-side JavaScript is
        try {
            const fileContent = fs.readFileSync(foundPath, 'utf8');
            
            // Check of bestand server-side code bevat (mag niet in browser)
            // Check voor Node.js require statements (zonder browser check)
            const hasNodeRequire = /const\s+\w+\s*=\s*require\s*\(/.test(fileContent) && 
                                   !fileContent.includes('if (typeof require') &&
                                   !fileContent.includes('typeof require');
            
            // Check voor express (server-side only)
            const hasExpress = fileContent.includes('const express = require') || 
                              fileContent.includes('require(\'express\')');
            
            // Check voor path module (server-side only, tenzij het een browser-compatibele check heeft)
            const hasPathRequire = fileContent.includes('require(\'path\')') || 
                                  fileContent.includes('require("path")');
            
            if (hasNodeRequire || hasExpress || hasPathRequire) {
                console.error(`❌ ERROR: File contains server-side code: ${foundPath}`);
                console.error(`File size: ${fileContent.length} chars`);
                console.error(`First 500 chars: ${fileContent.substring(0, 500)}`);
                console.error(`Has Node require: ${hasNodeRequire}, Has Express: ${hasExpress}, Has Path: ${hasPathRequire}`);
                // Expliciete error met JS comment om te voorkomen dat browser server-code uitvoert
                return res.status(500)
                          .setHeader('Content-Type', 'application/javascript; charset=utf-8')
                          .send(`// Error: File contains server-side code and cannot be served to browser\n// File: ${foundPath}\n// This file should only contain client-side JavaScript\n// Check Vercel deployment logs for details.`);
            }
            
            console.log(`✅ Verified client-side JavaScript: /core/${filePath} (${fileContent.length} chars)`);
            console.log(`First 3 lines of file:`);
            const firstLines = fileContent.split('\n').slice(0, 3);
            firstLines.forEach((line, idx) => {
                console.log(`  Line ${idx + 1}: ${line.substring(0, 100)}`);
            });
            
            // Serveer bestand als string (niet via sendFile om controle te hebben)
            res.send(fileContent);
        } catch (readError) {
            console.error(`Error reading /core/${filePath}:`, readError);
            console.error(`Error details:`, readError.message, readError.stack);
            // Fallback naar sendFile met error handling
            res.sendFile(foundPath, (err) => {
                if (err) {
                    console.error(`Error serving /core/${filePath} via sendFile:`, err);
                    // Expliciete error response om browser executie te voorkomen
                    res.status(500)
                       .setHeader('Content-Type', 'application/javascript; charset=utf-8')
                       .send(`// Error: Could not serve file /core/${filePath}\n// Error: ${err.message}\n// Check Vercel deployment logs for details.`);
                }
            });
        }
    } else {
        console.error(`❌ /core/${filePath} not found. Tried:`, possiblePaths);
        console.error(`coreDir: ${coreDir}, rootDir: ${rootDir}, monorepoRoot: ${monorepoRoot}`);
        // Expliciete 404 met JS comment om te voorkomen dat browser server-code probeert uit te voeren
        res.status(404)
           .setHeader('Content-Type', 'application/javascript; charset=utf-8')
           .send(`// Error: Core file not found: /core/${filePath}\n// This file should be in packages/core/${filePath}\n// Check Vercel deployment logs for path resolution details.`);
    }
});

// Serveer /core/* routes vanuit packages/core/ (fallback voor lokale development)
// BELANGRIJK: In Vercel serverless wordt de expliciete route hierboven gebruikt
// Deze static middleware is alleen voor lokale development
if (!process.env.VERCEL) {
    app.use('/core', express.static(coreDir, {
        index: false,
        dotfiles: 'ignore',
        etag: true,
        lastModified: true,
        maxAge: '1y'
    }));
}

// Serveer /game/* routes vanuit game/ (root)
if (fs.existsSync(gameDir)) {
    app.use('/game', express.static(gameDir, {
        index: false,
        dotfiles: 'ignore',
        etag: true,
        lastModified: true,
        maxAge: '1y'
    }));
}

// ============================================
// MULTI-APP ROUTING
// ============================================
// Helper functie om bestanden uit een specifieke app directory te serveren
function serveFromApp(appName, filePath, res, next) {
    const targetAppDir = availableApps[appName];
    if (!targetAppDir) {
        return res.status(404).json({ error: `App '${appName}' not found` });
    }
    
    const fullPath = path.join(targetAppDir, filePath);
    if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath, (err) => {
            if (err) {
                console.error(`[Multi-App] Error serving ${filePath} from ${appName}:`, err);
                next(err);
            }
        });
    } else {
        res.status(404).json({ error: `File not found in app '${appName}': ${filePath}` });
    }
}

// Multi-app routes: /app-name/* voor elke app
// EERST: Routes voor /apps/{appName}/* (voor backward compatibility)
if (Object.keys(availableApps).length > 0) {
    Object.keys(availableApps).forEach(appName => {
        const appDir = availableApps[appName];
        
        // Route voor /apps/{appName}/ index.html
        app.get(`/apps/${appName}/`, (req, res, next) => {
            console.log(`[Multi-App Route] GET ${req.path} -> serving index.html from ${appName} (via /apps/ prefix)`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            serveFromApp(appName, 'index.html', res, next);
        });
        
        // Route voor /apps/{appName}/*.html bestanden
        app.get(new RegExp(`^/apps/${appName}/.*\\.html$`), (req, res, next) => {
            const fileName = req.path.replace(`/apps/${appName}/`, '');
            console.log(`[Multi-App Route] GET ${req.path} -> serving ${fileName} from ${appName} (via /apps/ prefix)`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor /apps/{appName}/*.json bestanden (content)
        app.get(new RegExp(`^/apps/${appName}/.*\\.json$`), (req, res, next) => {
            const fileName = req.path.replace(`/apps/${appName}/`, '');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor /apps/{appName}/*.js bestanden (skip /core/ routes)
        app.get(new RegExp(`^/apps/${appName}/.*\\.js$`), (req, res, next) => {
            console.log(`[Multi-App Route] GET ${req.path} -> serving JS file from ${appName} (via /apps/ prefix)`);
            // Skip /core/ routes
            if (req.path.includes('/core/')) {
                console.log(`[Multi-App Route] Skipping /core/ route: ${req.path}`);
                return next();
            }
            const fileName = req.path.replace(`/apps/${appName}/`, '');
            console.log(`[Multi-App Route] Extracted fileName: ${fileName} from path: ${req.path}`);
            const targetAppDir = availableApps[appName];
            const fullPath = path.join(targetAppDir, fileName);
            console.log(`[Multi-App Route] Full path: ${fullPath}, exists: ${fs.existsSync(fullPath)}`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor /apps/{appName}/assets/* bestanden
        app.get(`/apps/${appName}/assets/*`, (req, res, next) => {
            const fileName = req.path.replace(`/apps/${appName}/`, '');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor /apps/{appName}/config.js
        app.get(`/apps/${appName}/config.js`, (req, res, next) => {
            const configPath = path.join(availableApps[appName], 'config.js');
            if (fs.existsSync(configPath)) {
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                res.sendFile(configPath, (err) => {
                    if (err) {
                        generateDynamicConfig(res);
                    }
                });
            } else {
                generateDynamicConfig(res);
            }
        });
        
        // Static file serving voor /apps/{appName}/* (fallback voor andere bestanden)
        app.use(`/apps/${appName}`, express.static(appDir, {
            index: false,
            dotfiles: 'ignore',
            etag: true,
            lastModified: true,
            maxAge: '1y'
        }));
    });
}

// DAN: Routes voor /{appName}/* (zonder /apps/ prefix) - alleen als MULTI_APP_MODE enabled is
if (MULTI_APP_MODE && Object.keys(availableApps).length > 0) {
    console.log(`[Multi-App] 🚀 Multi-app mode enabled. Apps available at:`);
    Object.keys(availableApps).forEach(appName => {
        const appDir = availableApps[appName];
        console.log(`[Multi-App]   - http://localhost:${PORT}/${appName}/`);
        console.log(`[Multi-App]   - http://localhost:${PORT}/apps/${appName}/`);
        
        // Route voor app index.html
        app.get(`/${appName}/`, (req, res, next) => {
            
            console.log(`[Multi-App Route] GET ${req.path} -> serving index.html from ${appName}`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            serveFromApp(appName, 'index.html', res, next);
        });
        
        // Route voor app HTML bestanden
        app.get(new RegExp(`^/${appName}/.*\\.html$`), (req, res, next) => {
            const fileName = req.path.replace(`/${appName}/`, '');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor app JSON bestanden (content)
        app.get(new RegExp(`^/${appName}/.*\\.json$`), (req, res, next) => {
            const fileName = req.path.replace(`/${appName}/`, '');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor app JavaScript bestanden (skip /core/ routes)
        app.get(new RegExp(`^/${appName}/.*\\.js$`), (req, res, next) => {
            // Skip /core/ routes
            if (req.path.includes('/core/')) {
                return next();
            }
            const fileName = req.path.replace(`/${appName}/`, '');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor app assets (images, documents, etc.)
        app.get(`/${appName}/assets/*`, (req, res, next) => {
            const fileName = req.path.replace(`/${appName}/`, '');
            serveFromApp(appName, fileName, res, next);
        });
        
        // Route voor app config.js
        app.get(`/${appName}/config.js`, (req, res, next) => {
            const configPath = path.join(availableApps[appName], 'config.js');
            if (fs.existsSync(configPath)) {
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                res.sendFile(configPath, (err) => {
                    if (err) {
                        generateDynamicConfig(res);
                    }
                });
            } else {
                generateDynamicConfig(res);
            }
        });
        
        // Static file serving voor app directory (fallback voor andere bestanden)
        // BELANGRIJK: Dit moet NA de specifieke routes komen
        app.use(`/${appName}`, express.static(appDir, {
            index: false,
            dotfiles: 'ignore',
            etag: true,
            lastModified: true,
            maxAge: '1y'
        }));
    });
    
    // Root route: toon app selector in multi-app mode
    app.get('/', (req, res, next) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        const appList = Object.keys(availableApps).map(appName => {
            const appPath = `/${appName}/`;
            return `<li><a href="${appPath}" style="color: #0077b6; text-decoration: none; font-size: 1.2em;">${appName}</a></li>`;
        }).join('\n        ');
        
        const html = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Learning Apps</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #0077b6;
            border-bottom: 3px solid #0077b6;
            padding-bottom: 10px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        li:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        a:hover {
            text-decoration: underline !important;
        }
    </style>
</head>
<body>
    <h1>📚 Beschikbare E-Learning Apps</h1>
    <p>Kies een app om te openen:</p>
    <ul>
        ${appList}
    </ul>
    <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
        💡 Tip: Je kunt ook direct naar <code>http://localhost:${PORT}/app-naam/</code> navigeren
    </p>
</body>
</html>`;
        res.send(html);
    });
} else {
    // Single-app mode: serveer default app op root
    // Serveer index.html voor root route (vanuit app directory)
    app.get('/', (req, res, next) => {
        // Set no-cache headers
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Eerst proberen: gebruik in-memory cache (voor Vercel serverless)
        if (global.htmlFilesCache && global.htmlFilesCache['index.html']) {
            console.log(`✅ Serving index.html from memory cache`);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(global.htmlFilesCache['index.html']);
        }
        
        // Serveer vanuit app directory
        const indexPath = path.join(appDir, 'index.html');
        console.log(`[Monorepo] Serving index.html from: ${indexPath}`);
        console.log(`[Monorepo] appDir exists: ${fs.existsSync(appDir)}`);
        console.log(`[Monorepo] index.html exists: ${fs.existsSync(indexPath)}`);
        
        if (!fs.existsSync(indexPath)) {
            console.error(`[Monorepo] ❌ index.html not found at: ${indexPath}`);
            console.error(`[Monorepo] appDir: ${appDir}`);
            console.error(`[Monorepo] monorepoRoot: ${monorepoRoot}`);
            return res.status(404).json({ 
                error: 'index.html not found',
                appDir: appDir,
                indexPath: indexPath,
                appDirExists: fs.existsSync(appDir)
            });
        }
        
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('[Monorepo] Error serving index.html:', err);
                next(err);
            }
        });
    });
}

// Serveer game/index.html expliciet (vanuit game directory)
app.get('/game/index.html', (req, res, next) => {
    const filePath = path.join(gameDir, 'index.html');
    console.log(`[Monorepo] Attempting to serve game/index.html from: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
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

    const filePath = path.join(gameDir, 'assets', filename);
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
    const filePath = path.join(gameDir, 'vite.svg');
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
    
    // Set no-cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Eerst proberen: gebruik in-memory cache (voor Vercel serverless)
    if (global.htmlFilesCache && global.htmlFilesCache[fileName]) {
        console.log(`✅ Serving ${fileName} from memory cache`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(global.htmlFilesCache[fileName]);
    }
    
    // Fallback: probeer bestand van disk te lezen (vanuit app directory)
    const filePath = path.join(appDir, fileName);
    console.log(`[Monorepo] Attempting to serve from disk: ${fileName}`);
    console.log(`[Monorepo] filePath: ${filePath}`);
    
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

/**
 * Genereer dynamische config.js op basis van environment variables
 * Dit voorkomt 404 errors op Vercel waar config.js niet in de repo staat
 */
function generateDynamicConfig(res) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    
    // API key is no longer exposed to client (server-side only for security)
    // DeepSeek API calls are handled server-side only
    
    console.log('Generating dynamic config.js (API key server-side only)');
    
    // Genereer config.js content (no API key exposed to client)
    const configContent = `// Dynamically generated config.js
// API keys are handled server-side only for security
// All AI API calls go through /api/generate-questions endpoint

window.AppConfig = {
    // API key is no longer exposed to client
    // All API calls are handled server-side
};
`;
    
    res.send(configContent);
}

// Expliciete route voor config.js (MOET VOOR static middleware komen!)
// Op Vercel wordt config.js dynamisch gegenereerd op basis van environment variables
app.get('/config.js', (req, res, next) => {
    const possiblePaths = [
        path.join(appDir, 'config.js'),
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
        // Lokaal bestand bestaat, serveer dat
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error('Error serving config.js:', err);
                // Fallback naar dynamische config
                generateDynamicConfig(res);
            }
        });
    } else {
        // Geen lokaal bestand gevonden, genereer dynamische config op basis van environment variables
        // Dit is nodig voor Vercel deployment waar config.js niet in de repo staat
        console.log('No config.js file found, generating dynamic config from environment variables');
        generateDynamicConfig(res);
    }
});

// Expliciete route voor JSON bestanden (content files) - VOOR static middleware om caching te voorkomen
app.get(/\.json$/, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. content/week2.content.json
    // Content bestanden staan in app directory
    const filePath = path.join(appDir, fileName);
    
    // Set no-cache headers om te voorkomen dat browser oude versies cached
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.removeHeader('ETag'); // Verwijder ETag om 304 responses te voorkomen
    res.removeHeader('Last-Modified'); // Verwijder Last-Modified om 304 responses te voorkomen
    
    // Probeer verschillende paden (app directory eerst, dan fallbacks)
    const possiblePaths = [
        filePath, // App directory (monorepo)
        path.join(rootDir, fileName), // Fallback: root directory
        path.join('/var/task', fileName), // Vercel fallback
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

// Serve static files vanuit app directory (assets, etc.)
// Belangrijk: JavaScript bestanden moeten beschikbaar zijn voor de HTML pagina's
app.use(express.static(appDir, { 
    index: false, // We handlen index.html expliciet
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    maxAge: '1y' // Cache static files for 1 year
}));

// Expliciete route voor /apps/pages/*.js bestanden (zonder appName in pad)
// Dit handelt requests af zoals /apps/pages/VraagvoorspellingDeel1LessonPage.js
// door alle apps te doorzoeken
app.get(/^\/apps\/pages\/.*\.js$/, (req, res, next) => {
    const fileName = req.path.replace(/^\/apps\//, ''); // bijv. pages/VraagvoorspellingDeel1LessonPage.js
    console.log(`[Multi-App Route] GET ${req.path} -> searching all apps for ${fileName}`);
    
    // Zoek in alle apps
    let foundPath = null;
    let foundApp = null;
    
    for (const [appName, appDir] of Object.entries(availableApps)) {
        const fullPath = path.join(appDir, fileName);
        if (fs.existsSync(fullPath)) {
            foundPath = fullPath;
            foundApp = appName;
            console.log(`[Multi-App Route] ✅ Found ${fileName} in app: ${appName}`);
            break;
        }
    }
    
    if (foundPath) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.sendFile(foundPath, (err) => {
            if (err) {
                console.error(`[Multi-App Route] Error serving ${fileName} from ${foundApp}:`, err);
                next(err);
            }
        });
    } else {
        console.error(`[Multi-App Route] ❌ JS file not found in any app: ${fileName}`);
        res.status(404).send(`// File not found: ${fileName}`);
    }
});

// Expliciete route voor JavaScript bestanden (fallback als static middleware faalt)
// App-specifieke JS bestanden (pages/Week*LessonPage.js, js/PDFExporter.js, etc.)
app.get(/\.js$/, (req, res, next) => {
    // Skip /core/ routes (die worden al gehandeld door /core static middleware)
    if (req.path.startsWith('/core/')) {
        return next();
    }
    
    // Skip /apps/ routes (die worden al gehandeld door specifieke routes hierboven)
    if (req.path.startsWith('/apps/')) {
        return next();
    }
    
    const fileName = req.path.replace(/^\//, ''); // bijv. pages/Week2LessonPage.js
    // App-specifieke JS bestanden staan in app directory
    const filePath = path.join(appDir, fileName);
    
    // Set no-cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Probeer verschillende paden (app directory eerst)
    const possiblePaths = [
        filePath, // App directory (monorepo)
        path.join(rootDir, fileName), // Fallback: root directory
        path.join('/var/task', fileName), // Vercel fallback
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

// Serve static files vanuit app directory (CSS, images, etc.) - maar NIET HTML en NIET JSON (die handlen we hierboven)
// Belangrijk: JavaScript bestanden moeten beschikbaar zijn voor de HTML pagina's
app.use(express.static(appDir, { 
    index: false, // We handlen index.html expliciet
    dotfiles: 'ignore',
    etag: true,
    lastModified: true,
    maxAge: '1y' // Cache static files for 1 year
}));

// Expliciete route voor afbeeldingen en andere assets - NA static middleware als fallback
app.get(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|docx|pdf|xlsx|vsdx)$/i, (req, res, next) => {
    const fileName = req.path.replace(/^\//, ''); // bijv. assets/images/Praktijkprobleem.png
    // Assets staan in app directory
    const filePath = path.join(appDir, fileName);
    
    // Probeer verschillende paden (app directory eerst)
    const possiblePaths = [
        filePath, // App directory (monorepo)
        path.join(rootDir, fileName), // Fallback: root directory
        path.join('/var/task', fileName), // Vercel fallback
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
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.pdf': 'application/pdf',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.vsdx': 'application/vnd.ms-visio.drawing.main+xml'
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
    // Log alle 404 requests voor debugging
    if (req.path.startsWith('/core/')) {
        console.error(`[404 Handler] ❌ /core/* request reached 404 handler: ${req.method} ${req.path}`);
        console.error(`[404 Handler] This means the /core/* route was NOT matched!`);
        console.error(`[404 Handler] Request details:`, {
            method: req.method,
            path: req.path,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl
        });
        // Geef JS-comment response om browser executie te voorkomen
        res.status(404)
           .setHeader('Content-Type', 'application/javascript; charset=utf-8')
           .send(`// Error: /core/* route not matched for ${req.path}\n// Check Vercel deployment logs for route matching issues.`);
    } else {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} niet gevonden`
    });
    }
});

// Export voor Vercel serverless
module.exports = app;

// Start server alleen lokaal (niet op Vercel)
if (require.main === module) {
    const server = app.listen(PORT, async () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 DeepSeek API Key configured: ${!!DEEPSEEK_API_KEY ? '✅ Yes' : '❌ No'}`);
        console.log(`🔒 Security: Helmet, Rate Limiting, CORS, Input Validation enabled`);
        console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
        if (!DEEPSEEK_API_KEY) {
            console.log(`⚠️  Please set DEEPSEEK_API_KEY in .env file`);
            console.log(`   Get your API key at: https://platform.deepseek.com/api_keys`);
        }
        
        if (MULTI_APP_MODE) {
            console.log(`\n📚 Multi-App Mode: Alle apps beschikbaar op:`);
            Object.keys(availableApps).forEach(appName => {
                console.log(`   - http://localhost:${PORT}/${appName}/`);
            });
            console.log(`\n   Root: http://localhost:${PORT}/ (app selector)`);
        } else {
            console.log(`\n📚 Single-App Mode: App beschikbaar op:`);
            if (appDir) {
                const appName = path.basename(appDir);
                console.log(`   - http://localhost:${PORT}/ (${appName})`);
            } else {
                console.log(`   - http://localhost:${PORT}/`);
            }
            console.log(`\n   💡 Tip: Zet MULTI_APP=true om alle apps te zien`);
        }
        
        console.log(`🔧 API endpoint: http://localhost:${PORT}/api/generate-questions`);
        
        // DeepSeek doesn't need model caching (uses fixed model: deepseek-chat)
        if (DEEPSEEK_API_KEY) {
            console.log('[DeepSeek] ✅ API ready - using model: deepseek-chat');
        }
    });

    // Graceful shutdown voor nodemon herstart
    process.on('SIGTERM', () => {
        console.log('\n🛑 SIGTERM received, shutting down gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('\n🛑 SIGINT received, shutting down gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
}

