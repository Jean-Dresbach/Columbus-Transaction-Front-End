export const showConfirmationModal = async (action, message) => {
    const confirmButton = document.getElementById("confirmButton")
    const confirmationText = document.getElementById("confirmationText")

    return new Promise((resolve, _) => {
        confirmationText.textContent = `Tem certeza que ${message}`

        confirmButton.onclick = () => {
            resolve(true)
        }

        document.querySelector("#confirmationModal .btn-secondary").onclick =
            () => {
                resolve(false)
            }
    }).then(confirmed => {
        if (confirmed) {
            action()
        }
    })
}
