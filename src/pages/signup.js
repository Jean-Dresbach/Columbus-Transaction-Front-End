document.getElementById("name").addEventListener("input", function () {
    this.setCustomValidity("")
})
document.getElementById("email").addEventListener("input", function () {
    this.setCustomValidity("")
    document.getElementById("error-email").innerText = ""
})
document.getElementById("password").addEventListener("input", function () {
    this.setCustomValidity("")
    document.getElementById("error-password").innerText = ""
})
document
    .getElementById("confirm-password")
    .addEventListener("input", function () {
        this.setCustomValidity("")
        document.getElementById("error-confirm-password").innerText = ""
    })

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

        nameElement.setCustomValidity("")
        emailElement.setCustomValidity("")
        passwordElement.setCustomValidity("")
        confirmPasswordElement.setCustomValidity("")
        nameError.innerText = ""
        emailError.innerText = ""
        passwordError.innerText = ""
        confirmPasswordError.innerText = ""

        if (nameElement.value.trim() === "") {
            nameError.innerText = "Por favor, preencha o campo de nome."
            nameElement.setCustomValidity(
                "Por favor, preencha o campo de nome."
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailElement.value.trim() === "") {
            emailError.innerText = "Por favor, preencha o campo de e-mail."
            emailElement.setCustomValidity("Campo de e-mail vazio")
        } else if (!emailRegex.test(emailElement.value.trim())) {
            emailError.innerText = "Por favor, insira um e-mail válido."
            emailElement.setCustomValidity("E-mail inválido")
        }

        if (passwordElement.value === "") {
            passwordError.innerText = "Por favor, preencha o campo de senha."
            passwordElement.setCustomValidity("Campo de senha vazio")
        } else if (passwordElement.value.length < 6) {
            passwordError.innerText = "A senha deve ter no mínimo 6 caracteres."
            passwordElement.setCustomValidity("Senha com menos de 6 caracteres")
        }

        if (confirmPasswordElement.value === "") {
            confirmPasswordError.innerText = "Por favor, confirme sua senha."
            confirmPasswordElement.setCustomValidity(
                "Campo de confirmação de senha vazio"
            )
        } else if (passwordElement.value !== confirmPasswordElement.value) {
            confirmPasswordError.innerText = "As senhas não coincidem."
            confirmPasswordElement.setCustomValidity("As senhas não coincidem.")
        }

        if (!form.checkValidity()) {
            form.classList.add("was-validated")
            return
        }

        try {
            const response = await signup(
                nameElement.value.trim(),
                emailElement.value.trim(),
                passwordElement.value
            )

            const tostBodyElement = document.querySelector(".toast-body")
            tostBodyElement.innerText = response.message

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

        form.classList.add("was-validated")
    })
