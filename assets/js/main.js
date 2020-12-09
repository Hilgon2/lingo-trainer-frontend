import auth from "./modules/Authentication.js";
import config from "./modules/Config.js";

beforeLoaded();
window.onload = () => onLoad();

function beforeLoaded() {
    if (!sessionStorage.getItem("token")) {
        if (!location.pathname.split("/").includes("login.html")) {
            return location.replace("login.html");
        }
    }
}

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
