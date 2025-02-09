export const updatePageVisibility = () => {
    const pages = document.querySelectorAll(".page")
    const navLinks = document.querySelectorAll(".nav-link")
    const hash = window.location.hash || "#transactions"

    pages.forEach(page => {
        page.classList.toggle("hidden", `#${page.id}` !== hash)
    })

    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === hash)
    })
}

export const initNavigation = () => {
    window.addEventListener("hashchange", updatePageVisibility)
    updatePageVisibility()
}
