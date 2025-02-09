import { formatToCurrency, unformatCurrency } from "./format.js"

export const populateTable = (
    data,
    filterState,
    tableBody,
    typeFilter,
    balanceElement
) => {
    // Limpa o conteúdo atual da tabela
    tableBody.innerHTML = ""

    // Filtra os dados com base no filterState
    const filteredData = data.filter(item => {
        if (filterState === 1) return item.type === "entrada"
        if (filterState === 2) return item.type === "saída"
        return true
    })

    filteredData.forEach(item => {
        const row = document.createElement("tr")
        const entryExitClass = item.type === "entrada" ? "entry" : "exit"
        row.classList.add(entryExitClass)

        row.setAttribute("data-bs-target", "#edit-modal")
        row.setAttribute("data-bs-toggle", "modal")

        row.innerHTML = `
            <th id="${item.id}" scope="row"><i class="bi bi-cash"></i></th>
            <td>${formatToCurrency(item.value)}</td>
            <td>${item.method}</td>
            <td>${item.category}</td>
            <td hidden>${item.type}</td>
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

    updateBalance(data, balanceElement)
}

export const updateBalance = (data, balanceElement) => {
    if (data.length === 0) {
        balanceElement.innerHTML = `<sup>R$</sup>0<sub>,00</sub>`
        return
    }
    const totalBalance = data.reduce((acc, transaction) => {
        return transaction.type === "entrada"
            ? acc + Number(transaction.value)
            : transaction.type === "saida"
            ? acc - Number(transaction.value)
            : acc
    }, 0)

    const integerPart = Math.floor(totalBalance)
    const decimalPart = Math.round((totalBalance - integerPart) * 100)
    const formattedInteger = integerPart.toLocaleString("pt-BR")
    const formattedDecimal = decimalPart.toString().padStart(2, "0")

    balanceElement.innerHTML = `<sup>R$</sup>${formattedInteger}<sub>,${formattedDecimal}</sub>`
}

export const updateUserTitleElement = name => {
    document.getElementById("user-name-title-element").innerText = name
}

export const updateTableBasedOnFilters = (searchInput, transactions) => {
    const searchQuery = searchInput.value.trim().toLowerCase()

    if (!searchQuery) return transactions

    let filteredTransactions = []

    if (searchQuery !== "") {
        filteredTransactions = transactions.filter(item => {
            const valueMatch = item.value
                .toString()
                .toLowerCase()
                .includes(searchQuery)
            const methodMatch = item.method.toLowerCase().includes(searchQuery)
            const categoryMatch = item.category
                .toLowerCase()
                .includes(searchQuery)

            return valueMatch || methodMatch || categoryMatch
        })
    }

    // Atualiza a tabela com as transações filtradas
    return filteredTransactions
}
