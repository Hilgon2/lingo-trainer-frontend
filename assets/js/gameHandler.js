import auth from "./modules/Authentication.js";
import dictionary from "./modules/Dictionary.js";
import game from "./modules/Game.js";
import toast from "./modules/Toast.js";

onLoad();

function onLoad() {
    setProfile();
    bindEvents();
    initialGameScreenHandler();
    fillLanguages();
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
            toggleScreenVisibility("create-game", false);
            toggleScreenVisibility("create-round", true);
            toggleScreenVisibility("round", false);
            toast.showToast("Game aangemaakt");
        });
    });

    // create new round button
    document.querySelector(".create-round__btn").addEventListener("click", () => {
            sessionStorage.setItem("guessedLetters", JSON.stringify([]));
        game.newRound().then(response => {
            document.querySelector(".round-words").innerHTML = "";
            sessionStorage.setItem("activeRound", JSON.stringify(response));
            newWordLetters(response.firstLetter, response.lettersAmount);
            toast.showToast("Nieuwe ronde gestart");
        });
    });

    // play turn button
    bindPlayTurnBtn();
}

function initialGameScreenHandler() {
    game.retrieveActiveGames().then(() => {
        const activeGame = JSON.parse(sessionStorage.getItem("activeGame"));
        if (activeGame.gameId === -1) {
            document.querySelector(".create-game").classList.remove("hidden");
        } else {
            game.retrieveActiveRound().then(response => {
                if (!response.active) {
                    toggleScreenVisibility("create-round", true);
                } else {
                    newWordLetters(response.firstLetter, response.lettersAmount);
                }
            });
        }
    });
}

function newWordLetters(firstLetter, amount) {
    const guessedLetters = JSON.parse(sessionStorage.getItem("guessedLetters"));
    const word = document.createElement("div");
    word.className = "round__word";

    if (amount === 0) {
        amount = document.querySelectorAll(".round__word")[0].querySelectorAll(".word__letter").length;
    }

    // create new boxes
    for (let count = 0; count < amount; count++) {
        const letter = document.createElement("input");
        letter.className = "word__letter";
        letter.placeholder = count === 0 ? firstLetter : "_";
        letter.maxLength = 1;

        if (count === 0) {
            letter.value = firstLetter;
            letter.classList.add("word__letter--correct");
        }

        if (guessedLetters.length === amount && guessedLetters[count].letterFeedback === "CORRECT") {
            letter.value = guessedLetters[count].letter;
            letter.classList.add("word__letter--correct");
        }

        word.appendChild(letter);
    }

    document.querySelector(".round-words").append(word);
    bindWordEvents();

    toggleScreenVisibility("round", true);
    toggleScreenVisibility("play-turn", true);
    toggleScreenVisibility("create-round", false);
}

function showLetterFeedback(guessedLetters = null) {
    const words = document.querySelectorAll(".round__word");
    if (guessedLetters !== null) {
        let timeout = 0;
        let lastWordIndex = 0;

        if (words.length > 1) {
            lastWordIndex = words.length - 1;
        }

        const lastWord = words[lastWordIndex];
        const letterBoxes = lastWord.querySelectorAll(".word__letter");

        for (let count = 0; count < letterBoxes.length; count++) {
            setTimeout(() => {
                const letter = letterBoxes[count];
                const letterFeedback = guessedLetters[count].letterFeedback;
                if (["CORRECT", "PRESENT"].includes(letterFeedback)) {
                    letter.classList.add(`word__letter--${letterFeedback.toLowerCase()}`);
                    letter.value = guessedLetters[count].letter;
                } else {
                    letter.classList.remove("word__letter--correct");
                    letter.classList.remove("word__letter--present");
                }
            }, timeout);
            const fadeTime = 900 / letterBoxes.length;
            timeout += fadeTime;
        }
    }
}

function bindWordEvents() {
    const words = document.querySelectorAll(".round__word");
    const lastWord = words[words.length - 1];

    for (const letterBox of lastWord.querySelectorAll(".word__letter")) {
        letterBox.addEventListener("keyup", event => {
            if (event.code.substr(0, 3) === "Key") {
                letterBox.value = event.key.toUpperCase();
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
            if (response.feedback.code === -9999) {
                showLetterFeedback(response.feedback.guessedLetters, response.correctGuess);
                sessionStorage.setItem("guessedLetters", JSON.stringify(response.feedback.guessedLetters));
            }

            if (response.gameOver) {
                toggleScreenVisibility("create-game", true);
                toggleScreenVisibility("play-turn", false);
                toast.showToast("Het woord is helaas niet in 5 beurten geraden. Het spel is afgelopen");
            } else if (response.correctGuess) {
                toggleScreenVisibility("create-round", true);
                toggleScreenVisibility("play-turn", false);
                setProfile();
                toast.showToast("Het woord is juist geraden! Maak een nieuwe ronde aan om verder te gaan met het spel")
            } else {
                const activeRound = JSON.parse(sessionStorage.getItem("activeRound"));
                let firstLetter = activeRound.firstLetter;
                const guessedLettersLength = activeRound.lettersAmount;

                if (response.feedback.code !== -9999) {
                    game.getGameMessage(response.feedback.status).then(response => {
                        toast.showToast(response);
                    });
                }

                newWordLetters(firstLetter, guessedLettersLength);
            }
        });
    });
}

function toggleScreenVisibility(screen, visible) {
    const screens = {
        "create-game": ".create-game",
        "create-round": ".create-round",
        "round": ".game__round",
        "play-turn": ".play-turn"
    }
    if (visible) {
        document.querySelector(screens[screen]).classList.remove("hidden");
    } else {
        document.querySelector(screens[screen]).classList.add("hidden");
    }
}

function fillLanguages() {
    dictionary.retrieveLanguages().then(response => {
        const languages = document.querySelector("[name=game-languages]");
        for (const language of response) {
            const option = document.createElement("option");
            option.value = language;
            option.textContent = language;
            languages.appendChild(option);
        }
    });
}