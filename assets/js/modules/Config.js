class Config {
    constructor() {
        fetch("config/config.json")
            .then(resp => resp.json())
            .then(config => {
                fetch(`config/config-${config.environment}.json`)
                    .then(resp => resp.json())
                    .then(environmentConfig => {
                        sessionStorage.setItem("apiConfig", JSON.stringify(environmentConfig));
                    }).catch(() => {
                    console.warn(`Something went wrong reading file config/config-${config.environment}.json. Check if the file is missing.`);
                });
            });
    }

    getEndpoint() {
        const config = JSON.parse(sessionStorage.getItem("apiConfig"));

        if (!config) {
            setTimeout(() => {
                return this.getEndpoint();
            }, 300);
        } else {
            return config.apiEndpoint;
        }
    }
}

export default new Config();