// Verifica se o usuário está autenticado
const token = localStorage.getItem("token");
const publicPages = ["/", "/signup.html"]; // Páginas que não exigem login
const currentPage = window.location.pathname;

if (token && publicPages.includes(currentPage)) {
    // Se o usuário tem token e está em uma página pública, redireciona para a home
    window.location.href = "/home.html";
} else if (!token && !publicPages.includes(currentPage)) {
    // Se o usuário não tem token e está tentando acessar uma página protegida
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = "/";
}
