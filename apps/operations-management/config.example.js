/**
 * Configuration Example
 * 
 * Kopieer dit bestand naar config.js en vul je API keys in.
 * config.js wordt niet gecommit naar Git (staat in .gitignore).
 */

window.AppConfig = {
    // Google Gemini API Key
    geminiApiKey: 'YOUR_API_KEY_HERE',
    
    // Navigatie configuratie (optioneel)
    // Pas de button teksten aan naar wens
    navigation: {
        // Buttons op lespagina's (onderaan de pagina)
        buttonTexts: {
            previous: 'Vorige',           // Standaard: "Vorige" of "Vorige: [titel]"
            next: 'Volgende',             // Standaard: "Volgende" of "Volgende: [titel]"
            backToStart: 'Terug naar Start' // Standaard: "Terug naar Start"
        },
        
        // Button op index pagina
        indexPage: {
            startButton: 'Start met de E-Learning' // Standaard: "Start met de E-Learning"
        }
    }
};



