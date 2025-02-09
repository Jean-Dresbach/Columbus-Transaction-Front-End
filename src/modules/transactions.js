// transactions.js
import { formatToCurrency } from "./format.js"

export const populateTable = (
    data,
    filterState,
    tableBody,
    typeFilter,
    updateBalance
) => {
    // Limpa o conteúdo atual da tabela
    tableBody.innerHTML = ""

    // Filtra os dados com base no filterState
    const filteredData = data.filter(item => {
        if (filterState === 1) return item.type === "entrada"
        if (filterState === 2) return item.type === "saida"
        return true
    })

    filteredData.forEach(item => {
        const row = document.createElement("tr")
        const entryExitClass = item.type === "entrada" ? "entry" : "exit"
        row.classList.add(entryExitClass)

        row.innerHTML = `
      <th scope="row"><i class="bi bi-cash"></i></th>
      <td>${formatToCurrency(item.value)}</td>
      <td>${item.method}</td>
      <td>${item.category}</td>
    `

        tableBody.appendChild(row)
    })

    const buttonIcons = [
        `<i class="bi bi-arrow-down-up"></i>`, // Ambos
        `<i class="bi bi-arrow-down"></i>`, // Apenas entradas
        `<i class="bi bi-arrow-up"></i>`, // Apenas saídas
    ]
    typeFilter.innerHTML = buttonIcons[filterState]

    typeFilter.classList.remove("entry", "exit")
    if (filterState === 1) {
        typeFilter.classList.add("entry")
    } else if (filterState === 2) {
        typeFilter.classList.add("exit")
    }

    updateBalance(data)
}

export const updateBalance = (data, balanceElement) => {
    if (data.length === 0) {
        balanceElement.innerHTML = `<sup>R$</sup>0<sub>,00</sub>`
        return
    }
    const totalBalance = data.reduce((acc, transaction) => {
        return transaction.type === "entrada"
            ? acc + transaction.value
            : transaction.type === "saida"
            ? acc - transaction.value
            : acc
    }, 0)

    const integerPart = Math.floor(totalBalance)
    const decimalPart = Math.round((totalBalance - integerPart) * 100)
    const formattedInteger = integerPart.toLocaleString("pt-BR")
    const formattedDecimal = decimalPart.toString().padStart(2, "0")

    balanceElement.innerHTML = `<sup>R$</sup>${formattedInteger}<sub>,${formattedDecimal}</sub>`
}
