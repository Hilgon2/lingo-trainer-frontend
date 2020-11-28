class Config {
    apiConfig = null;

    constructor() {
        fetch("config/config.json")
            .then(resp => resp.json())
            .then(config => {
                fetch(`config/config-${config.environment}.json`)
                    .then(resp => resp.json())
                    .then(environmentConfig => {
                        this.apiConfig = environmentConfig;
                    }).catch(() => {
                    console.warn(`Something went wrong reading file config/config-${config.environment}.json. Check if the file is missing.`);
                });
            });
    }

    getEndpoint() {
        const config = this.apiConfig;
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