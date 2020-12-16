import config from "./Config.js";
import toast from "./Toast.js";

class Dictionary {

    retrieveLanguages() {
        return fetch(`${config.getEndpoint()}/dictionary/languages`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
        })
            .then(resp => {
                if (resp.status === 200) {
                    return resp.json();
                }
                console.warn("Something went wrong while retrieving the available languages");
            })
            .then(response => {
                return response;
            });
    }

    saveDictionary(file, language) {
        const data = new FormData();
        data.append("wordsFile", file);
        data.append("languageCode", language);

        return fetch(`${config.getEndpoint()}/dictionary`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            method: "POST",
            body: data
        }).then(resp => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                const message = resp.status === 403 ? "U heeft geen rechten om een woordenlijst op te slaan" : "Er ging iets fout bij het opslaan van de woordenlijst";
                toast.showToast(message, true);
            }
        }).then(response => {
            if (response) {
                return response;
            }
        });
    }
}

export default new Dictionary();