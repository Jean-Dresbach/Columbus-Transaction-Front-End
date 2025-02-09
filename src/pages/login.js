// src/pages/login.js
import { login } from "../services/api.js"
import { clearValidationOnInput } from "../modules/formHelpers.js"
import {
    validateRequired,
    validateEmailFormat,
    validateMinLength,
} from "../modules/validation.js"

// Registra os "clear" para os inputs
clearValidationOnInput("email", "error-email")
clearValidationOnInput("password", "error-password")

document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault()
        event.stopPropagation()

        const form = this
        const emailField = document.getElementById("email")
        const passwordField = document.getElementById("password")
        const emailError = document.getElementById("error-email")
        const passwordError = document.getElementById("error-password")

        // Limpa mensagens e validade personalizada
        emailField.setCustomValidity("")
        passwordField.setCustomValidity("")
        emailError.innerText = ""
        passwordError.innerText = ""

        // Valida o e-mail: campo obrigatório e formato
        let isValid = true
        isValid =
            validateRequired(
                emailField,
                emailError,
                "Por favor, preencha o campo de e-mail."
            ) && isValid
        isValid = validateEmailFormat(emailField, emailError) && isValid

        // Valida a senha: campo obrigatório e mínimo 6 caracteres
        isValid =
            validateRequired(
                passwordField,
                passwordError,
                "Por favor, preencha o campo de senha."
            ) && isValid
        isValid =
            validateMinLength(
                passwordField,
                passwordError,
                6,
                "A senha deve ter no mínimo 6 caracteres."
            ) && isValid

        if (!form.checkValidity() || !isValid) {
            form.classList.add("was-validated")
            return
        }

        const email = emailField.value.trim()
        const password = passwordField.value
        const stayLoggedIn = document.getElementById("stay-logged-in").checked

        try {
            const response = await login(email, password, stayLoggedIn)
            localStorage.setItem("token", response.token)
            localStorage.setItem("user", JSON.stringify(response.data))

            const toastBodyElement = document.querySelector(".toast-body")
            toastBodyElement.innerText = response.message

            const toastLiveExample = document.getElementById("liveToast")
            const toastInstance =
                bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastInstance.show()

            setTimeout(() => {
                window.location.href = "/home.html#transactions"
            }, 2000)
        } catch (error) {
            if (error.response?.data?.code === 401) {
                const message = error.response.data.message
                emailError.innerText = message
                passwordError.innerText = message
                emailField.setCustomValidity(message)
                passwordField.setCustomValidity(message)
            } else {
                console.error("Erro ao logar usuário: ", error)
            }
            form.classList.add("was-validated")
        }
    })
