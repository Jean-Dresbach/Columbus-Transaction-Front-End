import { checkAuthentication } from "../modules/auth-guard.js"
import { initNavigation } from "../modules/navigation.js"
import { populateTable, updateBalance } from "../modules/transactions.js"
import { formatCurrencyInput } from "../modules/format.js"
import { showEditModal } from "../modules/modals.js"

checkAuthentication()

// Variáveis globais e referências aos elementos
let filterState = 0
let transactions = [] // Você pode buscar as transações via API
const originalValues = {}

const tableBody = document.getElementById("transaction-table-body")
const typeFilter = document.getElementById("toogle-type-filter")
const balanceElement = document.querySelector(".balance h1")
const newTransactionValueInput = document.getElementById(
    "new-transaction-value"
)
const editTransactionValueInput = document.getElementById(
    "edit-transaction-value"
)
const openAside = document.querySelector(".open-aside")
const closeAside = document.querySelector(".close-aside")
const aside = document.querySelector("aside")

// Inicializa a navegação (mostra a página correta de acordo com o hash)
initNavigation()

// Formata os inputs de valor como moeda
formatCurrencyInput(newTransactionValueInput)
formatCurrencyInput(editTransactionValueInput)

// Exemplo: Lidar com clique no botão de filtro
typeFilter.addEventListener("click", () => {
    filterState = (filterState + 1) % 3
    // Re-popula a tabela com base no filterState atualizado
    populateTable(transactions, filterState, tableBody, typeFilter, data =>
        updateBalance(data, balanceElement)
    )
})

// Exemplo: Lidar com abertura e fechamento do aside (menu lateral)
openAside.addEventListener("click", () => {
    aside.classList.toggle("block")
    closeAside.classList.toggle("flex")
})
closeAside.addEventListener("click", () => {
    aside.classList.toggle("block")
    closeAside.classList.toggle("flex")
})

// Exemplo: Registro de event listener para as linhas da tabela (caso seja dinâmica, adicione ao criar cada linha)
// Suponha que as linhas sejam criadas dinamicamente na função populateTable
// Você pode, por exemplo, delegar o evento no próprio tableBody:
tableBody.addEventListener("click", event => {
    const row = event.target.closest("tr")
    if (!row) return
    // Obter dados da transação a partir da linha (ajuste conforme sua estrutura)
    const transactionData = {
        value: row.querySelector("td:nth-child(2)").textContent.trim(),
        method: row.querySelector("td:nth-child(3)").textContent.trim(),
        category: row.querySelector("td:nth-child(4)").textContent.trim(),
        type: row.querySelector("td:nth-child(5)").textContent.trim(),
    }
    // Exibe o modal de edição e habilita ou desabilita o botão de atualizar conforme houver alterações
    showEditModal(transactionData, originalValues, isChanged => {
        document.getElementById("save-update-button").disabled = !isChanged
    })
})

// Aqui você pode adicionar chamadas à API para carregar transações
// Exemplo (descomente e ajuste conforme seu backend):
/*
import { fetchTransactions } from "../services/api.js";
fetchTransactions()
  .then(data => {
    transactions = data;
    populateTable(transactions, filterState, tableBody, typeFilter, data => updateBalance(data, balanceElement));
  })
  .catch(error => {
    console.error("Erro ao carregar transações:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Erro ao carregar transações</td></tr>`;
  });
*/
