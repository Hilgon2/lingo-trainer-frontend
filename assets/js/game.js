import auth from "./modules/Authentication.js";
import dictionary from "./modules/Dictionary.js";
import game from "./modules/Game.js";

window.onload = () => onLoad();

function onLoad() {
    setProfile();
    bindEvents();
    getActiveGames();
    dictionary.retrieveLanguages();
}

function setProfile() {
    const user = jwt_decode(sessionStorage.getItem("token")).user
    document.querySelector(".user__username").textContent = user.username;
    document.querySelector(".user__highscore").textContent = user.highscore;
}

function bindEvents() {
    document.querySelector(".logout").addEventListener("click", () => {
        auth.logout();
    });

    document.querySelector(".create-game__btn").addEventListener("click", () => {
        game.newGame(document.querySelector("select[name=game-languages]").value);
    });
}

function getActiveGames() {
    game.retrieveActiveGames().then(response => {
        if (response.gameId === -1) {
            document.querySelector(".create-game").classList.remove("hidden");
        }
    });
}