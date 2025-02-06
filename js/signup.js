document
    .getElementById("signup-form")
    .addEventListener("submit", function (event) {
        const form = this;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (password !== confirmPassword) {
            event.preventDefault();
            event.stopPropagation();
            document
                .getElementById("confirm-password")
                .setCustomValidity("As senhas não coincidem.");
        } else {
            document.getElementById("confirm-password").setCustomValidity("");
        }

        form.classList.add("was-validated");
    });
