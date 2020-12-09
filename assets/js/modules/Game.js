import config from "./Config.js";
import toast from "./Toast.js";

class Game {
    retrieveActiveGames() {
        return fetch(`${config.getEndpoint()}/games/active`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(resp => resp.json())
            .then(response => {
                sessionStorage.setItem("activeGame", JSON.stringify(response));
            });
    }

    newGame(language) {
        const data = {
            "languageCode": language
        };

        return fetch(`${config.getEndpoint()}/games`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                throw resp;
            }
        })
            .then(response => {
                sessionStorage.setItem("activeGame", JSON.stringify(response));
                return response;
            }).catch(error => {
                error.json().then(errorResponse => {
                    toast.showToast(errorResponse.message, true);
                })
            })
    }

    newRound() {
        const currentGameId = JSON.parse(sessionStorage.getItem("activeGame")).gameId;
        return fetch(`${config.getEndpoint()}/games/${currentGameId}/rounds`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            method: "POST"
        }).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                throw resp;
            }
        })
            .then(response => {
                return (response);
            }).catch(error => {
                error.json().then(errorResponse => {
                    toast.showToast(errorResponse.message, true);
                })
            })
    }

    retrieveActiveRound() {
        const currentGameId = JSON.parse(sessionStorage.getItem("activeGame")).gameId;

        return fetch(`${config.getEndpoint()}/games/${currentGameId}/rounds/active`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(resp => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                throw resp;
            }
        })
            .then(response => {
                return response;
            }).catch(error => {
                error.json().then(errorResponse => {
                    toast.showToast(errorResponse.message, true);
                })
            })
    }

    playTurn(guessedWord) {
        const currentGameId = JSON.parse(sessionStorage.getItem("activeGame")).gameId;
        const data = {
            "guessedWord": guessedWord
        }

        return fetch(`${config.getEndpoint()}/games/${currentGameId}/rounds/turn`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then(resp => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                throw resp;
            }
        })
            .then(response => {
                return response;
            }).catch(error => {
                error.json().then(errorResponse => {
                    toast.showToast(errorResponse.message, true);
                })
            })
    }

    getGameMessage(message) {
        return fetch("assets/resources/gameMessages.json", {}).then(resp => resp.json())
            .then(response => {
                return response[message];
            });
    }
}

export default new Game();