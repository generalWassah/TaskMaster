
const baseUrl = "http://localhost:3000/api/tasks";

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 <= Date.now();
    } catch (e) {
        console.error("Invalid token format:", e);
        return true;
    }
};

const ensureTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return null;
    }
    return token;
};


// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Normalize inputs
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ normalizedUsername, normalizedEmail, password }),
    });

    const result = await response.json();
    if (response.ok) {
        // alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } else {
        alert(result.error || 'Registration failed.');
    }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;

    // const normalizedEmail = email.toLowerCase();

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('token', result.token);
        // alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert(result.error || 'Login failed.');
    }
});

// Handle logout
const logoutButton = document.getElementById('logoutBtn');
// Logout function
logoutButton.addEventListener('click', () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page (adjust the path based on your project structure)
    window.location.href = 'login.html';
});

// Show update form (logic to be implemented)
function showUpdateForm(taskId) {
    alert(`Logic to update task ID: ${taskId} goes here!`);
}

// Filter tasks
const applyFilters = document.getElementById('applyFilters');
applyFilters.addEventListener('click', async () => {
    const searchQuery = searchBar.value.toLowerCase();
    const priorityFilter = filterPriority.value;
    const dateFilter = filterDate.value;

    try {
        const response = await fetch(baseUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const tasks = await response.json();
        const filteredTasks = tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery);
            const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
            const matchesDate = dateFilter ? task.deadline === dateFilter : true;
            return matchesSearch && matchesPriority && matchesDate;
        });
        renderTasks(filteredTasks);
    } catch (error) {
        console.error('Error filtering tasks:', error);
    }
});

// Function to fetch and display tasks
async function fetchTasks() {

    const token = ensureTokenValidity();
    if (!token) return;

    try {
        const response = await fetch(baseUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const tasks = await response.json();
        const tasksContainer = document.getElementById("tasks");
        tasksContainer.innerHTML = ""; // Clear existing tasks

        tasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <p><b>Priority:</b> ${task.priority}</p>
                    <p><b>Deadline:</b> ${task.deadline}</p>
                </div>
                <button class="updateBtn" data-id="${task._id}">Update</button>
                <button class="deleteBtn" data-id="${task._id}">Delete</button>
            `;
            tasksContainer.appendChild(taskItem);
        });
        attachEventListeners();
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Add Task
const form = document.getElementById("createTaskForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;
    //const token = localStorage.getItem("token");

    // Validate input fields
    if (!title || !description || !deadline || !priority) {
        alert("Please fill in all required fields.");
        return;
    }

    const token = ensureTokenValidity();
    if (!token) return;

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ title, description, priority, deadline }),
        });

        if (response.ok) {
            fetchTasks(); // Refresh tasks
            form.reset();
        } else {
            alert("Error adding task tested");
            console.error("Error adding task:", await response.text());
        }
    } catch (error) {
        console.error("Error adding task:", error);
    }
});

// Update Task
async function updateTask(taskId, updatedData) {

    const token = ensureTokenValidity();
    if (!token) return;

    try {
        const response = await fetch(`${baseUrl}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedData),
        });
        if (response.ok) {
            fetchTasks();
        } else {
            console.error("Error updating task:", await response.text());
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Delete Task
async function deleteTask(taskId) {

    const token = ensureTokenValidity();
    if (!token) return;

    try {
        const response = await fetch(`${baseUrl}/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
            fetchTasks();
        } else {
            console.error("Error deleting task:", await response.text());
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Attach event listeners to buttons dynamically
function attachEventListeners() {
    document.querySelectorAll(".updateBtn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const taskId = e.target.dataset.id;
            const updatedData = {
                title: prompt("Enter new title"),
                description: prompt("Enter new description"),
                priority: prompt("Enter new priority (low/medium/high)"),
                deadline: prompt("Enter new deadline (YYYY-MM-DD)"),
            };
            updateTask(taskId, updatedData);
        });
    });

    document.querySelectorAll(".deleteBtn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const taskId = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this task?")) {
                deleteTask(taskId);
            }
        });
    });
}

// Call fetchTasks when on index.html
if (document.getElementById('tasks')) {
    fetchTasks();
}
