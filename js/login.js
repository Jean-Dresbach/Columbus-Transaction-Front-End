document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email, 'Senha:', password);

    // Enviar ao backend para validação (exemplo usando fetch)
    // fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
});
