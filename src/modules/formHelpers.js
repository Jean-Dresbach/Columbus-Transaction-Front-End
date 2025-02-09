export function clearValidationOnInput(fieldId, errorId) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(errorId)
    if (field) {
        field.addEventListener("input", () => {
            field.setCustomValidity("")
            if (errorElement) errorElement.innerText = ""
        })
    }
}
