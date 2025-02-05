document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Nome:', name, 'Email:', email, 'Senha:', password);

    // Enviar ao backend para criar o usuário
    // fetch('/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
});
