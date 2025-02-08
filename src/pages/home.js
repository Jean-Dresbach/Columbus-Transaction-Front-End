document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page")
    const navLinks = document.querySelectorAll(".nav-link")
    const typeFilter = document.getElementById("toogle-type-filter")
    const tableBody = document.getElementById("transaction-table-body")
    const balanceElement = document.querySelector(".balance h1")
    const openAside = document.querySelector(".open-aside")
    const closeAside = document.querySelector(".close-aside")
    const transactionRows = document.querySelectorAll(
        "#transaction-table tbody tr"
    )
    const formEditTransaction = document.getElementById("edit-transaction-form")
    const formNewTransaction = document.getElementById("form-new-transaction")

    const newTransactionValueInput = document.getElementById(
        "new-transaction-value"
    )
    const editTransactionValueInput = document.getElementById(
        "edit-transaction-value"
    )
    const saveUpdateButton = document.getElementById("save-update-button")
    const excludeTransactionButton = document.getElementById(
        "exclude-transaction-button"
    )
    const cancelCreateTransactionButtom = document.getElementById(
        "cancel-create-transaction"
    )
    const aside = document.querySelector("aside")
    const openCreateTransactionModal = document.getElementById(
        "create-transaction-btn"
    )
    const createTransactionModal = document.getElementById("create-modal")

    const originalValues = {}
    const formFields = [
        "edit-transaction-value",
        "edit-transaction-category",
        "edit-transaction-method",
        "edit-transaction-type",
    ]

    let filterState = 0
    let transactions = []
    let transactionId = null

    const updatePageVisibility = () => {
        const hash = window.location.hash || "#transactions"

        pages.forEach(page => {
            page.classList.toggle("hidden", `#${page.id}` !== hash)
        })

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === hash)
        })
    }

    const populateTable = data => {
        // Limpa o conteúdo atual da tabela
        tableBody.innerHTML = ""

        // Filtra os dados com base no filterState
        const filteredData = data.filter(item => {
            if (filterState === 1) {
                return item.type === "entrada" // Apenas entradas
            } else if (filterState === 2) {
                return item.type === "saida" // Apenas saídas
            }
            return true // Quando filterState for 0, retorna todos os itens
        })

        // Cria as linhas da tabela para os dados filtrados
        filteredData.forEach(item => {
            const row = document.createElement("tr")

            // Adiciona as classes apropriadas (entry ou exit)
            const entryExitClass = item.type === "entrada" ? "entry" : "exit"
            row.classList.add(entryExitClass)

            // Cria as células da linha
            row.innerHTML = `
                <th scope="row">
                    <i class="bi bi-cash"></i>
                </th>
                <td>${formatToCurrency(item.value)}</td>
                <td>${item.method}</td>
                <td>${item.category}</td>
            `

            tableBody.appendChild(row)
        })

        // Atualiza o ícone do botão de filtro com base no estado atual
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

    // Evento de clique em uma linha da tabela
    transactionRows.forEach(row => {
        row.addEventListener("click", event => {
            // Obtendo o ID da transação da linha clicada
            transactionId = row.id

            // Obtendo os valores da linha
            const transactionType = row
                .querySelector("td:nth-child(5)")
                .textContent.trim() // Entrada/Saída
            const transactionValue = row
                .querySelector("td:nth-child(2)")
                .textContent.trim() // Valor
            const transactionCategory = row
                .querySelector("td:nth-child(4)")
                .textContent.trim() // Categoria
            const transactionMethod = row
                .querySelector("td:nth-child(3)")
                .textContent.trim() // Método

            // Preenchendo os campos do formulário no modal
            document.getElementById("edit-transaction-value").value =
                transactionValue
            document.getElementById("edit-transaction-category").value =
                transactionCategory
            document.getElementById("edit-transaction-method").value =
                transactionMethod
            document.getElementById("edit-transaction-type").value =
                transactionType

            // Armazenando os valores originais para comparação
            originalValues.value = transactionValue
            originalValues.category = transactionCategory
            originalValues.method = transactionMethod
            originalValues.type = transactionType

            // Abrindo o modal
            const editModal = new bootstrap.Modal(
                document.getElementById("edit-modal")
            )
            editModal.show()

            saveUpdateButton.disabled = true
        })
    })

    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId)

        field.addEventListener("input", () => {
            const value = field.value
            let isChanged = false

            // Verifica se o campo foi alterado
            switch (fieldId) {
                case "edit-transaction-value":
                    isChanged = value !== originalValues.value
                    break
                case "edit-transaction-category":
                    isChanged = value !== originalValues.category
                    break
                case "edit-transaction-method":
                    isChanged = value !== originalValues.method
                    break
                case "edit-transaction-type":
                    isChanged = value !== originalValues.type
                    break
            }

            // Habilitar/Desabilitar o botão de submit dependendo da alteração

            saveUpdateButton.disabled = !isChanged
        })
    })

    formEditTransaction.addEventListener("submit", event => {
        event.preventDefault()

        // Preparando os dados para envio
        const updatedData = {}

        // Verificando quais campos foram alterados
        const value = document.getElementById("edit-transaction-value").value
        const category = document.getElementById(
            "edit-transaction-category"
        ).value
        const method = document.getElementById("edit-transaction-method").value
        const type = document.getElementById("edit-transaction-type").value

        if (value !== originalValues.value) updatedData.value = value
        if (category !== originalValues.category)
            updatedData.category = category
        if (method !== originalValues.method) updatedData.method = method
        if (type !== originalValues.type) updatedData.type = type

        // Adicionando o ID da transação
        updatedData.id = transactionId

        // Realizando a requisição para a API com os dados modificados
        // axios.put(`/api/transactions/${transactionId}`, updatedData)
        //     .then((response) => {
        //         // Tratar resposta da API
        //         console.log(response.data);
        //         alert("Transação atualizada com sucesso!");
        //         // Fechar o modal
        //         const editModal = bootstrap.Modal.getInstance(document.getElementById("edit-modal"));
        //         editModal.hide();
        //     })
        //     .catch((error) => {
        //         // Tratar erro na requisição
        //         console.error("Erro ao atualizar transação:", error);
        //         alert("Erro ao atualizar transação. Tente novamente.");
        //     });
    })

    excludeTransactionButton.addEventListener("click", () => {
        // axios.delete(`/api/transactions/${transactionId}`)
        //     .then(() => {
        //         alert("Transação excluída com sucesso!");
        //         // Fechar o modal e remover a linha da tabela
        //         const rowToDelete = document.getElementById(transactionId);
        //         rowToDelete.remove();
        //         const editModal = bootstrap.Modal.getInstance(document.getElementById("edit-modal"));
        //         editModal.hide();
        //     })
        //     .catch((error) => {
        //         console.error("Erro ao excluir transação:", error);
        //         alert("Erro ao excluir transação. Tente novamente.");
        //     });
    })

    const updateBalance = data => {
        if (data.length === 0) {
            balanceElement.innerHTML = `<sup>R$</sup>0<sub>,00</sub>`
            return
        }

        const totalBalance = data.reduce((acc, transaction) => {
            if (transaction.type === "entrada") {
                return acc + transaction.value
            } else if (transaction.type === "saida") {
                return acc - transaction.value
            }
            return acc
        }, 0)

        // Divide o saldo em parte inteira e centavos
        const integerPart = Math.floor(totalBalance)
        const decimalPart = Math.round((totalBalance - integerPart) * 100)

        // Formata a parte inteira e os centavos
        const formattedInteger = integerPart.toLocaleString("pt-BR")
        const formattedDecimal = decimalPart.toString().padStart(2, "0")

        balanceElement.innerHTML = `<sup>R$</sup>${formattedInteger}<sub>,${formattedDecimal}</sub>`
    }

    function formatToCurrency(amount) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(amount)
    }

    // const loadTransactions = async () => {
    //     try {
    //         transactions = await fetchTransactions()
    //         populateTable(transactions)
    //     } catch (error) {
    //         console.error("Erro ao buscar as transações:", error)
    //         tableBody.innerHTML = `<tr><td colspan="4">Erro ao carregar transações</td></tr>` // Exibe erro na tabela
    //     }
    // }

    // loadTransactions()
    updatePageVisibility()

    // Função para formatar valores como moeda
    function formatCurrencyInput(inputElement) {
        inputElement.addEventListener("input", () => {
            let value = inputElement.value

            // Remove tudo que não seja número ou vírgula
            value = value.replace(/\D/g, "")

            // Formata o número como moeda
            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
            value = (value / 100).toLocaleString("pt-BR", options)

            // Atualiza o valor do input
            inputElement.value = value
        })
    }

    formatCurrencyInput(newTransactionValueInput)
    formatCurrencyInput(editTransactionValueInput)

    typeFilter.addEventListener("click", () => {
        filterState = (filterState + 1) % 3
        populateTable(transactions)
    })

    openAside.addEventListener("click", () => {
        aside.classList.toggle("block")
        closeAside.classList.toggle("flex")
    })

    closeAside.addEventListener("click", () => {
        aside.classList.toggle("block")
        closeAside.classList.toggle("flex")
    })

    createTransactionModal.addEventListener("shown.bs.modal", () => {
        openCreateTransactionModal.onclick()
    })

    cancelCreateTransactionButtom.addEventListener("click", () => {
        formNewTransaction.reset()
    })

    window.addEventListener("hashchange", updatePageVisibility)
})
