// import { fetchTransactions } from "../services/api"

document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page")
    const navLinks = document.querySelectorAll(".nav-link")
    const typeFilter = document.getElementById("toogle-type-filter")
    const tableBody = document.getElementById("transaction-table-body")
    const balanceElement = document.querySelector(".balance h1")
    const openAside = document.querySelector(".open-aside")
    const closeAside = document.querySelector(".close-aside")
    const aside = document.querySelector("aside")

    let filterState = 0
    let transactions = []

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

    window.addEventListener("hashchange", updatePageVisibility)
})
