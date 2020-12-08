import config from "./Config.js";

class Dictionary {

    retrieveLanguages() {
        if (!config.getEndpoint()) {
            setTimeout(() => {
                return this.retrieveLanguages();
            }, 300);
        } else {
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
    }

    saveDictionary() {

    }
}

export default new Dictionary();