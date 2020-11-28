class Config {
    constructor() {
        this.apiConfig = null;

        fetch("config/config.json")
            .then(resp => resp.json())
            .then(config => {
                fetch(`config/config-${config.environment}.json`)
                    .then(resp => resp.json())
                    .then(environmentConfig => {
                        this.apiConfig = environmentConfig;
                    }).catch(error => {
                    console.warn(`Something went wrong reading file config/config-${config.environment}.json. Check if the file is missing.`);
                });
            })
    }

    getEndpoint() {
        return this.apiConfig.apiEndpoint;
    }
}

export default new Config();