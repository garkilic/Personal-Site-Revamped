const aiPhrases = [
    // AI/Technology Quotes
    "Building new things with AI.",
    "Exploring the future of technology.",
    "Training neural networks.",
    "Optimizing machine learning models.",
    "Creating AI-powered solutions.",
    "Developing intelligent systems.",
    "Coding with artificial intelligence.",
    "Building the future of AI.",
    "Experimenting with deep learning.",
    "Designing AI architectures.",
    "Training transformer models.",
    "Building autonomous systems.",
    "Developing AI applications.",
    "Creating smart algorithms.",
    "Exploring AI frontiers.",
    
    // Hitchhiker's Guide to the Galaxy Quotes
    "Don't Panic.",
    "Life, the Universe, and Everything.",
    "So long, and thanks for all the fish.",
    "The answer is 42.",
    "Time is an illusion. Lunchtime doubly so.",
    "I think you ought to know I'm feeling very depressed.",
    "The ships hung in the sky in much the same way that bricks don't.",
    "In the beginning the Universe was created. This has made a lot of people very angry.",
    "A towel is about the most massively useful thing an interstellar hitchhiker can have.",
    "The story so far: In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move."
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
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    type();
}

// Initialize typing animation when the page loads
document.addEventListener('DOMContentLoaded', typeText); 