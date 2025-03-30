const aiPhrases = [
    // AI/Technology Quotes
    "Building new things with AI.",
    "Exploring the future of technology.",
    "Training neural networks.",
    "Optimizing machine learning models.",
    "Creating AI-powered solutions.",
    
    
    // Hitchhiker's Guide to the Galaxy Quotes
    "Don't Panic.",
    "Life, the Universe, and Everything.",
    "So long, and thanks for all the fish.",
    "The answer is 42.",
    "Time is an illusion. Lunchtime doubly so.",
];

function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * aiPhrases.length);
    return aiPhrases[randomIndex];
}

function typeText() {
    const text = getRandomPhrase();
    let index = 0;
    const typingElement = document.getElementById('typing');
    const cursorElement = document.getElementById('cursor');
    typingElement.innerHTML = ''; // Clear any existing text

    function type() {
        if (index < text.length) {
            if (text.charAt(index) === '\n') {
                typingElement.innerHTML += '<br>';
            } else {
                typingElement.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(type, 100);
        }
    }
    type();
}

// Initialize typing animation when the page loads
document.addEventListener('DOMContentLoaded', typeText); 