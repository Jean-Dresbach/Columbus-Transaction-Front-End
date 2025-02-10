// src/pages/signup.js
import { signup } from "../services/api.js" // Certifique-se de que esta função esteja implementada
import { clearValidationOnInput } from "../modules/formHelpers.js"
import {
    validateRequired,
    validateEmailFormat,
    validateMinLength,
} from "../modules/validation.js"
import { checkAuthentication } from "../modules/auth-guard.js"

checkAuthentication()
clearValidationOnInput("name", "error-name")
clearValidationOnInput("email", "error-email")
clearValidationOnInput("password", "error-password")
clearValidationOnInput("confirm-password", "error-confirm-password")

document
    .getElementById("signup-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault()
        event.stopPropagation()

        const form = this
        const nameElement = document.getElementById("name")
        const emailElement = document.getElementById("email")
        const passwordElement = document.getElementById("password")
        const confirmPasswordElement =
            document.getElementById("confirm-password")

        const nameError = document.getElementById("error-name")
        const emailError = document.getElementById("error-email")
        const passwordError = document.getElementById("error-password")
        const confirmPasswordError = document.getElementById(
            "error-confirm-password"
        )

        // Limpa mensagens e validade personalizada
        nameElement.setCustomValidity("")
        emailElement.setCustomValidity("")
        passwordElement.setCustomValidity("")
        confirmPasswordElement.setCustomValidity("")
        nameError.innerText = ""
        emailError.innerText = ""
        passwordError.innerText = ""
        confirmPasswordError.innerText = ""

        // Validação do campo nome
        let isValid = true
        isValid =
            validateRequired(
                nameElement,
                nameError,
                "Por favor, preencha o campo de nome."
            ) && isValid

        // Validação do e-mail
        isValid =
            validateRequired(
                emailElement,
                emailError,
                "Por favor, preencha o campo de e-mail."
            ) && isValid
        isValid = validateEmailFormat(emailElement, emailError) && isValid

        // Validação da senha
        isValid =
            validateRequired(
                passwordElement,
                passwordError,
                "Por favor, preencha o campo de senha."
            ) && isValid
        isValid =
            validateMinLength(
                passwordElement,
                passwordError,
                6,
                "A senha deve ter no mínimo 6 caracteres."
            ) && isValid

        // Validação da confirmação de senha
        if (confirmPasswordElement.value.trim() === "") {
            confirmPasswordError.innerText = "Por favor, confirme sua senha."
            confirmPasswordElement.setCustomValidity(
                "Campo de confirmação de senha vazio"
            )
            isValid = false
        } else if (passwordElement.value !== confirmPasswordElement.value) {
            confirmPasswordError.innerText = "As senhas não coincidem."
            confirmPasswordElement.setCustomValidity("As senhas não coincidem.")
            isValid = false
        }

        if (!form.checkValidity() || !isValid) {
            form.classList.add("was-validated")
            return
        }

        try {
            const response = await signup(
                nameElement.value.trim(),
                emailElement.value.trim(),
                passwordElement.value
            )

            const toastBodyElement = document.querySelector(".toast-body")
            toastBodyElement.innerText = response.message

            const toastLiveExample = document.getElementById("liveToast")
            const toastInstance =
                bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastInstance.show()

            setTimeout(() => {
                window.location.href = "/"
            }, 2000)
        } catch (error) {
            if (error.response?.data?.code === 409) {
                emailError.innerText = error.response.data.message
                emailElement.setCustomValidity(" ")
            } else {
                console.error("Erro ao cadastrar usuário: ", error)
            }
            form.classList.add("was-validated")
        }
    })
