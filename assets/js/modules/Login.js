import config from "./Config.js";

class Login {
    constructor() {

    }

    login(form) {
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

                }
                resp.json();
            })
            .then(response => {
                sessionStorage.setItem("token", response.token);
                console.log("hey");
                window.location.replace("index.html");
            });
    }
}

export default new Login();