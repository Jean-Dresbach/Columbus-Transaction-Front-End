export function checkAuthentication() {
    const token = localStorage.getItem("token")
    const publicPages = ["/", "/signup.html"] // Páginas públicas
    const currentPage = window.location.pathname

    if (token && publicPages.includes(currentPage)) {
        window.location.href = "/home.html"
    } else if (!token && !publicPages.includes(currentPage)) {
        alert("Você precisa estar logado para acessar essa página!")
        window.location.href = "/"
    }
}
