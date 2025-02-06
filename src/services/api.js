import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
});

// Função para fazer login
export const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data;
};

// Função para fazer cadastro
export const signup = async (name, email, password) => {
    const response = await api.post("/signup", { name, email, password });
    return response.data;
};
