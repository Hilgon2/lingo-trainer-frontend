import login from "./modules/Login.js";
import config from "./modules/Config.js";

bindEvents();

function bindEvents() {
    document.querySelector(".login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        login.login(event.target);
    })
}