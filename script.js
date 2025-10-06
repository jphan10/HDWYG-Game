// Card categories configuration
const CARD_CATEGORIES = {
    instructions: { pages: [1, 2, 3, 4, 5, 6, 7, 8], title: "Instructions" },
    level1: { pages: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], title: "Level 1" },
    level2: { pages: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31], title: "Level 2" },
    level3: { pages: [34, 35, 36, 37, 38, 39, 40, 41], title: "Level 3" },
    challenge: { pages: [20, 32, 42], title: "Challenge" }
};

// Global variables
let pdfDoc = null;
let currentInstructionPage = 0;
let viewedCards = new Set();

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for PDF.js to load if needed
    if (typeof pdfjsLib === 'undefined') {
        console.log('PDF.js not loaded yet, waiting...');
        setTimeout(() => {
            if (typeof pdfjsLib !== 'undefined') {
                initializeApp();
            } else {
                showLoading(false);
                alert('Failed to load PDF.js library. Please refresh the page and check your internet connection.');
            }
        }, 1000);
    } else {
        initializeApp();
    }
});

async function initializeApp() {
    showLoading(true);
    
    try {
        // Load viewed cards from localStorage
        loadViewedCards();
        
        // Load PDF
        await loadPDF();
        
        // Set up event listeners
        setupEventListeners();
        
        // Generate card lists
        generateCardLists();
        
        // Show first instruction page
        await showInstructionPage(0);
        
        showLoading(false);
    } catch (error) {
        console.error('Error initializing app:', error);
        showLoading(false);
        alert('Error loading PDF. Please refresh the page and try again.');
    }
}

async function loadPDF() {
    try {
        // Check if PDF.js is loaded
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library is not loaded. Please check your internet connection.');
        }
        
        // Configure PDF.js worker (backup configuration)
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        
        console.log('Attempting to load PDF: ./card.pdf');
        
        // Load the PDF with additional options
        const loadingTask = pdfjsLib.getDocument({
            url: './card.pdf',
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true,
        });
        
        pdfDoc = await loadingTask.promise;
        
        console.log('PDF loaded successfully. Pages:', pdfDoc.numPages);
    } catch (error) {
        console.error('Error loading PDF:', error);
        console.error('Error details:', error.message);
        
        // Try simpler PDF loading method
        try {
            console.log('Trying simpler PDF loading method...');
            if (typeof pdfjsLib !== 'undefined') {
                const loadingTask = pdfjsLib.getDocument('./card.pdf');
                pdfDoc = await loadingTask.promise;
                console.log('PDF loaded with simpler method. Pages:', pdfDoc.numPages);
            } else {
                throw new Error('PDF.js library is not available');
            }
        } catch (altError) {
            console.error('Alternative loading method also failed:', altError);
            throw new Error('Failed to load PDF. Please refresh the page and ensure you have an internet connection.');
        }
    }
}

function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.category));
    });
    
    // Instruction navigation
    document.getElementById('prev-instruction').addEventListener('click', () => {
        if (currentInstructionPage > 0) {
            currentInstructionPage--;
            showInstructionPage(currentInstructionPage);
        }
    });
    
    document.getElementById('next-instruction').addEventListener('click', () => {
        if (currentInstructionPage < CARD_CATEGORIES.instructions.pages.length - 1) {
            currentInstructionPage++;
            showInstructionPage(currentInstructionPage);
        }
    });
    
    // Modal close
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('card-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('card-modal')) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function generateCardLists() {
    Object.keys(CARD_CATEGORIES).forEach(category => {
        if (category === 'instructions') return; // Skip instructions
        
        const listContainer = document.getElementById(`${category}-list`);
        const pages = CARD_CATEGORIES[category].pages;
        
        pages.forEach((pageNum, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            cardItem.dataset.page = pageNum;
            cardItem.dataset.category = category;
            
            // Check if card has been viewed
            if (viewedCards.has(pageNum)) {
                cardItem.classList.add('viewed');
            }
            
            cardItem.innerHTML = `
                <h3>${CARD_CATEGORIES[category].title} Card ${index + 1}</h3>
                <p>Page ${pageNum}</p>
            `;
            
            cardItem.addEventListener('click', () => showCardModal(pageNum, category, index + 1));
            listContainer.appendChild(cardItem);
        });
    });
}

function switchSection(category) {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Update active section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${category}-section`).classList.add('active');
}

async function showInstructionPage(index) {
    const pageNum = CARD_CATEGORIES.instructions.pages[index];
    const displayContainer = document.getElementById('instruction-display');
    
    try {
        const canvas = await renderPDFPage(pageNum);
        displayContainer.innerHTML = '';
        displayContainer.appendChild(canvas);
        
        // Update navigation controls
        updateInstructionNavigation(index);
        
        // Mark as viewed if not already
        markCardAsViewed(pageNum);
        
    } catch (error) {
        console.error('Error showing instruction page:', error);
        displayContainer.innerHTML = '<p>Error loading page. Please try again.</p>';
    }
}

function updateInstructionNavigation(index) {
    const prevBtn = document.getElementById('prev-instruction');
    const nextBtn = document.getElementById('next-instruction');
    const counter = document.getElementById('instruction-counter');
    
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === CARD_CATEGORIES.instructions.pages.length - 1;
    counter.textContent = `Page ${index + 1} of ${CARD_CATEGORIES.instructions.pages.length}`;
}

async function showCardModal(pageNum, category, cardIndex) {
    const modal = document.getElementById('card-modal');
    const displayContainer = document.getElementById('modal-card-display');
    const titleElement = document.getElementById('modal-card-title');
    
    try {
        showLoading(true);
        
        const canvas = await renderPDFPage(pageNum);
        displayContainer.innerHTML = '';
        displayContainer.appendChild(canvas);
        
        titleElement.textContent = `${CARD_CATEGORIES[category].title} Card ${cardIndex} (Page ${pageNum})`;
        
        // Mark as viewed
        markCardAsViewed(pageNum);
        
        // Update the card item visual state
        const cardItem = document.querySelector(`[data-page="${pageNum}"]`);
        if (cardItem && !cardItem.classList.contains('viewed')) {
            cardItem.classList.add('viewed');
        }
        
        modal.classList.remove('hidden');
        showLoading(false);
        
    } catch (error) {
        console.error('Error showing card modal:', error);
        showLoading(false);
        alert('Error loading card. Please try again.');
    }
}

async function renderPDFPage(pageNum) {
    try {
        const page = await pdfDoc.getPage(pageNum);
        
        // Calculate scale for mobile responsiveness
        const viewport = page.getViewport({ scale: 1 });
        const maxWidth = Math.min(800, window.innerWidth - 40);
        const scale = maxWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        // Render PDF page
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        return canvas;
        
    } catch (error) {
        console.error('Error rendering PDF page:', error);
        throw error;
    }
}

function closeModal() {
    const modal = document.getElementById('card-modal');
    modal.classList.add('hidden');
}

function markCardAsViewed(pageNum) {
    viewedCards.add(pageNum);
    saveViewedCards();
}

function loadViewedCards() {
    try {
        const saved = localStorage.getItem('hdwyg-viewed-cards');
        if (saved) {
            viewedCards = new Set(JSON.parse(saved));
        }
    } catch (error) {
        console.error('Error loading viewed cards:', error);
        viewedCards = new Set();
    }
}

function saveViewedCards() {
    try {
        localStorage.setItem('hdwyg-viewed-cards', JSON.stringify([...viewedCards]));
    } catch (error) {
        console.error('Error saving viewed cards:', error);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Utility function to reset all viewed cards (for testing)
function resetViewedCards() {
    viewedCards.clear();
    localStorage.removeItem('hdwyg-viewed-cards');
    
    // Remove visual indicators
    document.querySelectorAll('.card-item.viewed').forEach(item => {
        item.classList.remove('viewed');
    });
    
    console.log('All viewed cards have been reset.');
}

// Make reset function available globally for debugging
window.resetViewedCards = resetViewedCards;

// Handle page visibility changes to save state
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveViewedCards();
    }
});

// Save state before page unload
window.addEventListener('beforeunload', () => {
    saveViewedCards();
});