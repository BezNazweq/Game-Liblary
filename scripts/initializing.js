function checkDOMLoaded() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGames);
    } else {
        initializeGames();
    }
}

function initializeGames() {
    if (document.getElementById('answerInput')) {
        console.log("Math Quiz initialized");
    }
    
    if (document.getElementById('wordDisplay')) {
        console.log("Word Guess initialized");
    }
    
    if (document.getElementById('gameCanvas')) {
        console.log("Catch the Ball initialized");
    }
    
    if (document.getElementById('gameGrid')) {
        console.log("Memory Game initialized");
    }
}

checkDOMLoaded();
