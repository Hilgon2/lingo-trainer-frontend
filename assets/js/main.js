import auth from "./modules/Authentication.js";
import config from "./modules/Config.js";

window.onload = () => {
    onLoad();
}

function onLoad() {
    if (config.getEndpoint() === null) {
        onLoad();
    } else {
        checkIfLoggedIn();
    }
}

function checkIfLoggedIn() {
    setTimeout(() => {
        auth.checkLogin();
    }, 100);
}
