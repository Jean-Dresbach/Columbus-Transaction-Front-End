export const formatToCurrency = amount => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount)
}

export const formatCurrencyInput = inputElement => {
    inputElement.addEventListener("input", () => {
        let value = inputElement.value.replace(/\D/g, "")
        const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        value = (value / 100).toLocaleString("pt-BR", options)
        inputElement.value = value
    })
}
