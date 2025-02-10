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
    const nameInput = document.getElementById("update-name")
    const emailInput = document.getElementById("update-email")

    emailInput.removeEventListener("input", checkForChanges)
    nameInput.removeEventListener("input", checkForChanges)
    valueInput.removeEventListener("input", checkForChanges)
    methodSelect.removeEventListener("change", checkForChanges)
    categoryInput.removeEventListener("input", checkForChanges)
    typeSelect.removeEventListener("change", checkForChanges)

    valueInput.addEventListener("input", event => {
        checkForChanges({ value: event.target.value }, originalValues)
    })
    methodSelect.addEventListener("change", event => {
        checkForChanges({ method: event.target.value }, originalValues)
    })
    categoryInput.addEventListener("input", event => {
        checkForChanges({ category: event.target.value.trim() }, originalValues)
    })
    typeSelect.addEventListener("change", event => {
        checkForChanges({ type: event.target.value }, originalValues)
    })
    emailInput.addEventListener("input", event => {
        checkForChanges(
            { updateEmail: event.target.value.trim() },
            originalValues
        )
    })
    nameInput.addEventListener("input", event => {
        checkForChanges(
            { updateName: event.target.value.trim() },
            originalValues
        )
    })
}

const hasChanged = (currentValue, originalValues, property) => {
    return (
        currentValue[property] !== undefined &&
        currentValue[property] !== originalValues[property]
    )
}

const checkForChanges = (currentValue, originalValues) => {
    const transactionProperties = ["value", "method", "category", "type"]
    const profileProperties = ["updateName", "updateEmail"]

    const isTransactionChanged = transactionProperties.some(prop =>
        hasChanged(currentValue, originalValues, prop)
    )
    document.querySelector("#save-update-button").disabled =
        !isTransactionChanged

    const isProfileChanged = profileProperties.some(prop =>
        hasChanged(currentValue, originalValues, prop)
    )
    document.querySelector("#save-update-profile").disabled = !isProfileChanged
}
