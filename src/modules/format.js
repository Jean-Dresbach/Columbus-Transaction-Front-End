export const formatToCurrency = amount => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount)
}

export const formatCurrencyInput = inputElement => {
    inputElement.addEventListener("input", () => {
        let value = inputElement.value.replace(/\D/g, "")

        if (value.length === 0) {
            inputElement.value = ""
            return
        }

        value = (parseFloat(value) / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

        inputElement.value = value
    })
}
export const unformatCurrency = formattedValue => {
    let value = formattedValue.replace(/\./g, "")
    value = value.replace(",", ".")
    return parseFloat(value)
}
