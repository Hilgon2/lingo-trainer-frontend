import config from "./Config.js";

class Authentication {
    register(form) {
        const registerMessage = form.querySelector(".register__message");
        registerMessage.classList.remove("active");
        let username = form.querySelector("input[name='username']").value;
        let password = form.querySelector("input[name='password']").value;
        const data = {
            "username": username,
            "password": password
        }

        fetch(`${config.getEndpoint()}/users`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "post",
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(response => {
                let message = "";
                if (response.status && response.status !== 200) {
                    message = response.message;
                } else {
                    message = "Uw account is succesvol aangemaakt. Klik de link onderaan het formulier om naar de login pagina te gaan.";
                }
                setTimeout(() => {
                    registerMessage.classList.add("active");
                    registerMessage.textContent = message;
                    username = "";
                    password = "";
                }, 100);
            }).catch(error => {
            setTimeout(() => {
                registerMessage.classList.add("active");
                registerMessage.textContent = error;
            }, 100);
        });
    }

    login(form) {
        form.querySelector(".login__error").classList.remove("active");
        const data = {
            "username": form.querySelector("input[name='username']").value,
            "password": form.querySelector("input[name='password']").value
        }

        fetch(`${config.getEndpoint()}/auth/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "post",
            body: JSON.stringify(data)
        })
            .then(resp => {
                if (resp.status === 401) {
                    throw new Error(resp.status);
                }
                return resp.json();
            })
            .then(response => {
                sessionStorage.setItem("token", response.token);
                window.location.replace("index.html");
            }).catch(error => {
            setTimeout(() => {
                form.querySelector(".login__error").classList.add("active");
            }, 100);
        });
    }

    checkLogin() {
        const token = sessionStorage.getItem("token");
        const loginPage = "./login.html";
        if (!token && !window.location.pathname.includes("login.html")) {
            window.location.replace(loginPage);
        }

        fetch(`${config.getEndpoint()}/auth/logged-in`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "post",
        }).then(resp => {
            let redirectPage;
            if (resp.status !== 204) {
                if (!window.location.pathname.includes("login.html")) {
                    redirectPage = loginPage;
                }
            } else {
                if (window.location.pathname.includes("login.html")) {
                    redirectPage = "./index.html";
                }
            }
            if (redirectPage) {
                window.location.replace(redirectPage);
            }
        });
    }
}

export default new Authentication();