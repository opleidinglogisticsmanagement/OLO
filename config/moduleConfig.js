/**
 * Module Configuration
 * 
 * Centrale configuratie voor alle modules in het e-learning platform
 * Dit is de single source of truth voor alle module data
 */

const MODULE_CONFIG = {
    // Algemene platform instellingen
    platform: {
        name: 'E-Learning Platform',
        subtitle: 'HBO Onderwijs',
        version: '1.0.0'
    },

    // Gebruiker informatie
    user: {
        name: 'Student Naam',
        role: 'HBO Student',
        email: 'student@hbo.nl'
    },

    // Alle modules met hun configuratie
    modules: [
        {
            id: 'week-1',
            title: 'Week 1',
            subtitle: 'Neuro-psycho-immunologie',
            lessons: [
                { title: 'Inleiding', href: 'week1.html' },
                { title: 'Theorie', href: 'week1.html' },
                { title: 'Quiz', href: 'week1.html' },
                { title: 'Reflectie', href: 'week1.html' }
            ]
        },
        {
            id: 'week-2',
            title: 'Week 2',
            subtitle: 'Logistiek & Duurzaamheid',
            lessons: [
                { title: 'Inleiding', href: 'week2.html' },
                { title: 'Theorie', href: 'week2.html' },
                { title: 'Case Study', href: 'week2.html' },
                { title: 'Quiz', href: 'week2.html' }
            ]
        },
        {
            id: 'week-3',
            title: 'Week 3',
            subtitle: 'Management & Leiderschap',
            lessons: [
                { title: 'Inleiding', href: 'week3.html' },
                { title: 'Theorie', href: 'week3.html' },
                { title: 'Opdrachten', href: 'week3.html' },
                { title: 'Quiz', href: 'week3.html' }
            ]
        },
        {
            id: 'week-4',
            title: 'Week 4',
            subtitle: 'Innovatie & Technologie',
            lessons: [
                { title: 'Inleiding', href: 'week4.html' },
                { title: 'Theorie', href: 'week4.html' },
                { title: 'Praktijk', href: 'week4.html' },
                { title: 'Evaluatie', href: 'week4.html' }
            ]
        },
        {
            id: 'week-5',
            title: 'Week 5',
            subtitle: 'Onderzoek & Methodologie',
            lessons: [
                { title: 'Inleiding', href: 'week5.html' },
                { title: 'Methoden', href: 'week5.html' },
                { title: 'Data Analyse', href: 'week5.html' },
                { title: 'Rapportage', href: 'week5.html' }
            ]
        },
        {
            id: 'week-6',
            title: 'Week 6',
            subtitle: 'Ethiek & Professionaliteit',
            lessons: [
                { title: 'Inleiding', href: 'week6.html' },
                { title: 'Ethische Principes', href: 'week6.html' },
                { title: 'Case Studies', href: 'week6.html' },
                { title: 'Reflectie', href: 'week6.html' }
            ]
        },
        {
            id: 'week-7',
            title: 'Week 7',
            subtitle: 'Integratie & Synthese',
            lessons: [
                { title: 'Inleiding', href: 'week7.html' },
                { title: 'Integratie', href: 'week7.html' },
                { title: 'Synthese', href: 'week7.html' },
                { title: 'Presentatie', href: 'week7.html' }
            ]
        },
        {
            id: 'afsluiting',
            title: 'Afsluiting',
            subtitle: 'Eindbeoordeling & Certificering',
            lessons: [
                { title: 'Eindtoets', href: 'afsluiting.html' },
                { title: 'Portfolio', href: 'afsluiting.html' },
                { title: 'Evaluatie', href: 'afsluiting.html' },
                { title: 'Certificaat', href: 'afsluiting.html' }
            ]
        }
    ],

    // Breadcrumbs voor navigatie
    breadcrumbs: [
        { text: 'Dashboard', href: 'index.html' },
        { text: 'Week 1', href: 'week1.html' },
        { text: 'Neuro-psycho-immunologie', href: 'week1.html' }
    ]
};

// Utility functies voor configuratie
const ConfigUtils = {
    // Haal module op basis van ID
    getModuleById(id) {
        return MODULE_CONFIG.modules.find(module => module.id === id);
    },

    // Haal alle modules op
    getAllModules() {
        return MODULE_CONFIG.modules;
    },

    // Haal huidige module op (eerste module)
    getCurrentModule() {
        return MODULE_CONFIG.modules[0];
    },

    // Haal volgende module op
    getNextModule(currentModuleId) {
        const currentIndex = MODULE_CONFIG.modules.findIndex(module => module.id === currentModuleId);
        return MODULE_CONFIG.modules[currentIndex + 1] || null;
    },

    // Haal vorige module op
    getPreviousModule(currentModuleId) {
        const currentIndex = MODULE_CONFIG.modules.findIndex(module => module.id === currentModuleId);
        return MODULE_CONFIG.modules[currentIndex - 1] || null;
    }
};

// Export voor verschillende module systemen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODULE_CONFIG, ConfigUtils };
} else {
    window.MODULE_CONFIG = MODULE_CONFIG;
    window.ConfigUtils = ConfigUtils;
}
