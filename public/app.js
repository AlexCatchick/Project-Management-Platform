const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/v1'
    : `${window.location.origin}/api/v1`;

let currentUser = null;
let accessToken = null;
let currentProject = null;

const app = document.getElementById('app');

function setAuth(token, user) {
    accessToken = token;
    currentUser = user;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearAuth() {
    accessToken = null;
    currentUser = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
}

function checkAuth() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
        accessToken = token;
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server error. Please try again later.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Cannot connect to server. Please check if the server is running.');
        }
        throw error;
    }
}

function showLogin() {
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h1>Welcome Back</h1>
                <p>Sign in to continue to Project Camp</p>
                <div id="error"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label>Email or Username</label>
                        <input type="text" id="emailOrUsername" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn">Sign In</button>
                </form>
                <div class="auth-link">
                    Don't have an account? <a href="#" id="showRegister">Sign Up</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailOrUsername = document.getElementById('emailOrUsername').value;
        const password = document.getElementById('password').value;

        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: emailOrUsername.includes('@') ? emailOrUsername : undefined,
                    username: !emailOrUsername.includes('@') ? emailOrUsername : undefined,
                    password
                })
            });

            setAuth(data.data.accessToken, data.data.user);
            showDashboard();
        } catch (error) {
            document.getElementById('error').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });

    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });
}

function showRegister() {
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h1>Create Account</h1>
                <p>Sign up to get started with Project Camp</p>
                <div id="error"></div>
                <form id="registerForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="fullName">
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn">Sign Up</button>
                </form>
                <div class="auth-link">
                    Already have an account? <a href="#" id="showLogin">Sign In</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ fullName, username, email, password })
            });

            document.getElementById('error').innerHTML = `<div class="success-message">Registration successful! Please login.</div>`;
            setTimeout(() => showLogin(), 2000);
        } catch (error) {
            document.getElementById('error').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
}

async function showDashboard() {
    app.innerHTML = `
        <div class="header">
            <div class="header-content">
                <h1>Project Camp</h1>
                <div class="header-actions">
                    <button id="createProjectBtn">+ New Project</button>
                    <button id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>
        <div class="container">
            <h2 style="margin-bottom: 20px;">My Projects</h2>
            <div id="projectsList" class="loading">Loading projects...</div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        clearAuth();
        showLogin();
    });

    document.getElementById('createProjectBtn').addEventListener('click', () => {
        showCreateProjectModal();
    });

    loadProjects();
}

async function loadProjects() {
    try {
        const data = await apiCall('/projects');
        const projectsList = document.getElementById('projectsList');

        if (data.data.length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <p>No projects yet. Create your first project!</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = `
            <div class="projects-grid">
                ${data.data.map(project => `
                    <div class="project-card" data-id="${project._id}">
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description'}</p>
                        <div class="project-meta">
                            <span>${project.memberCount} members</span>
                            <span>${project.role}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.id;
                const project = data.data.find(p => p._id === projectId);
                currentProject = project;
                showProjectDetail(projectId);
            });
        });
    } catch (error) {
        document.getElementById('projectsList').innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

function showCreateProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Project</h2>
            <div id="modalError"></div>
            <form id="createProjectForm">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" id="projectName" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="projectDescription"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn">Create</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('createProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;

        try {
            await apiCall('/projects', {
                method: 'POST',
                body: JSON.stringify({ name, description })
            });
            modal.remove();
            loadProjects();
        } catch (error) {
            document.getElementById('modalError').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });
}

async function showProjectDetail(projectId) {
    app.innerHTML = `
        <div class="header">
            <div class="header-content">
                <h1>Project Camp</h1>
                <div class="header-actions">
                    <button id="backBtn">← Back</button>
                    <button id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>
        <div class="container">
            <h2 id="projectTitle"></h2>
            <div class="tabs">
                <button class="tab active" data-tab="tasks">Tasks</button>
                <button class="tab" data-tab="notes">Notes</button>
                <button class="tab" data-tab="members">Members</button>
            </div>
            <div id="tabContent"></div>
        </div>
    `;

    document.getElementById('backBtn').addEventListener('click', () => {
        showDashboard();
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        clearAuth();
        showLogin();
    });

    try {
        const projectData = await apiCall(`/projects/${projectId}`);
        document.getElementById('projectTitle').textContent = projectData.data.name;
    } catch (error) {
        console.error('Error loading project:', error);
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            if (tabName === 'tasks') showTasks(projectId);
            else if (tabName === 'notes') showNotes(projectId);
            else if (tabName === 'members') showMembers(projectId);
        });
    });

    showTasks(projectId);
}

async function showTasks(projectId) {
    const tabContent = document.getElementById('tabContent');
    const isAdmin = currentProject.role === 'admin' || currentProject.role === 'project_admin';

    tabContent.innerHTML = `
        ${isAdmin ? '<button class="btn" id="createTaskBtn" style="margin-bottom: 20px;">+ New Task</button>' : ''}
        <div id="tasksList" class="loading">Loading tasks...</div>
    `;

    if (isAdmin) {
        document.getElementById('createTaskBtn').addEventListener('click', () => {
            showCreateTaskModal(projectId);
        });
    }

    try {
        const data = await apiCall(`/tasks/${projectId}`);
        const tasksList = document.getElementById('tasksList');

        if (data.data.length === 0) {
            tasksList.innerHTML = '<div class="empty-state"><p>No tasks yet</p></div>';
            return;
        }

        tasksList.innerHTML = `
            <div class="tasks-list">
                ${data.data.map(task => `
                    <div class="task-item" data-id="${task._id}">
                        <div class="task-header">
                            <div class="task-title">${task.title}</div>
                            <span class="task-status ${task.status}">${task.status.replace('_', ' ')}</span>
                        </div>
                        <div class="task-description">${task.description || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('click', () => {
                showTaskDetail(projectId, item.dataset.id);
            });
        });
    } catch (error) {
        document.getElementById('tasksList').innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

function showCreateTaskModal(projectId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Task</h2>
            <div id="modalError"></div>
            <form id="createTaskForm">
                <div class="form-group">
                    <label>Task Title</label>
                    <input type="text" id="taskTitle" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="taskDescription"></textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="taskStatus">
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn">Create</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const status = document.getElementById('taskStatus').value;

        try {
            await apiCall(`/tasks/${projectId}`, {
                method: 'POST',
                body: JSON.stringify({ title, description, status })
            });
            modal.remove();
            showTasks(projectId);
        } catch (error) {
            document.getElementById('modalError').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });
}

async function showTaskDetail(projectId, taskId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Task Details</h2>
            <div id="taskDetailContent" class="loading">Loading...</div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    try {
        const data = await apiCall(`/tasks/${projectId}/t/${taskId}`);
        const task = data.data.task;
        const subtasks = data.data.subtasks;
        const isAdmin = currentProject.role === 'admin' || currentProject.role === 'project_admin';

        document.getElementById('taskDetailContent').innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                <span class="task-status ${task.status}">${task.status.replace('_', ' ')}</span>
            </div>
            <div>
                <h4 style="margin-bottom: 10px;">Subtasks</h4>
                ${isAdmin ? '<button class="btn btn-secondary" id="addSubtaskBtn" style="margin-bottom: 10px;">+ Add Subtask</button>' : ''}
                <div class="subtask-list">
                    ${subtasks.length === 0 ? '<p>No subtasks yet</p>' : subtasks.map(st => `
                        <div class="subtask-item ${st.isCompleted ? 'completed' : ''}">
                            <input type="checkbox" ${st.isCompleted ? 'checked' : ''} data-id="${st._id}">
                            <label>${st.title}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="closeBtn">Close</button>
            </div>
        `;

        document.getElementById('closeBtn').addEventListener('click', () => {
            modal.remove();
        });

        if (isAdmin) {
            document.getElementById('addSubtaskBtn').addEventListener('click', () => {
                modal.remove();
                showCreateSubtaskModal(projectId, taskId);
            });
        }

        document.querySelectorAll('.subtask-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const subtaskId = e.target.dataset.id;
                try {
                    await apiCall(`/tasks/${projectId}/st/${subtaskId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ isCompleted: e.target.checked })
                    });
                    modal.remove();
                    showTaskDetail(projectId, taskId);
                } catch (error) {
                    console.error('Error updating subtask:', error);
                }
            });
        });
    } catch (error) {
        document.getElementById('taskDetailContent').innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

function showCreateSubtaskModal(projectId, taskId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Subtask</h2>
            <div id="modalError"></div>
            <form id="createSubtaskForm">
                <div class="form-group">
                    <label>Subtask Title</label>
                    <input type="text" id="subtaskTitle" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn">Add</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('createSubtaskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('subtaskTitle').value;

        try {
            await apiCall(`/tasks/${projectId}/t/${taskId}/subtasks`, {
                method: 'POST',
                body: JSON.stringify({ title })
            });
            modal.remove();
            showTaskDetail(projectId, taskId);
        } catch (error) {
            document.getElementById('modalError').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });
}

async function showNotes(projectId) {
    const tabContent = document.getElementById('tabContent');
    const isAdmin = currentProject.role === 'admin';

    tabContent.innerHTML = `
        ${isAdmin ? '<button class="btn" id="createNoteBtn" style="margin-bottom: 20px;">+ New Note</button>' : ''}
        <div id="notesList" class="loading">Loading notes...</div>
    `;

    if (isAdmin) {
        document.getElementById('createNoteBtn').addEventListener('click', () => {
            showCreateNoteModal(projectId);
        });
    }

    try {
        const data = await apiCall(`/notes/${projectId}`);
        const notesList = document.getElementById('notesList');

        if (data.data.length === 0) {
            notesList.innerHTML = '<div class="empty-state"><p>No notes yet</p></div>';
            return;
        }

        notesList.innerHTML = `
            <div class="notes-list">
                ${data.data.map(note => `
                    <div class="note-item">
                        <div class="note-title">${note.title}</div>
                        <div class="note-content">${note.content || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        document.getElementById('notesList').innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

function showCreateNoteModal(projectId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Note</h2>
            <div id="modalError"></div>
            <form id="createNoteForm">
                <div class="form-group">
                    <label>Note Title</label>
                    <input type="text" id="noteTitle" required>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea id="noteContent"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn">Create</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;

        try {
            await apiCall(`/notes/${projectId}`, {
                method: 'POST',
                body: JSON.stringify({ title, content })
            });
            modal.remove();
            showNotes(projectId);
        } catch (error) {
            document.getElementById('modalError').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });
}

async function showMembers(projectId) {
    const tabContent = document.getElementById('tabContent');
    const isAdmin = currentProject.role === 'admin';

    tabContent.innerHTML = `
        ${isAdmin ? '<button class="btn" id="addMemberBtn" style="margin-bottom: 20px;">+ Add Member</button>' : ''}
        <div id="membersList" class="loading">Loading members...</div>
    `;

    if (isAdmin) {
        document.getElementById('addMemberBtn').addEventListener('click', () => {
            showAddMemberModal(projectId);
        });
    }

    try {
        const data = await apiCall(`/projects/${projectId}/members`);
        const membersList = document.getElementById('membersList');

        membersList.innerHTML = `
            <div class="tasks-list">
                ${data.data.map(member => `
                    <div class="task-item">
                        <div class="task-header">
                            <div class="task-title">${member.userId.username}</div>
                            <span class="task-status">${member.role}</span>
                        </div>
                        <div class="task-description">${member.userId.email}</div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        document.getElementById('membersList').innerHTML = `<div class="error-message">${error.message}</div>`;
    }
}

function showAddMemberModal(projectId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Project Member</h2>
            <div id="modalError"></div>
            <form id="addMemberForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="memberEmail" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="memberRole">
                        <option value="member">Member</option>
                        <option value="project_admin">Project Admin</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn">Add</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('memberEmail').value;
        const role = document.getElementById('memberRole').value;

        try {
            await apiCall(`/projects/${projectId}/members`, {
                method: 'POST',
                body: JSON.stringify({ email, role })
            });
            modal.remove();
            showMembers(projectId);
        } catch (error) {
            document.getElementById('modalError').innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });
}

if (checkAuth()) {
    showDashboard();
} else {
    showLogin();
}
