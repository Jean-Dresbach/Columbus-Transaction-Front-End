import { checkAuthentication } from "../modules/auth-guard.js"
import { initNavigation } from "../modules/navigation.js"
import {
    populateTable,
    updateBalance,
    updateUserTitleElement,
} from "../modules/transactions.js"
import { formatCurrencyInput } from "../modules/format.js"
import { showEditModal, showConfirmationModal } from "../modules/modals.js"
import { fetchTransactions } from "../services/api.js"

checkAuthentication()

let filterState = 0
const transactions = fetchTransactions()
const originalValues = {}
const userData = JSON.parse(localStorage.getItem("user"))
const logoutButton = document.getElementById("logout-btn")
const openAside = document.querySelector(".open-aside")
const closeAside = document.querySelector(".close-aside")
const aside = document.querySelector("aside")
const tableBody = document.getElementById("transaction-table-body")
const typeFilter = document.getElementById("toogle-type-filter")
const balanceElement = document.querySelector(".balance h1")
const newTransactionValueInput = document.getElementById(
    "new-transaction-value"
)
const editTransactionValueInput = document.getElementById(
    "edit-transaction-value"
)

initNavigation()

updateUserTitleElement(userData.name)
formatCurrencyInput(newTransactionValueInput)
formatCurrencyInput(editTransactionValueInput)

function showToast(message, isSuccess) {
    const toast = document.getElementById("toast")
    const toastBody = toast.querySelector(".toast-body")

    toast.classList.remove("bg-success", "bg-danger")

    if (isSuccess) {
        toast.classList.add("bg-success")
    } else {
        toast.classList.add("bg-danger")
    }

    toast.classList.add("show")

    toastBody.textContent = message

    setTimeout(() => {
        toast.classList.remove("show")
    }, 2000)
}

typeFilter.addEventListener("click", () => {
    filterState = (filterState + 1) % 3

    populateTable(transactions, filterState, tableBody, typeFilter, data =>
        updateBalance(data, balanceElement)
    )
})

openAside.addEventListener("click", () => {
    aside.classList.toggle("block")
    closeAside.classList.toggle("flex")
})

closeAside.addEventListener("click", () => {
    aside.classList.toggle("block")
    closeAside.classList.toggle("flex")
})

logoutButton.addEventListener("click", () => {
    showConfirmationModal(() => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")

        window.location.href = "/"
    }, "deseja deslogar?")
})

tableBody.addEventListener("click", event => {
    const row = event.target.closest("tr")
    if (!row) return

    const transactionData = {
        value: row.querySelector("td:nth-child(2)").textContent.trim(),
        method: row.querySelector("td:nth-child(3)").textContent.trim(),
        category: row.querySelector("td:nth-child(4)").textContent.trim(),
        type: row.querySelector("td:nth-child(5)").textContent.trim(),
    }
    showEditModal(transactionData, originalValues, isChanged => {
        document.getElementById("save-update-button").disabled = !isChanged
    })
})
