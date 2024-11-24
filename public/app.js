document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

    const task = { title, description, deadline, priority };

    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        if (response.ok) {
            console.log("Task added successfully");
            // Add code to update UI with new task
        } else {
            console.error("Failed to add task");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
