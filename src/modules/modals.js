export const showConfirmationModal = (action, message) => {
    const confirmationModalElement =
        document.getElementById("confirmationModal")
    const confirmButton = document.getElementById("confirmButton")
    const cancelButton = document.getElementById("cancelButton")
    const confirmationText = document.getElementById("confirmationText")

    confirmationText.textContent = `Tem certeza que ${message}`

    const confirmationModal = new bootstrap.Modal(confirmationModalElement)

    const editModalElement = document.getElementById("edit-modal")
    let editModal
    let wasEditModalOpen = false

    if (editModalElement.classList.contains("show")) {
        editModal = bootstrap.Modal.getInstance(editModalElement)
        if (!editModal) {
            editModal = new bootstrap.Modal(editModalElement)
        }
        editModal.hide()
        wasEditModalOpen = true
    }

    confirmationModal.show()

    return new Promise(resolve => {
        const onConfirm = async () => {
            confirmButton.removeEventListener("click", onConfirm)
            cancelButton.removeEventListener("click", onCancel)
            confirmationModalElement.removeEventListener(
                "hidden.bs.modal",
                onCancelHandler
            )

            try {
                await action()
            } finally {
                confirmationModal.hide()
                resolve(true)
            }
        }

        const onCancel = () => {
            confirmButton.removeEventListener("click", onConfirm)
            cancelButton.removeEventListener("click", onCancel)
            confirmationModalElement.removeEventListener(
                "hidden.bs.modal",
                onCancelHandler
            )

            confirmationModal.hide()

            if (wasEditModalOpen) {
                editModal.show()
            }

            resolve(false)
        }

        const onCancelHandler = event => {
            confirmButton.removeEventListener("click", onConfirm)
            cancelButton.removeEventListener("click", onCancel)
            confirmationModalElement.removeEventListener(
                "hidden.bs.modal",
                onCancelHandler
            )

            if (wasEditModalOpen) {
                editModal.show()
            }

            resolve(false)
        }

        confirmButton.addEventListener("click", onConfirm)
        cancelButton.addEventListener("click", onCancel)

        confirmationModalElement.addEventListener(
            "hidden.bs.modal",
            onCancelHandler
        )
    })
}
