/**
 * AIGenerator
 * 
 * GenAI integratie voor het genereren van MC vragen op basis van theorie content
 * Gebruikt server-side proxy om CORS-problemen te voorkomen
 */

class AIGenerator {
    constructor(apiKey = null) {
        // Use server-side proxy instead of direct API calls
        // Detect environment (Vercel vs localhost)
        const hostname = window.location.hostname;
        const currentPort = window.location.port;
        const isVercel = hostname.includes('vercel.app') || hostname.includes('vercel.com');
        
        if (isVercel) {
            // On Vercel, always use relative URL (same origin)
            this.proxyUrl = '/api/generate-questions';
            console.log('[AIGenerator] Detected Vercel environment, using relative URL');
        } else if (currentPort && currentPort !== '3000') {
            // We're on a different port (e.g., Live Server on 5500), use absolute URL to port 3000
            this.proxyUrl = 'http://localhost:3000/api/generate-questions';
            console.log('[AIGenerator] Detected different port (' + currentPort + '), using absolute URL to port 3000');
        } else {
            // Use relative URL (works when served from port 3000 or same origin)
            this.proxyUrl = '/api/generate-questions';
            console.log('[AIGenerator] Using relative URL for API calls');
        }
        // API key is not needed on client-side anymore (handled by server)
        this.apiKey = apiKey;
    }

    /**
     * Genereer MC vragen op basis van theorie content
     * @param {string} theoryContent - De theorie tekst waar vragen over gemaakt moeten worden
     * @param {number} numberOfQuestions - Aantal vragen om te genereren
     * @param {number} segmentIndex - Index van het tekstsegment dat gebruikt moet worden (voor variatie)
     * @returns {Promise<Array>} Array van vraag objecten
     */
    async generateMCQuestions(theoryContent, numberOfQuestions = 3, segmentIndex = 0) {
        if (!theoryContent || typeof theoryContent !== 'string' || theoryContent.trim().length === 0) {
            throw new Error('Theory content is required and cannot be empty');
        }

        try {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIGenerator.js:45',message:'generateMCQuestions called',data:{proxyUrl:this.proxyUrl,hostname:window.location.hostname,isVercel:window.location.hostname.includes('vercel.app'),theoryLength:theoryContent.length,numberOfQuestions,segmentIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            console.log('[AIGenerator] Generating questions via server-side proxy...');
            console.log('[AIGenerator] Theory content length:', theoryContent.length);
            console.log('[AIGenerator] Number of questions:', numberOfQuestions);
            console.log('[AIGenerator] Using segment index:', segmentIndex);

            // Call server-side proxy
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIGenerator.js:52',message:'Fetch API call starting',data:{url:this.proxyUrl,method:'POST'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    theoryContent: theoryContent,
                    numberOfQuestions: numberOfQuestions,
                    segmentIndex: segmentIndex
                })
            });

            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3786c95-41b3-4b01-b09b-5015343364c5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIGenerator.js:64',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,url:response.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            console.log('[AIGenerator] Response status:', response.status);

            // Clone response to read it multiple times if needed
            const responseClone = response.clone();
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // If JSON parsing fails, read as text
                    const errorText = await responseClone.text();
                    errorData = { message: errorText };
                }
                console.error('[AIGenerator] ❌ Server error:', errorData);
                console.error('[AIGenerator] Response status:', response.status);
                console.error('[AIGenerator] Response statusText:', response.statusText);
                console.error('[AIGenerator] Request URL:', this.proxyUrl);
                console.error('[AIGenerator] Hostname:', window.location.hostname);
                
                // Check for QUOTA_EXCEEDED error
                if (response.status === 429 || (errorData && errorData.error === 'QUOTA_EXCEEDED')) {
                    const quotaError = new Error('QUOTA_EXCEEDED');
                    quotaError.quotaExceeded = true;
                    throw quotaError;
                }
                
                throw new Error(`Server error: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('[AIGenerator] Server response:', data);

            // Check if response is successful
            if (!data.success) {
                // Check if it's a QUOTA_EXCEEDED error
                if (data.error === 'QUOTA_EXCEEDED') {
                    const quotaError = new Error('QUOTA_EXCEEDED');
                    quotaError.quotaExceeded = true;
                    throw quotaError;
                }
                throw new Error(data.message || 'Server returned unsuccessful response');
            }

            // Validate and return questions
            if (data.vragen && Array.isArray(data.vragen) && data.vragen.length > 0) {
                console.log(`[AIGenerator] Successfully received ${data.vragen.length} questions`);
                return data.vragen;
            } else {
                throw new Error('Server response does not contain valid vragen array');
            }
            
        } catch (error) {
            console.error('[AIGenerator] ❌ Error generating MC questions:', error);
            console.error('[AIGenerator] Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 500),
                hostname: window.location.hostname,
                isVercel: window.location.hostname.includes('vercel.app'),
                proxyUrl: this.proxyUrl
            });
            
            // Provide user-friendly error messages
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
                const isVercel = window.location.hostname.includes('vercel.app');
                console.error('[AIGenerator] Network/CORS error detected');
                if (isVercel) {
                    throw new Error('Kan niet verbinden met de API server. Controleer of GEMINI_API_KEY is ingesteld in Vercel environment variables. Fout: ' + error.message);
                } else {
                    throw new Error('Kan niet verbinden met de server. Zorg ervoor dat de server draait op http://localhost:3000. Fout: ' + error.message);
                }
            } else if (error.message.includes('Server error')) {
                throw error; // Already formatted
            } else {
                throw new Error(`Fout bij AI vraag generatie: ${error.message || error.toString()}`);
            }
        }
    }

    /**
     * Extract text content from theory content array
     * Returns ALL text (no truncation) - segmentation happens in getTheorySegment
     * @param {Array} theoryContent - Array van content items
     * @returns {string} Plain text extractie (volledige tekst)
     */
    extractTheoryText(theoryContent) {
        if (!Array.isArray(theoryContent)) {
            return '';
        }

        // Extract text from all paragraph items - return ALL text
        const allText = theoryContent
            .filter(item => item.type === 'paragraph' && item.text)
            .map(item => {
                if (Array.isArray(item.text)) {
                    return item.text
                        .map(text => {
                            // Remove HTML tags and clean text
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = text;
                            return tempDiv.textContent || tempDiv.innerText || '';
                        })
                        .join(' ');
                }
                return item.text;
            })
            .join(' ');

        // Return ALL text - segmentation will happen in getTheorySegment
        return allText;
    }

    /**
     * Get a specific segment of theory text for variety
     * Creates MORE segments (8-12) for better variety
     * Uses smaller segment sizes to ensure questions cover different parts of the text
     * @param {string} theoryContent - Full theory text
     * @param {number} segmentIndex - Which segment to return (0, 1, 2, etc.)
     * @param {number} maxLength - Maximum length per segment
     * @returns {string} Segment of theory text
     */
    getTheorySegment(theoryContent, segmentIndex = 0, maxLength = 8000) {
        const totalLength = theoryContent.length;
        
        // Create MORE segments for better variety
        // Target: 8-12 segments for good coverage
        let segmentSize, numSegments, overlap;
        
        if (totalLength <= 8000) {
            // Short text: divide into 8 segments (~1000 chars each)
            numSegments = 8;
            segmentSize = Math.max(1000, Math.floor(totalLength / numSegments));
            overlap = Math.floor(segmentSize * 0.1); // 10% overlap for context
        } else if (totalLength <= 16000) {
            // Medium text: divide into 10 segments (~1500 chars each)
            numSegments = 10;
            segmentSize = Math.max(1500, Math.floor(totalLength / numSegments));
            overlap = Math.floor(segmentSize * 0.1); // 10% overlap
        } else {
            // Long text: divide into 12 segments (~2000 chars each)
            numSegments = 12;
            segmentSize = Math.max(2000, Math.floor(totalLength / numSegments));
            overlap = Math.floor(segmentSize * 0.1); // 10% overlap
        }
        
        // Ensure we have at least 6 segments for short texts
        if (numSegments < 6) {
            numSegments = 6;
            segmentSize = Math.floor(totalLength / numSegments);
            overlap = Math.floor(segmentSize * 0.1);
        }
        
        // Use shuffled order to avoid always starting at beginning
        const shuffledIndex = this.getShuffledSegmentIndex(segmentIndex, numSegments);
        
        // Calculate start and end positions with overlap
        const effectiveSegmentSize = segmentSize - overlap;
        let start = shuffledIndex * effectiveSegmentSize;
        let end = Math.min(start + segmentSize, totalLength);
        
        // Ensure we don't start before beginning or after end
        if (start < 0) start = 0;
        if (start >= totalLength) {
            // If we're past the end, use the last segment
            start = Math.max(0, totalLength - segmentSize);
            end = totalLength;
        }
        
        // Get segment
        let segment = theoryContent.substring(start, end);
        
        // Add context indicators if not at start
        if (start > 0) {
            const segmentNumber = shuffledIndex + 1;
            segment = `[Deel ${segmentNumber} van ${numSegments} delen van de theorie] ${segment}`;
        }
        
        // Ensure we don't exceed max length
        if (segment.length > maxLength) {
            segment = segment.substring(0, maxLength);
        }
        
        return segment;
    }
    
    /**
     * Get total number of segments for a given theory content
     * This helps with tracking and LRU management
     * @param {string} theoryContent - Full theory text
     * @returns {number} Total number of segments
     */
    getTotalSegments(theoryContent) {
        const totalLength = theoryContent.length;
        
        if (totalLength <= 8000) {
            return 8;
        } else if (totalLength <= 16000) {
            return 10;
        } else {
            return 12;
        }
    }

    /**
     * Get shuffled segment index for variety
     * Creates a pseudo-random but deterministic mapping to avoid always using segment 0
     * @param {number} segmentIndex - Sequential segment index
     * @param {number} numSegments - Total number of segments
     * @returns {number} Shuffled segment index
     */
    getShuffledSegmentIndex(segmentIndex, numSegments) {
        // Use a simple hash-like function to shuffle segment order
        // This ensures variety without true randomness (deterministic)
        const hash = (segmentIndex * 7919 + 137) % numSegments; // Prime numbers for better distribution
        return hash;
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIGenerator;
} else {
    window.AIGenerator = AIGenerator;
}
