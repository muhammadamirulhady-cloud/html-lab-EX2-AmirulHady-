/* APP STATE */

let tasks = [];
let taskIdCounter = 0;

/* DOM ELEMENTS */

const taskModal = document.getElementById('modal-overlay');
const taskCounter = document.getElementById('task-counter');
const priorityFilter = document.querySelector('.controls select');

/* CORE FUNCTIONS */

function updateGlobalCounter() {
    taskCounter.textContent = tasks.length; // Change the number on screen
}

function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.setAttribute('data-priority', taskObj.priority);
    li.classList.add('task-card');

    // Title
    const title = document.createElement('span');
    title.classList.add('task-title');
    title.textContent = taskObj.title;

    // Description
    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    // Priority Badge
    const badge = document.createElement('span');
    badge.classList.add('priority-badge', `p-${taskObj.priority}`);
    badge.textContent = taskObj.priority;

    // Due Date
    const date = document.createElement('small');
    date.style.display = 'block'; 
    date.textContent = `Due: ${taskObj.dueDate || 'N/A'}`;

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    // Delete Button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('data-action', 'delete');
    delBtn.setAttribute('data-id', taskObj.id);

    // Append all children
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(badge);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    return li;
}

function addTask(columnId, taskObj) {
    tasks.push(taskObj);
    const list = document.getElementById(`list-${columnId}`); // Find the correct column
    if (list) list.appendChild(createTaskCard(taskObj)); // Build the card and show it
    updateGlobalCounter();
}


function deleteTask(taskId) {
    const card = document.querySelector(`li[data-id="${taskId}"]`); // Find card in HTML
    if (!card) return;

    card.classList.add('fade-out'); // Trigger the disappearance animation
    
    setTimeout(() => { // Wait 0.3 seconds for animation to finish
        card.remove();
        tasks = tasks.filter(t => t.id !== taskId); // Remove from data array
        updateGlobalCounter();
    }, 300); 
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('modal-title-text').textContent = "Edit Task";
    document.getElementById('task-id-input').value = task.id;
    document.getElementById('input-title').value = task.title;
    document.getElementById('input-desc').value = task.description;
    document.getElementById('input-priority').value = task.priority;
    document.getElementById('input-date').value = task.dueDate;
    
    taskModal.classList.remove('is-hidden');
}

/* Updates the task array and replaces the DOM card with updated content. */
function updateTask(taskId, updatedData) {
    const taskIdx = tasks.findIndex(t => t.id === taskId);
    if (taskIdx === -1) return;

    // Update state
    tasks[taskIdx] = { ...tasks[taskIdx], ...updatedData };

    // Update DOM via replacement
    const oldCard = document.querySelector(`li[data-id="${taskId}"]`);
    if (oldCard) {
        const newCard = createTaskCard(tasks[taskIdx]);
        oldCard.replaceWith(newCard);
    }
}

// Event Delegation: One listener on <ul> to handle all card button clicks
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const id = parseInt(e.target.getAttribute('data-id'));
        if (!action || !id) return;

        if (action === 'delete') deleteTask(id);
        if (action === 'edit') editTask(id);
    });
});

// Inline Editing: Swaps span for input
function handleInlineEdit(element, id) {
    const originalText = element.textContent;
    const input = document.createElement('input');
    input.value = originalText;

    const commit = () => {
        const newTitle = input.value.trim() || originalText;
        element.textContent = newTitle;
        const task = tasks.find(t => t.id === id);
        if (task) task.title = newTitle;
        input.replaceWith(element);
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); });

    element.replaceWith(input);
    input.focus();
}

// Priority Filter: Uses classList.toggle as requested
priorityFilter.addEventListener('change', (e) => {
    const val = e.target.value;
    document.querySelectorAll('.task-card').forEach(card => {
        const matches = val === 'all' || card.getAttribute('data-priority') === val;
        card.classList.toggle('is-hidden', !matches);
    });
});

// Clear Done: Staggered removal using 100ms intervals
document.getElementById('btn-clear-done').addEventListener('click', () => {
    const doneCards = document.querySelectorAll('#list-done .task-card');
    doneCards.forEach((card, index) => {
        const id = parseInt(card.getAttribute('data-id'));
        setTimeout(() => deleteTask(id), index * 100);
    });
});