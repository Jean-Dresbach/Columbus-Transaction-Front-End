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

const login = async (email, password, stayLoggedIn) => {
    const response = await api.post("/users/login", {
        email,
        password,
        stayLoggedIn,
    })
    return response.data
}

const signup = async (name, email, password) => {
    console.log(name, email, password)

    const response = await api.post("/users/signup", { name, email, password })

    if (response.data.code != 201) {
        throw new Error(response.message)
    }

    return response.data
}

const fetchTransactions = async () => {
    try {
        const response = await api.get("/transactions")
        return response.data
    } catch (error) {
        console.error("Erro ao buscar as transações:", error)
        return []
    }
}

const createTransaction = async transaction => {
    try {
        const response = await api.post("/transactions", transaction)
        return response.data
    } catch (error) {
        console.error("Erro ao criar transação:", error)
        throw error
    }
}

const updateTransaction = async (transactionId, updatedTransaction) => {
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

const deleteTransaction = async transactionId => {
    try {
        await api.delete(`/transactions/${transactionId}`)
    } catch (error) {
        console.error("Erro ao excluir transação:", error)
        throw error
    }
}
