// Event listener para limpar os erros assim que o usuário digitar
document.getElementById("email").addEventListener("input", function () {
    this.setCustomValidity("")
    document.getElementById("error-email").innerText = ""
})

document.getElementById("password").addEventListener("input", function () {
    this.setCustomValidity("")
    document.getElementById("error-password").innerText = ""
})

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

        emailField.setCustomValidity("")
        passwordField.setCustomValidity("")
        emailError.innerText = ""
        passwordError.innerText = ""

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (emailField.value.trim() === "") {
            emailError.innerText = "Por favor, preencha o campo de e-mail."
            emailField.setCustomValidity("Campo de e-mail vazio")
        } else if (!emailRegex.test(emailField.value.trim())) {
            emailError.innerText = "Por favor, insira um e-mail válido."
            emailField.setCustomValidity("E-mail inválido")
        }

        if (passwordField.value === "") {
            passwordError.innerText = "Por favor, preencha o campo de senha."
            passwordField.setCustomValidity("Campo de senha vazio")
        } else if (passwordField.value.length < 6) {
            passwordError.innerText = "A senha deve ter no mínimo 6 caracteres."
            passwordField.setCustomValidity("Senha com menos de 6 caracteres")
        }

        if (!form.checkValidity()) {
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

            const tostBodyElement = document.querySelector(".toast-body")
            tostBodyElement.innerText = response.message

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
