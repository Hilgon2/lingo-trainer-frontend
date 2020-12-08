import auth from "./modules/Authentication.js";
import config from "./modules/Config.js";

onLoad();

function onLoad() {
    if (config.getEndpoint() === null) {
        return onLoad();
    } else {
        checkIfLoggedIn();
    }
}

function checkIfLoggedIn() {
    setTimeout(() => {
        auth.checkLogin();
    }, 100);
}
