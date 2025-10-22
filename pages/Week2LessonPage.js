/**
 * Week2LessonPage
 * 
 * Specifieke pagina voor Week 2: Logistiek & Duurzaamheid
 * Basis template voor collega's om content toe te voegen
 */

class Week2LessonPage extends BaseLessonPage {
    constructor() {
        super('week-2', 'Week 2', 'Logistiek & Duurzaamheid');
        this.content = null;
        this.contentLoaded = false;
    }

    /**
     * Laad content uit JSON bestand
     */
    async loadContent() {
        try {
            const response = await fetch('./content/week2.content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.content = await response.json();
            this.contentLoaded = true;
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentLoaded = false;
            this.content = this.getFallbackContent();
        }
    }

    /**
     * Fallback content als JSON niet kan worden geladen
     */
    getFallbackContent() {
        return {
            intro: {
                title: "Week 2",
                subtitle: "Logistiek & Duurzaamheid",
                description: "Welkom bij Week 2! Deze module behandelt logistiek en duurzaamheid.",
                info: "Content kon niet worden geladen. Controleer of week2.content.json bestaat."
            },
            leerdoelen: {
                title: "Leerdoelen",
                description: "Na het voltooien van deze module kun je:",
                items: [
                    "De basisprincipes van duurzame logistiek uitleggen",
                    "De impact van logistiek op het milieu beschrijven",
                    "Duurzame logistieke oplossingen identificeren"
                ]
            },
            theorie: {
                title: "Theorie",
                paragraphs: [
                    "Duurzame logistiek richt zich op het minimaliseren van de milieu-impact van logistieke processen."
                ]
            },
            video: {
                title: "Video",
                description: "Introductie video over duurzame logistiek",
                url: "https://www.youtube.com/embed/yhO5EQgtgto?si=gGMmyzn-5UoRWOcG",
                info: "Video over duurzame logistiek"
            },
            quiz: {
                title: "Quiz",
                questions: [
                    {
                        question: "Wat is duurzame logistiek?",
                        options: [
                            "Logistiek met lage kosten",
                            "Logistiek met minimale milieu-impact",
                            "Snelle logistiek"
                        ],
                        correct: 1
                    }
                ],
                info: "Hier kunnen collega's meerkeuzevragen toevoegen"
            }
        };
    }

    /**
     * Render module introductie met content uit JSON
     */
    renderModuleIntro() {
        if (!this.content) {
            return this.renderErrorState();
        }

        return `
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book text-blue-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">${this.content.intro.title}: ${this.content.intro.subtitle}</h1>
                        <p class="text-gray-600 mb-4">${this.content.intro.description}</p>
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-info-circle text-blue-600 mt-1"></i>
                                <div>
                                    <h3 class="font-semibold text-blue-900 mb-1">Module Informatie</h3>
                                    <p class="text-blue-800 text-sm">${this.content.intro.info}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render content secties met content uit JSON
     */
    renderContentSections() {
        if (!this.content) {
            return this.renderErrorState();
        }

        return `
            <!-- Leerdoelen Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-bullseye text-green-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.content.leerdoelen.title}</h2>
                        <div class="prose max-w-none">
                            <p class="text-gray-600 mb-4">${this.content.leerdoelen.description}</p>
                            <ul class="space-y-2">
                                ${this.content.leerdoelen.items.map(item => `
                                    <li class="flex items-start space-x-3">
                                        <i class="fas fa-check text-green-500 mt-1"></i>
                                        <span class="text-gray-700">${item}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Theorie Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book text-purple-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.content.theorie.title}</h2>
                        <div class="prose max-w-none">
                            ${this.content.theorie.paragraphs.map(paragraph => `
                                <p class="text-gray-700 mb-4">${paragraph}</p>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Video Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-play text-red-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.content.video.title}</h2>
                        ${this.content.video.url ? `
                            <div class="rounded-lg overflow-hidden mb-4">
                                <iframe 
                                    width="100%" 
                                    height="450" 
                                    src="${this.content.video.url}" 
                                    title="YouTube video player" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy="strict-origin-when-cross-origin"
                                    allowfullscreen
                                    class="w-full aspect-video">
                                </iframe>
                            </div>
                        ` : `
                            <div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                                <div class="text-center text-white">
                                    <i class="fas fa-play-circle text-6xl mb-4 opacity-75"></i>
                                    <p class="text-lg font-medium">Video Player</p>
                                    <p class="text-sm opacity-75">Video content komt hier</p>
                                </div>
                            </div>
                        `}
                        <p class="text-sm text-gray-600">
                            <i class="fas fa-info-circle mr-1"></i>
                            ${this.content.video.info}
                        </p>
                    </div>
                </div>
            </section>

            <!-- Quiz Sectie -->
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-question-circle text-orange-600 text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">${this.content.quiz.title}</h2>
                        <div class="space-y-4">
                            ${this.content.quiz.questions.map((question, index) => `
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <h3 class="font-semibold text-gray-900 mb-3">${question.question}</h3>
                                    <div class="space-y-2">
                                        ${question.options.map((option, optionIndex) => `
                                            <label class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input type="radio" name="quiz-q${index}" value="${optionIndex}" class="text-blue-600 focus-ring">
                                                <span class="text-gray-700">${String.fromCharCode(65 + optionIndex)}) ${option}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                            <p class="text-sm text-gray-600">
                                <i class="fas fa-info-circle mr-1"></i>
                                ${this.content.quiz.info}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Render error state als content niet kan worden geladen
     */
    renderErrorState() {
        return `
            <section class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                    <div>
                        <h3 class="font-semibold text-red-900 mb-1">Content Kon Niet Worden Geladen</h3>
                        <p class="text-red-800 text-sm">
                            Het bestand week2.content.json kon niet worden geladen. Controleer of het bestand bestaat en toegankelijk is.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Initialiseer de pagina met content loading
     */
    async init() {
        await this.loadContent();
        document.body.innerHTML = this.render();
        this.attachEventListeners();
    }
}

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Week2LessonPage;
}
