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

    // Append all children manually
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(badge);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    return li;
}

