// Auto-detect API URL (works locally and on Railway)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : `${window.location.protocol}//${window.location.hostname}`;

const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskStats = document.getElementById('taskStats');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const editForm = document.getElementById('editForm');
const editTaskId = document.getElementById('editTaskId');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editCompleted = document.getElementById('editCompleted');

let currentFilter = 'all';
let tasks = [];

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Could not load tasks</h3>
                <p>Make sure the backend is running at ${API_URL}</p>
            </div>
        `;
    }
}

async function addTask(title, description) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to add task');
        }
        const newTask = await response.json();
        tasks.unshift(newTask);
        renderTasks();
        updateStats();
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}

async function updateTask(id, data) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update task');
        }
        const updatedTask = await response.json();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) tasks[index] = updatedTask;
        renderTasks();
        updateStats();
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return false;
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete task');
        }
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
        return true;
    } catch (error) {
        alert(error.message);
        return false;
    }
}

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks yet</h3>
                <p>Add your first task above!</p>
            </div>
        `;
        return;
    }

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>All caught up!</h3>
                <p>No ${currentFilter} tasks</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <h3>${escapeHtml(task.title)}</h3>
                ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    ${new Date(task.created_at).toLocaleDateString()}
                    ${task.updated_at ? ' · Updated' : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-complete ${task.completed ? 'completed' : ''}" 
                        onclick="toggleComplete(${task.id})">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-edit" onclick="openEditModal(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    taskStats.innerHTML = `
        <span>${total} task${total !== 1 ? 's' : ''}</span>
        <span>${completed} completed</span>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const success = await addTask(title, description);
    if (success) {
        taskTitle.value = '';
        taskDescription.value = '';
        taskTitle.focus();
    }
});

async function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    editTaskId.value = task.id;
    editTitle.value = task.title;
    editDescription.value = task.description || '';
    editCompleted.checked = task.completed;
    editModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = parseInt(editTaskId.value);
    const title = editTitle.value.trim();
    const description = editDescription.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const success = await updateTask(id, {
        title,
        description: description || null,
        completed: editCompleted.checked
    });

    if (success) {
        editModal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal.style.display === 'block') {
        editModal.style.display = 'none';
    }
});

// Load tasks on page load
fetchTasks();

// Refresh every 60 seconds
setInterval(fetchTasks, 60000);