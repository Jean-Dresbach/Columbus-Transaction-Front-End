import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
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
