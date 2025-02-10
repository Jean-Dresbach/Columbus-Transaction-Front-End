export const clearValidationOnInput = (fieldId, errorId) => {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(errorId)
    if (field) {
        field.addEventListener("input", () => {
            field.setCustomValidity("")
            if (errorElement) errorElement.innerText = ""
        })
    }
}

export const debounce = (func, delay) => {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
