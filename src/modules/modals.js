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
