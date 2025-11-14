/**
 * Server-side Proxy voor Google Gemini API
 * 
 * Deze server handelt Gemini API calls af om CORS-problemen te voorkomen
 * en API keys veilig te beheren.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// API Key validation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
 * Proxy endpoint voor Gemini API generateContent
 * POST /api/generate-questions
 * Body: { theoryContent: string, numberOfQuestions: number }
 */
app.post('/api/generate-questions', async (req, res) => {
    try {
        // Check if API key is set
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'GEMINI_API_KEY is not set in server environment'
            });
        }

        // Get request body
        const { theoryContent, numberOfQuestions = 3, segmentIndex = 0 } = req.body;

        // Validate input
        if (!theoryContent || typeof theoryContent !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'theoryContent is required and must be a string'
            });
        }

        if (theoryContent.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'theoryContent cannot be empty'
            });
        }

        // Build prompt for Gemini
        // Use segment-based approach for variety (no hardcoded topics)
        const segmentInfo = segmentIndex !== undefined ? ` (Dit is segment ${segmentIndex + 1} van de theorie tekst)` : '';
        
        const prompt = `Genereer ${numberOfQuestions} multiple choice vraag${numberOfQuestions > 1 ? 'en' : ''} in het Nederlands op basis van de volgende theorie tekst.${segmentInfo}

BELANGRIJK: 
- Zorg ervoor dat de vraag over een specifiek aspect/concept uit DEZE DEEL van de theorie gaat.
- Gebruik informatie uit dit specifieke deel van de theorie tekst voor je vraag.
- Als je meerdere vragen genereert, zorg dat ze over verschillende aspecten/concepten uit dit deel gaan.

Elke vraag moet:
- Een duidelijke vraag bevatten over een specifiek aspect/concept uit deze deel van de theorie
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
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Export voor Vercel serverless
module.exports = app;

// Start server alleen lokaal (niet op Vercel)
if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 API Key configured: ${!!GEMINI_API_KEY ? '✅ Yes' : '❌ No'}`);
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

