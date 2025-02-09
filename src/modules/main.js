// main.js
import { initNavigation } from "./navigation.js"
import { populateTable, updateBalance } from "./transactions.js"
import { formatCurrencyInput } from "./format.js"
import { showEditModal } from "./modals.js"

// Registre os event listeners, inicialize variáveis globais e carregue as funcionalidades da página.
document.addEventListener("DOMContentLoaded", () => {
    // Exemplo de uso:
    initNavigation()

    const tableBody = document.getElementById("transaction-table-body")
    const typeFilter = document.getElementById("toogle-type-filter")
    const balanceElement = document.querySelector(".balance h1")

    // Suponha que você tenha uma função para buscar transações...
    // fetchTransactions().then(transactions => {
    //   populateTable(transactions, filterState, tableBody, typeFilter, (data) => updateBalance(data, balanceElement));
    // });

    // Configuração dos inputs para formatação de moeda
    const newTransactionValueInput = document.getElementById(
        "new-transaction-value"
    )
    const editTransactionValueInput = document.getElementById(
        "edit-transaction-value"
    )
    formatCurrencyInput(newTransactionValueInput)
    formatCurrencyInput(editTransactionValueInput)

    // Outros event listeners e lógicas de modais podem ser configurados aqui ou importados de outros módulos...
})
