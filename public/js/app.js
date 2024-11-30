// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } else {
        alert(result.error || 'Registration failed.');
    }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token);
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert(result.error || 'Login failed.');
    }
});

// Fetch and display tasks
async function fetchTasks() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must log in first.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('/api/tasks', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const tasks = await response.json();
        const taskList = document.getElementById('tasks');
        taskList.innerHTML = tasks.map(task => `
            <li>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <small>Priority: ${task.priority} | Due: ${new Date(task.deadline).toLocaleDateString()}</small>
            </li>
        `).join('');
    } else {
        alert('Failed to fetch tasks.');
    }
}

// Call fetchTasks when on index.html
if (document.getElementById('tasks')) {
    fetchTasks();
}
