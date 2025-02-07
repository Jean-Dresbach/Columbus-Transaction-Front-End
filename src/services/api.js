import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
})

// Adiciona o token de autorização ao cabeçalho automaticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token")

    // Ignora as rotas de login e signup
    if (!["/login", "/signup"].includes(config.url) && token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export const login = async (email, password) => {
    const response = await api.post("/login", { email, password })
    return response.data
}

export const signup = async (name, email, password) => {
    const response = await api.post("/signup", { name, email, password })
    return response.data
}

export const fetchTransactions = async () => {
    try {
        const response = await api.get("/transactions")
        return response.data
    } catch (error) {
        console.error("Erro ao buscar as transações:", error)
        return []
    }
}

export const createTransaction = async transaction => {
    try {
        const response = await api.post("/transactions", transaction)
        return response.data
    } catch (error) {
        console.error("Erro ao criar transação:", error)
        throw error
    }
}

export const updateTransaction = async (transactionId, updatedTransaction) => {
    try {
        const response = await api.put(
            `/transactions/${transactionId}`,
            updatedTransaction
        )
        return response.data
    } catch (error) {
        console.error("Erro ao atualizar transação:", error)
        throw error
    }
}

export const deleteTransaction = async transactionId => {
    try {
        await api.delete(`/transactions/${transactionId}`)
    } catch (error) {
        console.error("Erro ao excluir transação:", error)
        throw error
    }
}
