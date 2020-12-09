import auth from "./modules/Authentication.js";
import dictionary from "./modules/Dictionary.js";
import game from "./modules/Game.js";
import toast from "./modules/Toast.js";

window.onload = () => onLoad();

function onLoad() {
    setProfile();
    bindEvents();
    gameScreenHandler();
    dictionary.retrieveLanguages();
}

function setProfile() {
    auth.retrieveCurrentUser().then(response => {
        document.querySelector(".user__username").textContent = response.username;
        document.querySelector(".user__highscore").textContent = response.highscore;
    });
}

function bindEvents() {
    // logout button
    document.querySelector(".logout").addEventListener("click", () => {
        auth.logout();
    });

    // create new game button
    document.querySelector(".create-game__btn").addEventListener("click", () => {
        game.newGame(document.querySelector("select[name=game-languages]").value).then(() => {
            document.querySelector(".create-game").classList.add("hidden");
            document.querySelector(".create-round").classList.remove("hidden");
            toast.showToast("Game aangemaakt");
        });
    });

    // create new round button
    document.querySelector(".create-round__btn").addEventListener("click", () => {
        game.newRound().then(response => {
            document.querySelector(".round-words").innerHTML = "";
            newWordLetters(response.firstLetter, response.lettersAmount);
            toast.showToast("Nieuwe ronde gestart");
        });
    });

    // play turn button
    bindPlayTurnBtn();
}

function gameScreenHandler() {
    game.retrieveActiveGames().then(() => {
        const activeGame = JSON.parse(sessionStorage.getItem("activeGame"));
        if (activeGame.gameId === -1) {
            document.querySelector(".create-game").classList.remove("hidden");
        } else {
            game.retrieveActiveRound().then(response => {
                if (!response.active) {
                    document.querySelector(".create-round").classList.remove("hidden");
                } else {
                    newWordLetters(response.firstLetter, response.lettersAmount);
                }
            });
        }
    });
}

function newWordLetters(firstLetter, amount, guessedLetters = null) {
    const word = document.createElement("div");
    word.className = "round__word";

    if (amount === 0) {
        amount = document.querySelectorAll(".round__word")[0].querySelectorAll(".word__letter").length;
    }

    for (let count = 0; count < amount; count++) {
        const letter = document.createElement("input");
        letter.className = "word__letter";
        letter.placeholder = count === 0 ? firstLetter : "_";
        letter.maxLength = 1;

        if (count === 0) {
            letter.value = firstLetter;
            letter.classList.add("word__letter--correct");
        }

        if (guessedLetters !== null && amount === guessedLetters.length) {
            const letterFeedback = guessedLetters[count].letterFeedback;
            if (["CORRECT", "PRESENT"].includes(letterFeedback)) {
                letter.classList.add(`word__letter--${letterFeedback.toLowerCase()}`);
                letter.value = guessedLetters[count].letter;
            }
        }

        word.appendChild(letter);
    }

    document.querySelector(".round-words").append(word);
    bindWordEvents();

    document.querySelector(".play-turn").classList.remove("hidden");
    document.querySelector(".create-round").classList.add("hidden");
}

function bindWordEvents() {
    const words = document.querySelectorAll(".round__word");
    const lastWord = words[words.length - 1];

    for (const letterBox of lastWord.querySelectorAll(".word__letter")) {
        letterBox.addEventListener("keyup", event => {
            if (event.target.value) {
                letterBox.value = letterBox.value.toUpperCase();
                if (letterBox.nextElementSibling !== null) {
                    letterBox.nextElementSibling.focus();
                }
            }
        });
    }
}

function bindPlayTurnBtn() {
    document.querySelector(".play-turn__btn").addEventListener("click", () => {
        const words = document.querySelectorAll(".round__word");
        const lastWord = words[words.length - 1];
        let guessedWord = "";
        lastWord.querySelectorAll(".word__letter").forEach(letterBox => {
            guessedWord += letterBox.value;
        });
        game.playTurn(guessedWord).then(response => {
            if (response.correctGuess) {
                document.querySelector(".create-round").classList.remove("hidden");
                document.querySelector(".play-turn").classList.add("hidden");
                setProfile();
                toast.showToast("Het woord is juist geraden! Maak een nieuwe ronde aan om verder te gaan met het spel")
            } else {
                const guessedLetters = response.feedback.guessedLetters;
                const firstLetter = response.feedback.code >= 5200 ? response.guessedWord[0] : guessedLetters[0].letter;
                const guessedLettersLength = guessedLetters === null ? 0 : guessedLetters.length;
                newWordLetters(firstLetter, guessedLettersLength, guessedLetters);
            }

            if (response.gameOver) {
                document.querySelector(".game__round").classList.add("hidden");
                document.querySelector(".create-game").classList.remove("hidden");
                toast.showToast("Het woord is helaas niet in 5 beurten geraden. Het spel is afgelopen");
            }
        });
    });
}