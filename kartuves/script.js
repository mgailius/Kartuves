const gameData = {
    currentWord: "darbas",
    progress: 0,
    lives: 5,
    guessed: 0,
    possibleWords: ["obuolys", "bitas", "saldainis", "monitorius", "sofa"],
    chooseRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.possibleWords.length);
        this.currentWord = this.possibleWords[randomIndex];
    },
    loseLife() {
        this.lives--;
    },
    reset() {
        this.lives = 5;
        this.progress = 0;
        this.guessed = 0;
    }
};

const UI = {
    wordElement: document.querySelector(".word"),
    progressBar: document.querySelector(".bar"), 
    lives: document.querySelector(".lives"),
    guessedWords: document.querySelector(".guessedWords")
}

const sounds = {
    clickSound: new Audio('sounds/clickSound.wav'),
    correctLetter: new Audio('sounds/correctLetter.mp3'),
    wrongWord: new Audio('sounds/wrongWord.wav'),
    correctWord: new Audio('sounds/correctWord.wav')
}

function generateLetters() {
    UI.wordElement.innerHTML = "";

    for (let i = 0; i < gameData.currentWord.length; i++) {
        UI.wordElement.innerHTML += "<div></div>";
    }
}

function drawProgressBar() {
    UI.progressBar.style.width = `${gameData.progress}%`;
}

function updatePlayerInfo() {
    UI.guessedWords.innerHTML = `${gameData.guessed} / ${gameData.possibleWords.length}`;
    UI.lives.innerHTML = `${gameData.lives}`
}

function initGame() {
    updatePlayerInfo();
    renderNewWord();
    drawProgressBar();
}

initGame();

// Kai žmogus paspaudžia klaviatūros mygtuką
document.addEventListener("keydown", (e) => {
    const letter = e.key;

    console.log(letter);

    let letterFound = false;

    // Patikrinti, ar tokia raidė egzistuoja žodyje
    for (let i = 0; i < gameData.currentWord.length; i++) {
        const wordLetter = gameData.currentWord[i];

        // Jei žmogus atspėjo raidę
        if (letter === wordLetter) {
            sounds.correctLetter.play();
            console.log(`Žaidėjas atspėjo raidę ${i} pozicijoje`);
            UI.wordElement.childNodes[i].innerHTML = letter; 
            letterFound = true;
        }
    }

    // Patikriname, ar nebuvo rasta nei viena raidė
    if (letterFound === false) {
        sounds.clickSound.play();
        console.log("Pridedame žmogui baudos taškų!");
        addProgress(10);
    }

    checkLoseCondition();
    checkWinCondition();
});

function checkLoseCondition() {
    if (gameData.progress >= 100) {
        sounds.wrongWord.play();
        gameData.progress = 0;
        gameData.lives--;
        if(gameData.lives == 0) {
            gameData.reset();
            initGame();
        } else {
            updatePlayerInfo()
            renderNewWord();
            drawProgressBar();
        }
    }
}

function checkWinCondition() {
    for (let letterElement of UI.wordElement.childNodes) {
        if (letterElement.innerHTML === "") {
            return;
        }
    }
    sounds.correctWord.play();
    gameData.progress = 0;
    gameData.guessed++;
    if(gameData.guessed == gameData.possibleWords.length) {
        gameData.reset();
        initGame();
    } else {
        updatePlayerInfo()
        renderNewWord();
        drawProgressBar();
    }
}

function addProgress(progressAmount) {
    gameData.progress += progressAmount;
    gameData.progress = Math.min(100, gameData.progress);
    drawProgressBar();
}

function renderNewWord() {
    gameData.chooseRandomWord();
    generateLetters();
}