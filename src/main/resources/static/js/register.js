const nameInput = document.getElementById('name');
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

async function register() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validation
    if (!name) {
        showMessage('Please enter your full name', true);
        nameInput.focus();
        return;
    }
    if (!email) {
        showMessage('Please enter your email address', true);
        emailInput.focus();
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        showMessage('Please enter a valid email address', true);
        emailInput.focus();
        return;
    }
    if (!password) {
        showMessage('Please enter a password', true);
        passwordInput.focus();
        return;
    }
    if (password.length < 4) {
        showMessage('Password must be at least 4 characters', true);
        passwordInput.focus();
        return;
    }

    hideMessage();

    const user = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch("/User/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        console.log("REGISTER RESPONSE:", data);

        // Check if registration was successful
        if (response.ok || (data && (data.message === "User registered successfully" || data.id))) {
            showMessage('Registration successful! Redirecting to login...', false);
            setTimeout(() => {
                window.location.href = "/login.html";
            }, 1200);
        } else {
            const errorMsg = data.message || data.error || 'Registration failed';
            showMessage(errorMsg, true);
        }
    } catch (err) {
        console.error("Register error:", err);
        showMessage('Server error. Make sure backend is running at localhost:8080', true);
    }
}

// Press Enter to register
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});