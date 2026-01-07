// Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const dateElement = document.getElementById('date');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Set Date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateElement.innerText = new Date().toLocaleDateString(undefined, options);
    
    // Load tasks & Icons
    loadTasks();
    lucide.createIcons();
    checkEmptyState();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addTask();
});

// --- Core Functions ---

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    // Create task object
    const taskObj = {
        id: Date.now(), // Unique ID for reliable deletion/updating
        text: taskText,
        completed: false
    };

    // Add to UI and Storage
    renderTask(taskObj);
    saveTaskToStorage(taskObj);
    
    taskInput.value = '';
    checkEmptyState();
}

function renderTask(taskObj) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.setAttribute('data-id', taskObj.id);
    if (taskObj.completed) li.classList.add('completed');

    li.innerHTML = `
        <div class="task-left">
            <div class="custom-checkbox">
                <i data-lucide="check" size="14"></i>
            </div>
            <span class="task-text">${taskObj.text}</span>
        </div>
        <div class="delete-btn">
            <i data-lucide="trash-2" size="18"></i>
        </div>
    `;

    // Event: Toggle Complete
    const taskLeft = li.querySelector('.task-left');
    taskLeft.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskStatus(taskObj.id);
    });

    // Event: Delete Task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent toggling complete
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        setTimeout(() => {
            li.remove();
            deleteTaskFromStorage(taskObj.id);
            checkEmptyState();
        }, 300);
    });

    taskList.prepend(li); // Add new tasks to the top
    lucide.createIcons(); // Refresh icons for new element
}

function checkEmptyState() {
    const tasks = getTasksFromStorage();
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'block';
    }
}

// --- Local Storage Helpers ---

function getTasksFromStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

function saveTaskToStorage(taskObj) {
    let tasks = getTasksFromStorage();
    tasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasksFromStorage();
    tasks.forEach(task => renderTask(task));
}

function updateTaskStatus(id) {
    let tasks = getTasksFromStorage();
    tasks.forEach(task => {
        if(task.id === id) {
            task.completed = !task.completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromStorage(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}