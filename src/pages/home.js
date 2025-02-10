import { checkAuthentication } from "../modules/auth-guard.js"
import { initNavigation } from "../modules/navigation.js"
import { addFormChangeListeners } from "../modules/validation.js"
import {
    populateTable,
    updateTableBasedOnFilters,
} from "../modules/transactions.js"
import { formatCurrencyInput, unformatCurrency } from "../modules/format.js"
import { showConfirmationModal } from "../modules/modals.js"
import { debounce } from "../modules/formHelpers.js"
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateUser,
    updatePassword,
    deleteUser,
} from "../services/api.js"

checkAuthentication()

let filterState = 0
let transactionClickedData = {}
const originalValues = {}
const transactions = []
const userData = JSON.parse(localStorage.getItem("user"))
const logoutButton = document.getElementById("logout-btn")
const updateProfileForm = document.getElementById("update-profile-form")
const nameInput = document.getElementById("update-name")
const emailInput = document.getElementById("update-email")
const updatePasswordForm = document.getElementById("update-password-form")
const currentPasswordInput = document.getElementById("current-password")
const newPasswordInput = document.getElementById("new-password")
const confirmPasswordInput = document.getElementById("confirm-password")
const deleteAccountButton = document.getElementById("delete-account-button")
const cancelUpdateButton = document.getElementById("cancel-update-button")
const deleteTransactionButton = document.getElementById(
    "exclude-transaction-button"
)
const openAside = document.querySelectorAll(".open-aside")
const closeAside = document.querySelector(".close-aside")
const aside = document.querySelector("aside")
const tableBody = document.getElementById("transaction-table-body")
const userTitleElement = document.querySelector(".user-title-element")
const typeFilter = document.getElementById("toogle-type-filter")
const balanceElement = document.querySelector(".balance h1")
const editTransactionForm = document.getElementById("edit-transaction-form")
const createTransactionForm = document.getElementById("form-new-transaction")
const searchInput = document.getElementById("search-input")
const newTransactionValueInput = document.getElementById(
    "new-transaction-value"
)
const editTransactionValueInput = document.getElementById(
    "edit-transaction-value"
)

initNavigation()

formatCurrencyInput(newTransactionValueInput)
formatCurrencyInput(editTransactionValueInput)

addFormChangeListeners({
    updateName: userData.name,
    updateEmail: userData.email,
})

nameInput.value = userData.name
emailInput.value = userData.email

const showToast = (message, isSuccess) => {
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
    }, 3000)
}

document.addEventListener("DOMContentLoaded", async () => {
    userTitleElement.innerText = userData.name

    try {
        const result = await fetchTransactions()

        transactions.length = 0
        transactions.push(...result)

        populateTable(
            result,
            filterState,
            tableBody,
            typeFilter,
            balanceElement
        )
    } catch (error) {
        showToast(
            error.response?.data?.message || "Erro ao buscar transações.",
            false
        )
    }
})

createTransactionForm.addEventListener("submit", async event => {
    event.preventDefault()

    try {
        const type = document.getElementById("new-transaction-type").value
        const method = document.getElementById("new-transaction-method").value
        const category = document.getElementById(
            "new-transaction-category"
        ).value

        const result = await createTransaction(
            unformatCurrency(newTransactionValueInput.value),
            type,
            method,
            category
        )

        showToast(result.message, true)

        setTimeout(() => {
            location.reload()
        }, 3000)
    } catch (error) {
        showToast(
            error.response?.data?.message || "Erro ao criar transação.",
            false
        )
    }
})

editTransactionForm.addEventListener("submit", async event => {
    event.preventDefault()

    showConfirmationModal(async () => {
        try {
            const value = document.getElementById(
                "edit-transaction-value"
            ).value
            const method = document.getElementById(
                "edit-transaction-method"
            ).value
            const category = document.getElementById(
                "edit-transaction-category"
            ).value
            const type = document.getElementById("edit-transaction-type").value

            const result = await updateTransaction(transactionClickedData.id, {
                value: unformatCurrency(value),
                method,
                category,
                type,
            })

            showToast(result.message, true)

            setTimeout(() => {
                location.reload()
            }, 3000)
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                    "Erro ao atualizar a transação.",
                false
            )
        }
    }, "deseja atualizar esta transação?")
})

deleteTransactionButton.addEventListener("click", async () => {
    showConfirmationModal(async () => {
        try {
            const result = await deleteTransaction(transactionClickedData.id)

            showToast(result.message, true)

            setTimeout(() => {
                location.reload()
            }, 2000)
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao excluír a transação.",
                false
            )
        }
    }, "deseja excluír esta transação?")
})

searchInput.addEventListener(
    "input",
    debounce(() => {
        const filteresArray = updateTableBasedOnFilters(
            searchInput,
            transactions
        )
        populateTable(
            filteresArray,
            filterState,
            tableBody,
            typeFilter,
            balanceElement
        )
    }, 800)
)

updateProfileForm.addEventListener("submit", async event => {
    event.preventDefault()

    const name = nameInput.value.trim()
    const email = emailInput.value.trim()

    showConfirmationModal(async () => {
        try {
            const result = await updateUser(name, email)

            localStorage.setItem("user", JSON.stringify(result.data))

            showToast(result.message, true)

            setTimeout(() => {
                location.reload()
            }, 2000)
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao atualizar o perfil.",
                false
            )
            setTimeout(() => {
                location.reload()
            }, 2000)
        }
    }, "que deseja atualizar seu perfil?")
})

updatePasswordForm.addEventListener("submit", async event => {
    event.preventDefault()

    const currentPassword = currentPasswordInput.value
    const newPassword = newPasswordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (newPassword !== confirmPassword) {
        showToast("A nova senha não coincide com a confirmação.", false)
        return
    }

    showConfirmationModal(async () => {
        try {
            const result = await updatePassword(currentPassword, newPassword)

            showToast(result.message, true)
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao atualizar a senha.",
                false
            )
        }
    }, "deseja alterar sua senha?")
})

deleteAccountButton.addEventListener("click", () => {
    showConfirmationModal(async () => {
        try {
            const result = await deleteUser()

            showToast(result.message, true)

            localStorage.removeItem("user")
            localStorage.removeItem("token")

            setTimeout(() => {
                window.location.href = "/"
            }, 2000)
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao excluir conta.",
                false
            )
        }
    }, "deseja excluir sua conta?")
})

typeFilter.addEventListener("click", () => {
    filterState = (filterState + 1) % 3

    populateTable(
        transactions,
        filterState,
        tableBody,
        typeFilter,
        balanceElement
    )
})

openAside.forEach(button => {
    button.addEventListener("click", () => {
        aside.classList.toggle("block")
        closeAside.classList.toggle("flex")
    })
})

closeAside.addEventListener("click", () => {
    aside.classList.toggle("block")
    closeAside.classList.toggle("flex")
})

cancelUpdateButton.addEventListener("click", () => {
    document.getElementById("save-update-button").disabled = true
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

    transactionClickedData = {
        id: row.querySelector("th").id,
        value: row.querySelector("td:nth-child(2)").textContent,
        method: row.querySelector("td:nth-child(3)").textContent,
        category: row.querySelector("td:nth-child(4)").textContent,
        type: row.querySelector("td:nth-child(5)").textContent,
    }

    document.getElementById("edit-transaction-value").value =
        transactionClickedData.value
    document.getElementById("edit-transaction-category").value =
        transactionClickedData.category
    document.getElementById("edit-transaction-method").value =
        transactionClickedData.method
    document.getElementById("edit-transaction-type").value =
        transactionClickedData.type

    Object.assign(originalValues, transactionClickedData)

    addFormChangeListeners(transactionClickedData)
})
