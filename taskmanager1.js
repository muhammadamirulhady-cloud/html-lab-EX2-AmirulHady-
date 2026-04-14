/*APP STATE*/

let tasks = [];
let taskIdCounter = 0;

/*DOM ELEMENTS*/

const taskModal = document.getElementById('modal-overlay');
const taskCounter = document.getElementById('task-counter');
const priorityFilter = document.querySelector('.controls select');

/*CORE FUNCTIONS*/

function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.setAttribute('data-priority', taskObj.priority);
    li.classList.add('task-card');

    const title = document.createElement('span');
    title.classList.add('task-title');
    title.textContent = taskObj.title;
    title.addEventListener('dblclick', () => handleInlineEdit(title, taskObj.id));

    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    const badge = document.createElement('span');
    badge.classList.add('priority-badge', `p-${taskObj.priority}`);
    badge.textContent = taskObj.priority;

    const date = document.createElement('small');
    date.style.display = 'block'; // Or move to CSS
    date.textContent = `Due: ${taskObj.dueDate || 'N/A'}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('data-action', 'delete');
    delBtn.setAttribute('data-id', taskObj.id);

    // Append all children
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(badge);
    li.appendChild(date);x
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    return li;
}

function addTask(columnId, taskObj) {
    tasks.push(taskObj); // Add to the data array
    const list = document.getElementById(`list-${columnId}`); // Find the correct column
    if (list) list.appendChild(createTaskCard(taskObj)); // Build the card and show it
    updateGlobalCounter(); 
}

function deleteTask(taskId) {
    const card = document.querySelector(`li[data-id="${taskId}"]`);
    if (!card) return;

    card.classList.add('fade-out'); // Trigger the disappearance animation
    
    setTimeout(() => {
        card.remove();
        tasks = tasks.filter(t => t.id !== taskId); // Remove from data array
        updateGlobalCounter();
    }, 300); 
}

function updateGlobalCounter() {
    taskCounter.textContent = tasks.length;
}

/*EVENT DELEGATION*/

document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const id = parseInt(e.target.getAttribute('data-id'));
        if (!action || !id) return;

        if (action === 'delete') deleteTask(id);
        if (action === 'edit') openEditModal(id);
    });
});

/*INLINE EDITING*/

function handleInlineEdit(element, id) {
    const originalText = element.textContent;
    const input = document.createElement('input');
    input.value = originalText;

    const commitChange = () => {
        const newTitle = input.value.trim() || originalText;
        element.textContent = newTitle;
        const task = tasks.find(t => t.id === id);
        if (task) task.title = newTitle;
        input.replaceWith(element);
    };

    input.addEventListener('blur', commitChange);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') commitChange(); });

    element.replaceWith(input);
    input.focus();
}

/*FILTERING*/

priorityFilter.addEventListener('change', (e) => {
    const val = e.target.value;
    document.querySelectorAll('.task-card').forEach(card => {
        const isMatch = val === 'all' || card.getAttribute('data-priority') === val;
        card.classList.toggle('is-hidden', !isMatch);
    });
});

/*CLEAR DONE*/

document.getElementById('btn-clear-done').addEventListener('click', () => {
    const doneCards = document.querySelectorAll('#list-done .task-card');
    doneCards.forEach((card, index) => {
        const id = parseInt(card.getAttribute('data-id'));
        setTimeout(() => {
            deleteTask(id);
        }, index * 100);
    });
});

/*MODAL LOGIC*/

const openModal = (col = 'todo') => {
    document.getElementById('column-id-input').value = col;
    document.getElementById('task-id-input').value = '';
    document.getElementById('input-title').value = '';
    document.getElementById('input-desc').value = '';
    taskModal.classList.remove('is-hidden');
};

const openEditModal = (id) => {
    const task = tasks.find(t => t.id === id);
    document.getElementById('task-id-input').value = id;
    document.getElementById('input-title').value = task.title;
    document.getElementById('input-desc').value = task.description;
    document.getElementById('input-priority').value = task.priority;
    document.getElementById('input-date').value = task.dueDate;
    taskModal.classList.remove('is-hidden');
};

document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-column')));
});

document.getElementById('btn-modal-cancel').addEventListener('click', () => {
    taskModal.classList.add('is-hidden');
});

document.getElementById('btn-modal-save').addEventListener('click', () => {
    const id = document.getElementById('task-id-input').value;
    const taskData = {
        title: document.getElementById('input-title').value,
        description: document.getElementById('input-desc').value,
        priority: document.getElementById('input-priority').value,
        dueDate: document.getElementById('input-date').value
    };

    if (id) {
        const taskId = parseInt(id);
        const taskIdx = tasks.findIndex(t => t.id === taskId);
        tasks[taskIdx] = { ...tasks[taskIdx], ...taskData };
        
        const oldCard = document.querySelector(`li[data-id="${id}"]`);
        const parentList = oldCard.parentElement;
        
        // Refresh DOM node
        const newCard = createTaskCard(tasks[taskIdx]);
        parentList.replaceChild(newCard, oldCard);
    } else {
        const newTask = { id: ++taskIdCounter, ...taskData };
        addTask(document.getElementById('column-id-input').value, newTask);
    }
    taskModal.classList.add('is-hidden');
});