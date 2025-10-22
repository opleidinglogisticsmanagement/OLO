/**
 * LessonPage Component
 * 
 * Hoofdpagina component die alle andere componenten samenbrengt:
 * - Header
 * - Sidebar  
 * - ProgressBar
 * - ContentCards
 * - QuizBlock
 * - Navigation
 */

class LessonPage {
    constructor() {
        this.currentModule = null;
        this.currentLesson = null;
        this.progress = 0;
        this.components = {};
        this.data = {};
    }

    async init() {
        await this.loadData();
        this.render();
        this.attachEventListeners();
        this.loadProgress();
    }

    async loadData() {
        // Simuleer data loading
        this.data = {
            modules: [
                {
                    id: 'Week 1',
                    title: 'Week 1',
                    status: 'completed',
                    expanded: true,
                    lessons: [
                        { title: 'Inleiding', status: 'completed', href: '#', completed: true },
                        { title: 'Theorie', status: 'completed', href: '#', completed: true },
                        { title: 'Quiz', status: 'current', href: '#', completed: false },
                        { title: 'Reflectie', status: 'locked', href: '#', completed: false }
                    ]
                },
                {
                    id: 'Week 2',
                    title: 'Week 2',
                    status: 'in-progress',
                    expanded: true,
                    lessons: [
                        { title: 'Inleiding', status: 'completed', href: '#', completed: true },
                        { title: 'Theorie', status: 'completed', href: '#', completed: true },
                        { title: 'Case Study', status: 'current', href: '#', completed: false },
                        { title: 'Quiz', status: 'locked', href: '#', completed: false }
                    ]
                },
                {
                    id: 'module-3',
                    title: 'Management & Leiderschap',
                    status: 'locked',
                    expanded: false,
                    lessons: [
                        { title: 'Inleiding', status: 'locked', href: '#', completed: false },
                        { title: 'Theorie', status: 'locked', href: '#', completed: false },
                        { title: 'Opdrachten', status: 'locked', href: '#', completed: false }
                    ]
                }
            ],
            progress: {
                'Week 1': { name: 'Week 1', percentage: 0 },
                'Week 2': { name: 'Week 2', percentage: 0 },
                'module-3': { name: 'Module 3', percentage: 0 }
            },
            user: {
                name: 'Student Naam',
                role: 'HBO Student'
            },
            breadcrumbs: [
                { text: 'Dashboard', href: '#' },
                { text: 'Week 1', href: '#' },
                { text: 'Week 1', href: '#' }
            ],
            questions: [
                {
                    question: 'Wat is neuro-psycho-immunologie?',
                    options: [
                        'De studie van zenuwcellen alleen',
                        'De interactie tussen zenuwstelsel, psyche en immuunsysteem',
                        'Alleen de studie van het immuunsysteem'
                    ],
                    correctAnswer: 1,
                    feedback: 'Neuro-psycho-immunologie bestudeert inderdaad de complexe interacties tussen deze drie systemen.'
                },
                {
                    question: 'Welke rol speelt de HPA-as?',
                    options: [
                        'Alleen hormoonproductie',
                        'Stressrespons en immuunregulatie',
                        'Alleen spiercoördinatie'
                    ],
                    correctAnswer: 1,
                    feedback: 'De HPA-as speelt een centrale rol in zowel stressrespons als immuunregulatie.'
                }
            ]
        };
    }

    render() {
        document.body.innerHTML = `
            <!-- Skip to content link for accessibility -->
            <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus-ring">
                Spring naar hoofdinhoud
            </a>

            <div id="app" class="min-h-screen flex">
                ${this.renderSidebar()}
                <div class="flex-1 flex flex-col lg:ml-0">
                    ${this.renderHeader()}
                    ${this.renderMainContent()}
                </div>
            </div>

            <!-- Overlay for mobile menu -->
            <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden lg:hidden"></div>
        `;
    }

    renderSidebar() {
        const sidebar = new Sidebar();
        sidebar.setModules(this.data.modules);
        sidebar.setProgress(this.data.progress);
        sidebar.setUser(this.data.user);
        return sidebar.render();
    }

    renderHeader() {
        const header = new Header();
        header.setBreadcrumbs(this.data.breadcrumbs);
        header.setActions([
            { icon: 'fas fa-question-circle', label: 'Help', onclick: 'showHelp()' },
            { icon: 'fas fa-cog', label: 'Instellingen', onclick: 'showSettings()' },
            { icon: 'fas fa-user', label: 'Profiel', onclick: 'showProfile()' }
        ]);
        return header.render();
    }

    renderMainContent() {
        const progressBar = new ProgressBar({
            percentage: 75,
            label: 'Module Voortgang',
            showText: true
        });

        const learningGoals = new ContentCard({
            icon: 'fas fa-bullseye',
            iconColor: 'blue',
            title: 'Leerdoelen',
            content: this.renderLearningGoals(),
            id: 'learning-goals'
        });

        const theory = new ContentCard({
            icon: 'fas fa-book',
            iconColor: 'green',
            title: 'Theorie: Neuro-psycho-immunologie',
            content: this.renderTheory(),
            id: 'theory'
        });

        const video = new ContentCard({
            icon: 'fas fa-play',
            iconColor: 'purple',
            title: 'Video: Introductie NPI',
            content: this.renderVideo(),
            id: 'video'
        });

        const quiz = new QuizBlock({
            title: 'Interactieve Quiz',
            questions: this.data.questions,
            id: 'quiz-block'
        });

        const reflection = new ContentCard({
            icon: 'fas fa-brain',
            iconColor: 'indigo',
            title: 'Reflectie Opdracht',
            content: this.renderReflection(),
            id: 'reflection'
        });

        return `
            <main id="main-content" class="flex-1 overflow-y-auto custom-scrollbar">
                <div class="max-w-4xl mx-auto px-6 py-8">
                    ${progressBar.render()}
                    
                    <article class="space-y-8 fade-in">
                        ${learningGoals.render()}
                        ${theory.render()}
                        ${video.render()}
                        ${quiz.render()}
                        ${reflection.render()}
                    </article>

                    ${this.renderNavigation()}
                </div>
            </main>
        `;
    }

    renderLearningGoals() {
        return `
            <p class="text-gray-600 mb-4">Na het voltooien van deze module kun je:</p>
            <ul class="space-y-2">
                <li class="flex items-start space-x-3">
                    <i class="fas fa-check text-green-500 mt-1"></i>
                    <span class="text-gray-700">De basisprincipes van neuro-psycho-immunologie uitleggen</span>
                </li>
                <li class="flex items-start space-x-3">
                    <i class="fas fa-check text-green-500 mt-1"></i>
                    <span class="text-gray-700">De interactie tussen zenuwstelsel, psyche en immuunsysteem beschrijven</span>
                </li>
                <li class="flex items-start space-x-3">
                    <i class="fas fa-circle text-gray-300 mt-1"></i>
                    <span class="text-gray-700">Praktische toepassingen in de gezondheidszorg identificeren</span>
                </li>
            </ul>
        `;
    }

    renderTheory() {
        return `
            <p class="text-gray-700 mb-4">
                Neuro-psycho-immunologie (NPI) is een interdisciplinair vakgebied dat de complexe interacties tussen het zenuwstelsel, 
                de psyche en het immuunsysteem bestudeert. Dit relatief nieuwe vakgebied heeft belangrijke implicaties voor 
                ons begrip van gezondheid en ziekte.
            </p>
            
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Kernconcepten</h4>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="font-semibold text-gray-900 mb-2">Stress Response</h5>
                    <p class="text-gray-600 text-sm">
                        Chronische stress kan leiden tot een verzwakt immuunsysteem en verhoogde ontstekingsreacties.
                    </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="font-semibold text-gray-900 mb-2">Psychoneuroimmunologie</h5>
                    <p class="text-gray-600 text-sm">
                        De studie van hoe psychologische factoren het immuunsysteem beïnvloeden via het zenuwstelsel.
                    </p>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-lightbulb text-blue-600 mt-1"></i>
                    <div>
                        <h5 class="font-semibold text-blue-900 mb-1">Belangrijke Tip</h5>
                        <p class="text-blue-800 text-sm">
                            De hypothalamus-hypofyse-bijnier (HPA) as speelt een centrale rol in de stressrespons en 
                            immuunregulatie.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderVideo() {
        return `
            <div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                <div class="text-center text-white">
                    <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                    <p class="text-lg font-medium">Video Player</p>
                    <p class="text-sm opacity-75">Klik om af te spelen</p>
                </div>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-600">
                <span><i class="fas fa-clock mr-1"></i>15:30 minuten</span>
                <span><i class="fas fa-eye mr-1"></i>Bekeken</span>
            </div>
        `;
    }

    renderReflection() {
        return `
            <p class="text-gray-600 mb-4">
                Denk na over hoe de principes van neuro-psycho-immunologie van toepassing kunnen zijn in jouw toekomstige 
                beroepspraktijk. Schrijf een korte reflectie van minimaal 200 woorden.
            </p>
            
            <div class="space-y-4">
                <div>
                    <label for="reflection-text" class="block text-sm font-medium text-gray-700 mb-2">
                        Jouw reflectie
                    </label>
                    <textarea 
                        id="reflection-text" 
                        rows="6" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Begin hier met je reflectie..."
                    ></textarea>
                    <div class="mt-2 flex justify-between text-sm text-gray-500">
                        <span>Minimaal 200 woorden</span>
                        <span id="word-count">0 woorden</span>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus-ring transition-colors">
                        Opslaan als Concept
                    </button>
                    <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus-ring transition-colors">
                        Indienen
                    </button>
                </div>
            </div>
        `;
    }

    renderNavigation() {
        return `
            <div class="mt-12 flex justify-between items-center">
                <button class="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus-ring transition-colors">
                    <i class="fas fa-arrow-left"></i>
                    <span>Vorige</span>
                </button>
                
                <div class="flex items-center space-x-4">
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-900 focus-ring">
                        <i class="fas fa-bookmark text-lg"></i>
                    </button>
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-900 focus-ring">
                        <i class="fas fa-share text-lg"></i>
                    </button>
                </div>
                
                <button class="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-ring transition-colors">
                    <span>Volgende</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Word count for reflection
        const reflectionText = document.getElementById('reflection-text');
        const wordCount = document.getElementById('word-count');

        if (reflectionText && wordCount) {
            reflectionText.addEventListener('input', () => {
                const words = reflectionText.value.trim().split(/\s+/).filter(word => word.length > 0);
                wordCount.textContent = `${words.length} woorden`;
                
                if (words.length >= 200) {
                    wordCount.classList.add('text-green-600');
                    wordCount.classList.remove('text-gray-500');
                } else {
                    wordCount.classList.add('text-gray-500');
                    wordCount.classList.remove('text-green-600');
                }
            });
        }

        // Initialize quiz block
        window.quizBlock = new QuizBlock({
            title: 'Interactieve Quiz',
            questions: this.data.questions,
            id: 'quiz-block'
        });
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('moduleProgress');
        if (savedProgress) {
            this.progress = parseInt(savedProgress);
            const progressBar = document.querySelector('.progress-animation');
            if (progressBar) {
                progressBar.style.width = this.progress + '%';
            }
        }
    }

    saveProgress(percentage) {
        this.progress = percentage;
        localStorage.setItem('moduleProgress', percentage.toString());
        this.loadProgress();
    }
}

// Global functions
function showHelp() {
    alert('Help functionaliteit wordt geladen...');
}

function showSettings() {
    alert('Instellingen worden geladen...');
}

function showProfile() {
    alert('Profiel wordt geladen...');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const lessonPage = new LessonPage();
    lessonPage.init();
});

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonPage;
}
