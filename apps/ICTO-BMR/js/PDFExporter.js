/**
 * PDFExporter
 * 
 * Utility voor het exporteren van alle e-learning content naar PDF
 * Exporteert alle modules content in één PDF bestand
 */

class PDFExporter {
    constructor() {
        this.isExporting = false;
    }

    /**
     * Exporteer alle content naar PDF
     */
    async exportAllContentToPDF() {
        if (this.isExporting) {
            console.log('Export al bezig...');
            return;
        }

        this.isExporting = true;

        try {
            // Check of bibliotheken geladen zijn met betere error messages
            if (typeof window.jspdf === 'undefined') {
                console.error('[PDFExporter] jspdf bibliotheek niet gevonden');
                console.error('[PDFExporter] window.jspdf:', typeof window.jspdf);
                alert('PDF bibliotheek (jsPDF) is niet geladen. Controleer je internetverbinding en herlaad de pagina. Als het probleem aanhoudt, controleer de browser console voor meer details.');
                this.isExporting = false;
                return;
            }
            
            if (typeof html2canvas === 'undefined') {
                console.error('[PDFExporter] html2canvas bibliotheek niet gevonden');
                console.error('[PDFExporter] html2canvas:', typeof html2canvas);
                alert('PDF bibliotheek (html2canvas) is niet geladen. Controleer je internetverbinding en herlaad de pagina. Als het probleem aanhoudt, controleer de browser console voor meer details.');
                this.isExporting = false;
                return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Helper functies voor yPosition
            const getYPosition = () => yPosition;
            const setYPosition = (val) => { yPosition = val; };

            // Functie om nieuwe pagina toe te voegen
            const addNewPage = () => {
                pdf.addPage();
                yPosition = margin;
            };

            // Functie om tekst toe te voegen met automatische pagina breaks
            const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
                if (!text || text.trim() === '') return; // Skip lege tekst
                
                pdf.setFontSize(fontSize);
                pdf.setTextColor(color[0], color[1], color[2]);
                if (isBold) {
                    pdf.setFont(undefined, 'bold');
                } else {
                    pdf.setFont(undefined, 'normal');
                }

                const lines = pdf.splitTextToSize(text, contentWidth);
                
                lines.forEach(line => {
                    if (yPosition + fontSize / 2 > pageHeight - margin) {
                        addNewPage();
                    }
                    pdf.text(line, margin, yPosition);
                    yPosition += fontSize * 0.6; // Iets meer ruimte tussen regels
                });

                yPosition += fontSize * 0.4; // Extra ruimte na tekstblok
            };

            // Start met titel
            addText('E-Learning Platform: ICTO-BMR', 20, true, [0, 119, 182]);
            yPosition += 5;

            addText('Complete Module Content Export', 14, false, [100, 100, 100]);
            yPosition += 10;

            // Configuratie van te exporteren modules
            const modules = [
                { id: 'wat-is-icto', path: 'content/wat-is-icto.content.json', title: 'Wat is ICTO' },
                { id: 'wat-doet-icto', path: 'content/wat-doet-icto.content.json', title: 'Wat doet ICTO' },
                { id: 'waarom-icto', path: 'content/waarom-icto.content.json', title: 'Waarom ICTO' }
            ];

            if (modules.length === 0) {
                addText('Er zijn nog geen modules beschikbaar om te exporteren.', 12, false, [128, 128, 128]);
                addText('Voeg modules toe aan de configuratie om ze te kunnen exporteren.', 10, false, [128, 128, 128]);
            } else {
                // Exporteer alle modules
                for (const module of modules) {
                    // Module header - extra ruimte voor nieuwe module
                    if (yPosition > pageHeight - 40) {
                        addNewPage();
                    }
                    yPosition += 10;

                    addText(`Module: ${module.title}`, 16, true, [0, 119, 182]);
                    yPosition += 5;

                    try {
                        const response = await fetch(module.jsonFile);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        const content = await response.json();

                        // Export intro
                        if (content.intro) {
                            if (content.intro.title) {
                                addText(content.intro.title, 14, true);
                            }
                            if (content.intro.subtitle) {
                                addText(content.intro.subtitle, 12, false, [100, 100, 100]);
                            }
                            if (content.intro.description) {
                                // Strip HTML tags
                                const plainText = content.intro.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                                addText(plainText, 11);
                            }
                            yPosition += 5;
                        }

                        // Export theorie
                        if (content.theorie && content.theorie.content) {
                            addText('Theorie', 14, true);
                            this.exportContentItems(content.theorie.content, addText, addNewPage, getYPosition, setYPosition, pageHeight, margin);
                        }

                    } catch (error) {
                        console.error(`[PDFExporter] Fout bij exporteren van ${module.title}:`, error);
                        addText(`[Fout bij laden van ${module.title}]`, 10, false, [200, 0, 0]);
                    }
                }
            }

            // Sla PDF op
            pdf.save('ICTO-BMR-Content-Export.pdf');
            console.log('[PDFExporter] PDF export voltooid');

        } catch (error) {
            console.error('[PDFExporter] Fout bij PDF export:', error);
            alert('Er is een fout opgetreden bij het exporteren naar PDF. Controleer de browser console voor meer details.');
        } finally {
            this.isExporting = false;
        }
    }

    /**
     * Exporteer content items recursief
     */
    exportContentItems(items, addText, addNewPage, getYPosition, setYPosition, pageHeight, margin) {
        items.forEach(item => {
            if (item.type === 'heading') {
                const fontSize = item.level === 1 ? 16 : item.level === 2 ? 14 : 12;
                addText(item.text || '', fontSize, true);
            } else if (item.type === 'paragraph' && item.text) {
                const text = Array.isArray(item.text) ? item.text.join(' ') : item.text;
                // Strip HTML tags
                const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                if (plainText) {
                    addText(plainText, 11);
                }
            } else if (item.content && Array.isArray(item.content)) {
                // Recursief exporteren voor geneste content
                this.exportContentItems(item.content, addText, addNewPage, getYPosition, setYPosition, pageHeight, margin);
            }
        });
    }
}

// Maak beschikbaar als globale class
window.PDFExporter = PDFExporter;
