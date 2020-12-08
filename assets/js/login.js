import authentication from "./modules/Authentication.js";

bindEvents();

function bindEvents() {
    document.querySelector(".login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        authentication.login(event.target);
    });

    document.querySelector(".register-form").addEventListener("submit", (event) => {
        event.preventDefault();
        authentication.register(event.target);
    });

    document.querySelector(".register-link").addEventListener("click", (event) => {
       event.preventDefault();
       document.querySelector(".login").classList.add("hidden");
       document.querySelector(".register").classList.remove("hidden");
    });

    document.querySelector(".login-link").addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".register").classList.add("hidden");
        document.querySelector(".login").classList.remove("hidden");
    });
}