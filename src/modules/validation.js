// src/modules/validation.js
export function validateRequired(field, errorElement, message) {
    if (field.value.trim() === "") {
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}

export function validateEmailFormat(field, errorElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(field.value.trim())) {
        const message = "Por favor, insira um e-mail válido."
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}

export function validateMinLength(field, errorElement, minLength, message) {
    if (field.value.length < minLength) {
        errorElement.innerText = message
        field.setCustomValidity(message)
        return false
    }
    return true
}
