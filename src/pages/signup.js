import { signup } from "../services/api"

document
    .getElementById("signup-form")
    .addEventListener("submit", async function (event) {
        const form = this

        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value
        const confirmPassword =
            document.getElementById("confirm-password").value

        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            if (password !== confirmPassword) {
                event.preventDefault()
                event.stopPropagation()
                confirmPassword.setCustomValidity("As senhas não coincidem.")
            } else {
                email.setCustomValidity("")
                confirmPassword.setCustomValidity("")

                try {
                    const response = await signup(email, password)
                    console.log("Usuário cadastrado:", response.user)

                    // Redireciona para a página de login ou para a home
                    window.location.href = "/login.html"
                } catch (error) {
                    if (
                        error.response?.data?.message === "Email já cadastrado"
                    ) {
                        email.setCustomValidity(
                            "Este e-mail já está cadastrado."
                        )
                    } else {
                        alert("Erro ao cadastrar usuário. Tente novamente.")
                    }
                }
            }
        }

        form.classList.add("was-validated")
    })
