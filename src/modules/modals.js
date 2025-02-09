export const showEditModal = transactionData => {
    document.getElementById("edit-transaction-value").value =
        transactionData.value
    document.getElementById("edit-transaction-category").value =
        transactionData.category
    document.getElementById("edit-transaction-method").value =
        transactionData.method
    document.getElementById("edit-transaction-type").value =
        transactionData.type

    const editModalElement = document.getElementById("edit-modal")
    const editModal = new bootstrap.Modal(editModalElement)
    editModal.show()
}

export const showConfirmationModal = async (action, message) => {
    const confirmButton = document.getElementById("confirmButton")
    const confirmationText = document.getElementById("confirmationText")
    const confirmationModal = new bootstrap.Modal(
        document.getElementById("confirmationModal")
    )

    return new Promise((resolve, reject) => {
        confirmationText.textContent = `Tem certeza que ${message}`

        confirmButton.onclick = () => {
            resolve(true)
            confirmationModal.hide()
        }

        document.querySelector("#confirmationModal .btn-secondary").onclick =
            () => {
                resolve(false)
                confirmationModal.hide()
            }

        confirmationModal.show()
    }).then(confirmed => {
        if (confirmed) {
            action()
        }
    })
}
