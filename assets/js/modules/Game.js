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
                return response;
            });
    }

    newGame(language) {
        const data = {
            "languageCode": language
        };

        fetch(`${config.getEndpoint()}/games`, {
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
                console.log(response);
            }).catch(error => {
                error.json().then(errorResponse => {
                    toast.showToast(errorResponse.message, true);
                })
        })
    }

    newRound() {

    }

    playTurn() {

    }


}

export default new Game();