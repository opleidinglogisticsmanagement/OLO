/**
 * PDFExporter
 * 
 * Utility voor het exporteren van alle e-learning content naar PDF
 * Exporteert alle weken content in één PDF bestand
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

            // Functie om een afbeelding toe te voegen
            const addImage = async (imgSrc, maxWidth = contentWidth, maxHeight = 100) => {
                try {
                    const img = new Image();
                    
                    // Laad afbeelding met timeout
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('Timeout bij laden afbeelding'));
                        }, 10000); // 10 seconden timeout
                        
                        img.onload = () => {
                            clearTimeout(timeout);
                            resolve();
                        };
                        img.onerror = () => {
                            clearTimeout(timeout);
                            reject(new Error('Kon afbeelding niet laden'));
                        };
                        
                        // Probeer eerst zonder CORS voor lokale bestanden
                        img.src = imgSrc;
                    });

                    // Bereken afmetingen
                    let imgWidth = img.width || 100;
                    let imgHeight = img.height || 100;
                    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
                    imgWidth = imgWidth * ratio;
                    imgHeight = imgHeight * ratio;

                    // Check of er ruimte is op de pagina
                    const currentY = getYPosition();
                    if (currentY + imgHeight > pageHeight - margin) {
                        addNewPage();
                    }

                    // Converteer afbeelding naar base64
                    try {
                        // Beperk canvas grootte om RangeError te voorkomen
                        const maxCanvasSize = 2000; // Max breedte/hoogte in pixels
                        let canvasWidth = Math.min(img.width || 100, maxCanvasSize);
                        let canvasHeight = Math.min(img.height || 100, maxCanvasSize);
                        
                        // Schaal afbeelding als deze te groot is
                        if (img.width > maxCanvasSize || img.height > maxCanvasSize) {
                            const scale = Math.min(maxCanvasSize / img.width, maxCanvasSize / img.height);
                            canvasWidth = Math.floor(img.width * scale);
                            canvasHeight = Math.floor(img.height * scale);
                        }
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;
                        const ctx = canvas.getContext('2d');
                        
                        // Schaal afbeelding als nodig
                        if (canvasWidth !== img.width || canvasHeight !== img.height) {
                            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                        } else {
                            ctx.drawImage(img, 0, 0);
                        }
                        
                        const imgData = canvas.toDataURL('image/jpeg', 0.85); // Gebruik JPEG met compressie

                        const currentY = getYPosition();
                        pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
                        setYPosition(currentY + imgHeight + 5);
                    } catch (canvasError) {
                        // Als canvas conversie faalt, voeg alleen tekst toe
                        console.warn('Canvas conversie faalde:', canvasError);
                        addText(`[Afbeelding: ${imgSrc}]`, 10, false, [128, 128, 128]);
                    }
                } catch (error) {
                    console.warn('Fout bij laden afbeelding:', error);
                    // Voeg alleen de alt tekst of src toe als tekst
                    const displayText = imgSrc.split('/').pop() || imgSrc;
                    addText(`[Afbeelding: ${displayText}]`, 10, false, [128, 128, 128]);
                }
            };

            // Start met titel
            addText('E-Learning Platform: Opzetten van Logistieke Onderzoeken', 20, true, [0, 119, 182]);
            yPosition += 5;

            addText('Complete Module Content Export', 14, false, [100, 100, 100]);
            yPosition += 10;

            // Exporteer alle weken
            const weeks = [
                { number: 1, title: 'Geen onderwijs i.v.m. studiereis', file: 'week1.html', jsonFile: 'content/week1.content.json' },
                { number: 2, title: 'Van probleem naar doelstelling', file: 'week2.html', jsonFile: 'content/week2.content.json' },
                { number: 3, title: 'Onderzoeksmodel + Onderzoeksvragen', file: 'week3.html', jsonFile: 'content/week3.content.json' },
                { number: 4, title: 'Begripsbepaling + Voorbereiding literatuuronderzoek', file: 'week4.html', jsonFile: 'content/week4.content.json' },
                { number: 5, title: 'Uitvoeren literatuuronderzoek + Theoretisch kader', file: 'week5.html', jsonFile: 'content/week5.content.json' },
                { number: 6, title: 'Onderzoeksstrategie + dataverzamelingsplan', file: 'week6.html', jsonFile: 'content/week6.content.json' },
                { number: 7, title: 'Rapportage 1', file: 'week7.html', jsonFile: 'content/week7.content.json' }
                // Afsluiting wordt alleen toegevoegd als het bestand bestaat
            ];
            
            // Probeer afsluiting toe te voegen als het bestand bestaat
            // Let op: browsers loggen altijd 404s in de console, dit is normaal gedrag
            try {
                const afsluitingResponse = await fetch('content/afsluiting.content.json');
                // Check expliciet op status 200, niet alleen op ok (om 404's stil te houden)
                if (afsluitingResponse.status === 200) {
                    weeks.push({ number: 8, title: 'Afsluiting', file: 'afsluiting.html', jsonFile: 'content/afsluiting.content.json' });
                }
                // Status 404 wordt stil genegeerd (dit is verwacht gedrag)
            } catch (e) {
                // Netwerk errors worden stil genegeerd
            }

            for (const week of weeks) {
                // Week header - extra ruimte voor nieuwe week
                if (yPosition > pageHeight - 40) {
                    addNewPage();
                } else {
                    yPosition += 8; // Extra ruimte boven nieuwe week
                }
                addText(`Week ${week.number}: ${week.title}`, 16, true, [0, 119, 182]);
                yPosition += 10; // Ruimte na week header

                // Laad week content
                try {
                    const content = await this.loadWeekContent(week.jsonFile);
                    if (content) {
                        // Voeg intro toe
                        if (content.intro) {
                            if (content.intro.title) {
                                addText(content.intro.title, 14, true);
                                yPosition += 3; // Ruimte na titel
                            }
                            if (content.intro.subtitle) {
                                addText(content.intro.subtitle, 12, true, [100, 100, 100]);
                                yPosition += 3; // Ruimte na subtitle
                            }
                            if (content.intro.description) {
                                const description = this.stripHTML(content.intro.description);
                                if (description && description.trim()) {
                                    addText(description, 11);
                                }
                            }
                            yPosition += 8; // Extra ruimte na intro sectie
                        }

                        // Voeg leerdoelen toe
                        if (content.leerdoelen && content.leerdoelen.items && content.leerdoelen.items.length > 0) {
                            addText('Leerdoelen:', 12, true);
                            yPosition += 2; // Ruimte na header
                            for (const item of content.leerdoelen.items) {
                                addText(`• ${item}`, 11);
                            }
                            yPosition += 8; // Ruimte na leerdoelen sectie
                        }

                        // Voeg theorie toe
                        if (content.theorie && content.theorie.content) {
                            addText('Theorie:', 12, true);
                            yPosition += 3; // Ruimte na header
                            await this.processContentItems(
                                content.theorie.content, 
                                addText, 
                                addImage, 
                                addNewPage, 
                                getYPosition, 
                                setYPosition, 
                                pageHeight, 
                                margin
                            );
                            yPosition += 8; // Ruimte na theorie sectie
                        }

                        // Voeg video info toe (als link)
                        if (content.video) {
                            addText('Video:', 12, true);
                            yPosition += 2; // Ruimte na header
                            if (content.video.title) {
                                addText(`Titel: ${content.video.title}`, 11);
                            }
                            if (content.video.description) {
                                addText(`Beschrijving: ${this.stripHTML(content.video.description)}`, 10);
                            }
                            if (content.video.url) {
                                addText(`Link: ${content.video.url}`, 10, false, [0, 0, 255]);
                            }
                            if (content.video.info) {
                                addText(`Info: ${this.stripHTML(content.video.info)}`, 10);
                            }
                            yPosition += 8; // Ruimte na video sectie
                        }
                    } else {
                        addText('Content niet beschikbaar voor export', 10, false, [128, 128, 128]);
                    }
                } catch (error) {
                    console.error(`Fout bij laden week ${week.number}:`, error);
                    addText(`Fout bij laden week ${week.number}: ${error.message}`, 10, false, [255, 0, 0]);
                }

                yPosition += 15; // Extra ruimte tussen weken voor betere scheiding
            }

            // Voeg footer toe op laatste pagina
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(128, 128, 128);
                pdf.text(
                    `Pagina ${i} van ${totalPages} - E-Learning Platform OLO`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Download PDF
            const fileName = `OLO_Complete_Module_Export_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            this.isExporting = false;
            // Geen popup bij succes - download start automatisch

        } catch (error) {
            console.error('Fout bij PDF export:', error);
            alert(`Er is een fout opgetreden bij het exporteren: ${error.message}`);
            this.isExporting = false;
        }
    }

    /**
     * Laad week content van JSON bestand
     */
    async loadWeekContent(jsonFile) {
        try {
            if (!jsonFile) {
                return null;
            }

            const response = await fetch(jsonFile);
            if (!response.ok) {
                // Als bestand niet bestaat (404), return null zonder error te loggen
                // Let op: browsers loggen altijd 404s in de console, dit is normaal gedrag
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.json();

            // Preload transcripts voor video's (zelfde base URL als content)
            const baseUrl = new URL('..', new URL(jsonFile, window.location.href).href).href;
            await this.preloadTranscripts(content, baseUrl);

            return content;
        } catch (error) {
            // Alleen loggen als het geen 404 is (404s worden stil genegeerd)
            if (error.message && !error.message.includes('404')) {
                console.warn(`Kon ${jsonFile} niet laden:`, error.message);
            }
            return null;
        }
    }

    /**
     * Preload transcript bestanden voor video's in de content
     */
    async preloadTranscripts(obj, baseUrl) {
        if (!obj) return;

        if (Array.isArray(obj)) {
            for (const item of obj) {
                await this.preloadTranscripts(item, baseUrl);
            }
            return;
        }

        if (typeof obj === 'object') {
            if (obj.type === 'video' && obj.transcript) {
                try {
                    const transcriptUrl = new URL(obj.transcript, baseUrl).href;
                    const response = await fetch(transcriptUrl);
                    if (response.ok) {
                        const text = await response.text();
                        obj._transcriptContent = text;
                    }
                } catch (e) {
                    console.warn('[PDFExporter] Kon transcript niet laden:', obj.transcript, e);
                }
            }
            for (const key of Object.keys(obj)) {
                if (key !== '_transcriptContent' && typeof obj[key] === 'object') {
                    await this.preloadTranscripts(obj[key], baseUrl);
                }
            }
        }
    }

    /**
     * Verwerk content items (paragraphs, images, etc.)
     */
    async processContentItems(items, addText, addImage, addNewPage, getYPosition, setYPosition, pageHeight, margin) {
        if (!items || !Array.isArray(items)) {
            return;
        }

        for (const item of items) {
            switch (item.type) {
                case 'paragraph':
                    if (Array.isArray(item.text)) {
                        for (const text of item.text) {
                            // Extraheer afbeeldingen uit HTML string
                            const textWithoutImages = await this.extractImagesFromHTML(
                                text,
                                addText,
                                addImage,
                                addNewPage,
                                getYPosition,
                                setYPosition,
                                pageHeight,
                                margin
                            );
                            if (textWithoutImages && textWithoutImages.trim()) {
                                addText(textWithoutImages, 11);
                            }
                        }
                    } else if (item.text) {
                        // Extraheer afbeeldingen uit HTML string
                        const textWithoutImages = await this.extractImagesFromHTML(
                            item.text,
                            addText,
                            addImage,
                            addNewPage,
                            getYPosition,
                            setYPosition,
                            pageHeight,
                            margin
                        );
                        if (textWithoutImages && textWithoutImages.trim()) {
                            addText(textWithoutImages, 11);
                        }
                    }
                    break;

                case 'image':
                    if (item.src) {
                        // Check of er ruimte is
                        if (getYPosition() > pageHeight - 120) {
                            addNewPage();
                        }
                        // Gebruik grotere afmetingen voor betere zichtbaarheid
                        const maxWidth = 170; // mm
                        const maxHeight = item.size === 'full' || item.size === 'large' ? 120 : 100;
                        await addImage(item.src, maxWidth, maxHeight);
                        if (item.alt) {
                            addText(`[${item.alt}]`, 9, false, [128, 128, 128]);
                        }
                        setYPosition(getYPosition() + 3); // Extra ruimte na afbeelding
                    }
                    break;

                case 'url':
                    if (item.url && item.text) {
                        addText(`[LINK] ${item.text}: ${item.url}`, 10, false, [0, 0, 255]);
                        setYPosition(getYPosition() + 2);
                    }
                    break;

                case 'document':
                    if (item.src && item.text) {
                        addText(`[DOCUMENT] ${item.text}: ${item.src}`, 10, false, [0, 0, 255]);
                        setYPosition(getYPosition() + 2);
                    }
                    break;

                case 'highlight':
                    if (item.title) {
                        addText(`[${item.title}]`, 11, true);
                        setYPosition(getYPosition() + 2);
                    }
                    if (item.content) {
                        const content = Array.isArray(item.content) 
                            ? item.content.join(' ') 
                            : item.content;
                        // Extraheer afbeeldingen uit HTML string
                        const textWithoutImages = await this.extractImagesFromHTML(
                            content,
                            addText,
                            addImage,
                            addNewPage,
                            getYPosition,
                            setYPosition,
                            pageHeight,
                            margin
                        );
                        if (textWithoutImages && textWithoutImages.trim()) {
                            addText(textWithoutImages, 10);
                        }
                    }
                    setYPosition(getYPosition() + 4); // Ruimte na highlight box
                    break;

                case 'accordion':
                    if (item.items) {
                        for (const accordionItem of item.items) {
                            if (accordionItem.title) {
                                addText(`> ${accordionItem.title}`, 11, true);
                                setYPosition(getYPosition() + 2);
                            }
                            if (accordionItem.content) {
                                // Content kan HTML strings zijn of content items
                                for (const contentItem of accordionItem.content) {
                                    if (typeof contentItem === 'string') {
                                        // HTML string - extraheer afbeeldingen eerst
                                        const textWithoutImages = await this.extractImagesFromHTML(
                                            contentItem,
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                        if (textWithoutImages && textWithoutImages.trim()) {
                                            addText(`  ${textWithoutImages}`, 10);
                                        }
                                    } else if (typeof contentItem === 'object' && contentItem.type) {
                                        // Content item - recursief verwerken
                                        await this.processContentItems(
                                            [contentItem],
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                    }
                                }
                            }
                            setYPosition(getYPosition() + 4); // Ruimte tussen accordion items
                        }
                    }
                    break;

                case 'tabs':
                    if (item.tabs) {
                        for (const tab of item.tabs) {
                            if (tab.title) {
                                addText(`--- ${tab.title} ---`, 12, true, [0, 119, 182]);
                                setYPosition(getYPosition() + 4);
                            }
                            if (tab.content) {
                                // Content kan HTML strings zijn of content items
                                for (const contentItem of tab.content) {
                                    if (typeof contentItem === 'string') {
                                        // HTML string - extraheer afbeeldingen eerst
                                        const textWithoutImages = await this.extractImagesFromHTML(
                                            contentItem,
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                        if (textWithoutImages && textWithoutImages.trim()) {
                                            addText(textWithoutImages, 11);
                                        }
                                    } else if (typeof contentItem === 'object' && contentItem.type) {
                                        // Content item - recursief verwerken
                                        await this.processContentItems(
                                            [contentItem],
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                    }
                                }
                            }
                            setYPosition(getYPosition() + 8); // Ruimte tussen tabs
                        }
                    }
                    break;

                case 'steps':
                    if (item.steps) {
                        let index = 0;
                        for (const step of item.steps) {
                            const stepText = typeof step === 'string' ? step : step.text;
                            addText(`${index + 1}. ${this.stripHTML(stepText)}`, 10);
                            setYPosition(getYPosition() + 3); // Ruimte tussen stappen
                            index++;
                        }
                    }
                    break;

                case 'clickableSteps':
                    if (item.steps) {
                        let index = 0;
                        for (const step of item.steps) {
                            // Step label
                            const stepLabel = step.label || `Stap ${index + 1}`;
                            addText(`> ${stepLabel}`, 11, true, [0, 119, 182]);
                            setYPosition(getYPosition() + 3);
                            
                            // Step content
                            if (step.content) {
                                // Content kan HTML strings zijn of content items
                                for (const contentItem of step.content) {
                                    if (typeof contentItem === 'string') {
                                        // HTML string - extraheer afbeeldingen eerst
                                        const textWithoutImages = await this.extractImagesFromHTML(
                                            contentItem,
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                        if (textWithoutImages && textWithoutImages.trim()) {
                                            addText(`  ${textWithoutImages}`, 10);
                                        }
                                    } else if (typeof contentItem === 'object' && contentItem.type) {
                                        // Content item - recursief verwerken
                                        await this.processContentItems(
                                            [contentItem],
                                            addText,
                                            addImage,
                                            addNewPage,
                                            getYPosition,
                                            setYPosition,
                                            pageHeight,
                                            margin
                                        );
                                    }
                                }
                            }
                            setYPosition(getYPosition() + 8); // Ruimte tussen steps
                            index++;
                        }
                    }
                    break;

                case 'video':
                    if (item.url) {
                        addText('[VIDEO]', 11, true);
                        setYPosition(getYPosition() + 2);
                        if (item.title) {
                            addText(`Titel: ${item.title}`, 10);
                        }
                        if (item.description) {
                            addText(`Beschrijving: ${this.stripHTML(item.description)}`, 10);
                        }
                        addText(`Link: ${item.url}`, 10, false, [0, 0, 255]);
                        setYPosition(getYPosition() + 5);

                        // Transcript toevoegen (preloaded in loadWeekContent)
                        const transcriptText = item._transcriptContent || item.transcriptContent;
                        if (transcriptText) {
                            const cleanedTranscript = transcriptText
                                .split('\n')
                                .filter(line => !/^\+\d+$/.test(line.trim()))
                                .join('\n')
                                .trim();
                            if (cleanedTranscript) {
                                addText('Transcript:', 10, true);
                                setYPosition(getYPosition() + 2);
                                addText(cleanedTranscript, 9);
                                setYPosition(getYPosition() + 5);
                            }
                        }
                    }
                    break;

                case 'trueFalseExercise':
                    if (item.title) {
                        addText(item.title, 12, true);
                        setYPosition(getYPosition() + 2);
                    }
                    if (item.instruction) {
                        addText(this.stripHTML(item.instruction), 11);
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.statements && Array.isArray(item.statements)) {
                        let statementIndex = 1;
                        for (const statement of item.statements) {
                            if (statement.text) {
                                addText(`${statementIndex}. ${this.stripHTML(statement.text)}`, 10);
                                setYPosition(getYPosition() + 1);
                            }
                            if (statement.explanation) {
                                const answer = statement.correctAnswer ? 'Waar' : 'Onwaar';
                                addText(`   Antwoord: ${answer}`, 9, false, [0, 100, 0]);
                                addText(`   ${this.stripHTML(statement.explanation)}`, 9, false, [100, 100, 100]);
                                setYPosition(getYPosition() + 2);
                            }
                            statementIndex++;
                        }
                    }
                    setYPosition(getYPosition() + 5);
                    break;

                case 'matchingExercise':
                    if (item.title) {
                        addText(item.title, 12, true);
                        setYPosition(getYPosition() + 2);
                    }
                    if (item.instruction) {
                        addText(this.stripHTML(item.instruction), 11);
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.categories && Array.isArray(item.categories)) {
                        addText('Categorieën:', 10, true);
                        for (const category of item.categories) {
                            if (category.name) {
                                addText(`  • ${category.name}`, 10);
                            }
                            if (category.description) {
                                addText(`    ${this.stripHTML(category.description)}`, 9, false, [100, 100, 100]);
                            }
                        }
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.items && Array.isArray(item.items)) {
                        addText('Items:', 10, true);
                        let itemIndex = 1;
                        for (const matchItem of item.items) {
                            if (matchItem.text) {
                                addText(`${itemIndex}. ${this.stripHTML(matchItem.text)}`, 10);
                                if (matchItem.correctCategory !== undefined && item.categories) {
                                    const category = item.categories[matchItem.correctCategory];
                                    if (category && category.name) {
                                        addText(`   → Categorie: ${category.name}`, 9, false, [0, 100, 0]);
                                    }
                                }
                                setYPosition(getYPosition() + 2);
                            }
                            itemIndex++;
                        }
                    }
                    setYPosition(getYPosition() + 5);
                    break;

                case 'booleanOperatorExercise':
                    if (item.title) {
                        addText(item.title, 12, true);
                        setYPosition(getYPosition() + 2);
                    }
                    if (item.instruction) {
                        addText(this.stripHTML(item.instruction), 11);
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.scenarios && Array.isArray(item.scenarios)) {
                        let scenarioIndex = 1;
                        for (const scenario of item.scenarios) {
                            if (scenario.title) {
                                addText(`${scenarioIndex}. ${scenario.title}`, 11, true);
                                setYPosition(getYPosition() + 1);
                            }
                            if (scenario.description) {
                                addText(`   ${this.stripHTML(scenario.description)}`, 10);
                                setYPosition(getYPosition() + 1);
                            }
                            if (scenario.correctQuery) {
                                addText(`   Correcte query: ${scenario.correctQuery}`, 10, false, [0, 100, 0]);
                                setYPosition(getYPosition() + 1);
                            }
                            if (scenario.explanation) {
                                addText(`   ${this.stripHTML(scenario.explanation)}`, 9, false, [100, 100, 100]);
                                setYPosition(getYPosition() + 2);
                            }
                            scenarioIndex++;
                        }
                    }
                    setYPosition(getYPosition() + 5);
                    break;

                case 'aiQueryExercise':
                    if (item.title) {
                        addText(item.title, 12, true);
                        setYPosition(getYPosition() + 2);
                    }
                    if (item.instruction) {
                        addText(this.stripHTML(item.instruction), 11);
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.availableTerms && Array.isArray(item.availableTerms)) {
                        addText('Beschikbare zoektermen:', 10, true);
                        addText(`  ${item.availableTerms.join(', ')}`, 9, false, [100, 100, 100]);
                        setYPosition(getYPosition() + 3);
                    }
                    if (item.generateFromTheory) {
                        addText('Deze oefening genereert scenario\'s op basis van de theorie.', 9, false, [100, 100, 100]);
                        setYPosition(getYPosition() + 2);
                    }
                    setYPosition(getYPosition() + 5);
                    break;

                case 'smartChecklist':
                    if (item.doelstelling) {
                        addText('Doelstelling:', 11, true);
                        setYPosition(getYPosition() + 2);
                        addText(this.stripHTML(item.doelstelling), 10);
                        setYPosition(getYPosition() + 5);
                    }
                    if (item.criteria && Array.isArray(item.criteria)) {
                        addText('SMART Criteria:', 11, true);
                        setYPosition(getYPosition() + 3);
                        for (const criterion of item.criteria) {
                            if (criterion.letter && criterion.name) {
                                addText(`${criterion.letter} - ${criterion.name}`, 10, true);
                                setYPosition(getYPosition() + 1);
                            }
                            if (criterion.description) {
                                addText(`  ${this.stripHTML(criterion.description)}`, 9);
                                setYPosition(getYPosition() + 1);
                            }
                            if (criterion.question) {
                                addText(`  Vraag: ${this.stripHTML(criterion.question)}`, 9, false, [0, 100, 0]);
                                setYPosition(getYPosition() + 2);
                            }
                        }
                    }
                    setYPosition(getYPosition() + 5);
                    break;

                default:
                    // Onbekend type - probeer als tekst te renderen
                    if (item.text) {
                        addText(this.stripHTML(item.text), 10);
                    }
                    break;
            }
        }
    }

    /**
     * Verwijder HTML tags uit tekst en verbeter formatting
     */
    stripHTML(html) {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        
        // Vervang line breaks en paragraphs voor betere structuur
        let processedHtml = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<li>/gi, '• ')
            .replace(/<\/h[1-6]>/gi, '\n\n')
            .replace(/<strong>/gi, '')
            .replace(/<\/strong>/gi, '')
            .replace(/<em>/gi, '')
            .replace(/<\/em>/gi, '');
            
        tmp.innerHTML = processedHtml;
        let text = tmp.textContent || tmp.innerText || '';
        
        // Normaliseer whitespace maar behoud structuur
        text = text
            .replace(/\n{3,}/g, '\n\n') // Max 2 newlines achter elkaar
            .replace(/[ \t]+/g, ' ') // Meerdere spaties naar één
            .trim();
        
        return text;
    }

    /**
     * Extraheer afbeeldingen uit HTML string en voeg toe aan PDF
     */
    async extractImagesFromHTML(htmlString, addText, addImage, addNewPage, getYPosition, setYPosition, pageHeight, margin) {
        if (!htmlString || typeof htmlString !== 'string') {
            return htmlString; // Return original if not a string
        }

        const tmp = document.createElement('DIV');
        tmp.innerHTML = htmlString;
        
        // Vind alle img tags (gebruik Array.from om een echte array te krijgen)
        const images = Array.from(tmp.querySelectorAll('img'));
        
        if (images.length === 0) {
            // Geen afbeeldingen, return alleen tekst
            return this.stripHTML(htmlString);
        }

        // Verwerk elke afbeelding
        for (const img of images) {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            
            if (src) {
                // Check of er ruimte is
                if (getYPosition() > pageHeight - 120) {
                    addNewPage();
                }
                
                // Haal max-width en max-height uit style attribute als aanwezig
                const style = img.getAttribute('style') || '';
                let maxWidth = 170;
                let maxHeight = 100;
                
                const widthMatch = style.match(/max-width:\s*(\d+)px/);
                const heightMatch = style.match(/max-height:\s*(\d+)px/);
                
                if (widthMatch) {
                    maxWidth = Math.min(parseInt(widthMatch[1]) * 0.264583, 170); // Convert px to mm
                }
                if (heightMatch) {
                    maxHeight = Math.min(parseInt(heightMatch[1]) * 0.264583, 120); // Convert px to mm
                }
                
                // Haal ook width uit parent div als aanwezig (alleen als er geen max-width op img zelf staat)
                if (!widthMatch) {
                    const parentDiv = img.closest('div');
                    if (parentDiv) {
                        const parentStyle = parentDiv.getAttribute('style') || '';
                        const parentWidthMatch = parentStyle.match(/width:\s*(\d+)px/);
                        if (parentWidthMatch) {
                            maxWidth = Math.min(parseInt(parentWidthMatch[1]) * 0.264583, 170);
                        }
                    }
                }
                
                // Voeg afbeelding toe
                try {
                    await addImage(src, maxWidth, maxHeight);
                    
                    // Voeg alt tekst toe als caption (als deze niet leeg is)
                    if (alt && alt.trim()) {
                        addText(`[${alt}]`, 9, false, [128, 128, 128]);
                    }
                } catch (error) {
                    console.warn(`Kon afbeelding niet toevoegen: ${src}`, error);
                    // Voeg alt tekst toe als fallback
                    if (alt && alt.trim()) {
                        addText(`[Afbeelding: ${alt}]`, 9, false, [128, 128, 128]);
                    }
                }
                
                // Verwijder img tag en parent div als die alleen de img bevat
                const parent = img.parentElement;
                img.remove();
                
                // Als parent div nu leeg is (behalve mogelijk een p tag met alt tekst), verwijder die ook
                if (parent && parent.tagName === 'DIV' && parent.children.length === 0) {
                    parent.remove();
                }
            }
        }
        
        // Return de resterende tekst zonder afbeeldingen
        const remainingText = this.stripHTML(tmp.innerHTML);
        return remainingText;
    }
}

// Export voor gebruik
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFExporter;
} else {
    window.PDFExporter = PDFExporter;
}

