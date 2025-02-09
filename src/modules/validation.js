export const validateRequired = (field, errorElement, message) => {
    if (field.value.trim() === "") {
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}

export const validateEmailFormat = (field, errorElement) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(field.value.trim())) {
        const message = "Por favor, insira um e-mail válido."
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}

export const validateMinLength = (field, errorElement, minLength, message) => {
    if (field.value.length < minLength) {
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}

export const addFormChangeListeners = originalValues => {
    const valueInput = document.getElementById("edit-transaction-value")
    const methodSelect = document.getElementById("edit-transaction-method")
    const categoryInput = document.getElementById("edit-transaction-category")
    const typeSelect = document.getElementById("edit-transaction-type")

    valueInput.removeEventListener("input", checkForChanges)
    methodSelect.removeEventListener("change", checkForChanges)
    categoryInput.removeEventListener("input", checkForChanges)
    typeSelect.removeEventListener("change", checkForChanges)
    valueInput.addEventListener("input", checkForChanges)
    methodSelect.addEventListener("change", checkForChanges)
    categoryInput.addEventListener("input", checkForChanges)
    typeSelect.addEventListener("change", checkForChanges)
}

function checkForChanges(originalValues) {
    const valueInput = document.getElementById("edit-transaction-value").value
    const methodSelect = document.getElementById(
        "edit-transaction-method"
    ).value
    const categoryInput = document
        .getElementById("edit-transaction-category")
        .value.trim()
    const typeSelect = document.getElementById("edit-transaction-type").value

    const currentValues = {
        value: valueInput,
        method: methodSelect,
        category: categoryInput,
        type: typeSelect,
    }

    const isChanged =
        currentValues.value !== originalValues.value ||
        currentValues.method !== originalValues.method ||
        currentValues.category !== originalValues.category ||
        currentValues.type !== originalValues.type

    // Habilita ou desabilita o botão de salvar
    document.getElementById("save-update-button").disabled = !isChanged
}
