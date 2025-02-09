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

export const login = async (email, password, stayLoggedIn) => {
    const response = await api.post("/users/login", {
        email,
        password,
        stayLoggedIn,
    })
    return response.data
}

export const signup = async (name, email, password) => {
    console.log(name, email, password)

    const response = await api.post("/users/signup", { name, email, password })

    if (response.data.code != 201) {
        throw new Error(response.message)
    }

    return response.data
}

export const updateUser = async (name, email, password) => {
    const response = await api.put("/users", { name, email, password })

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}

export const updatePassword = async (oldPassword, newPassword) => {
    const response = await api.put("/users/update-password", {
        oldPassword,
        newPassword,
    })

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}

export const deleteUser = async () => {
    const response = await api.delete("/users")

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}

export const fetchTransactions = async () => {
    const response = await api.get("/transactions")

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}

export const createTransaction = async (value, type, method, category) => {
    const response = await api.post("/transactions", {
        value,
        type,
        method,
        category,
    })

    if (response.data.code != 201) {
        throw new Error(response.message)
    }

    return response.data
}

export const updateTransaction = async (transactionId, updates) => {
    const response = await api.put(`/transactions/${transactionId}`, updates)

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}

export const deleteTransaction = async transactionId => {
    const response = await api.delete(`/transactions/${transactionId}`)

    if (response.data.code != 200) {
        throw new Error(response.message)
    }

    return response.data
}
