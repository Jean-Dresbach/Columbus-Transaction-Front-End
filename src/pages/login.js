import { login } from "../services/api";

document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
        const form = this;

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value;

            try {
                const response = await login(email, password);
                console.log("Usuário logado:", response.user);

                localStorage.setItem("token", response.token);

                document.getElementById("email").setCustomValidity("");
                document.getElementById("password").setCustomValidity("");

                window.location.href = "/home.html";
            } catch (error) {
                document
                    .getElementById("email")
                    .setCustomValidity("E-mail ou senha inválidos.");
                document
                    .getElementById("password")
                    .setCustomValidity("E-mail ou senha inválidos.");
            }
        }

        // Adiciona a classe de validação do Bootstrap
        form.classList.add("was-validated");
    });
