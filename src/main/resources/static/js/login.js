const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('messageArea');

function showMessage(text, isError = true) {
    messageDiv.textContent = text;
    messageDiv.classList.add('show');
    if (isError) {
        messageDiv.classList.add('error-msg');
        messageDiv.classList.remove('success-msg');
    } else {
        messageDiv.classList.add('success-msg');
        messageDiv.classList.remove('error-msg');
    }
}

function hideMessage() {
    messageDiv.classList.remove('show');
    messageDiv.classList.remove('error-msg', 'success-msg');
}

async function login() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showMessage('Please enter your email', true);
        emailInput.focus();
        return;
    }
    if (!password) {
        showMessage('Please enter your password', true);
        passwordInput.focus();
        return;
    }

    hideMessage();

    try {
        const response = await fetch("/User/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data && data.token) {
            localStorage.setItem("token", data.token);
            showMessage('Login successful! Redirecting...', false);
            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 800);
        } else {
            showMessage('Login failed: Invalid credentials', true);
        }
    } catch (err) {
        console.error("Login error:", err);
        showMessage('Server error. Make sure backend is running', true);
    }
}

emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});