/**
 * TaskFlow — Vanilla JS To-Do Application
 * Persistence: localStorage (simulates db.json with "users" and "todos" arrays)
 * No frameworks, no bundlers, no server.
 */

// ─── DB Layer ─────────────────────────────────────────────────────────────────

const DB = {
  _read() {
    const raw = localStorage.getItem('taskflow_db');
    if (!raw) return { users: [], todos: [] };
    try { return JSON.parse(raw); }
    catch { return { users: [], todos: [] }; }
  },
  _write(data) {
    localStorage.setItem('taskflow_db', JSON.stringify(data));
  },
  getUsers() { return this._read().users; },
  getTodos()  { return this._read().todos; },
  addUser(user) {
    const db = this._read();
    db.users.push(user);
    this._write(db);
  },
  addTodo(todo) {
    const db = this._read();
    db.todos.push(todo);
    this._write(db);
  },
  updateTodo(id, patch) {
    const db = this._read();
    db.todos = db.todos.map(t => t.id === id ? { ...t, ...patch } : t);
    this._write(db);
  },
  deleteTodo(id) {
    const db = this._read();
    db.todos = db.todos.filter(t => t.id !== id);
    this._write(db);
  },
  deleteDoneTodosForUser(userId) {
    const db = this._read();
    db.todos = db.todos.filter(t => !(t.userId === userId && t.done));
    this._write(db);
  },
};

// ─── Session ──────────────────────────────────────────────────────────────────

const Session = {
  get()         { const u = localStorage.getItem('currentUser'); return u ? JSON.parse(u) : null; },
  set(user)     { localStorage.setItem('currentUser', JSON.stringify(user)); },
  clear()       { localStorage.removeItem('currentUser'); },
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>${msg}`;
  el.classList.remove('hidden');
}

function clearError(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.classList.add('hidden');
  el.innerHTML = '';
}

function markFieldError(inputId, hasError) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (hasError) el.classList.add('error-field');
  else el.classList.remove('error-field');
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ─── Screen Router ────────────────────────────────────────────────────────────

const SCREENS = ['screen-login', 'screen-register', 'screen-dashboard'];

function showScreen(id) {
  SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    if (s === id) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

// ─── Password Toggle ──────────────────────────────────────────────────────────

function setupPasswordToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.querySelector('svg').innerHTML = show
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
  });
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Login Logic ──────────────────────────────────────────────────────────────

function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    clearError('login-email-error');
    clearError('login-password-error');
    clearError('login-global-error');
    markFieldError('login-email', false);
    markFieldError('login-password', false);

    if (!email) {
      showError('login-email-error', 'Informe seu e-mail.');
      markFieldError('login-email', true);
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('login-email-error', 'E-mail inválido.');
      markFieldError('login-email', true);
      valid = false;
    }

    if (!password) {
      showError('login-password-error', 'Informe sua senha.');
      markFieldError('login-password', true);
      valid = false;
    }

    if (!valid) return;

    const users = DB.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      showError('login-global-error', 'E-mail não encontrado. Crie uma conta primeiro.');
      markFieldError('login-email', true);
      return;
    }

    if (user.password !== password) {
      showError('login-global-error', 'Senha incorreta. Tente novamente.');
      markFieldError('login-password', true);
      return;
    }

    Session.set({ id: user.id, name: user.name, email: user.email });
    loadDashboard();
    showScreen('screen-dashboard');
    showToast(`Olá, ${user.name.split(' ')[0]}! 👋`);
  });

  document.getElementById('go-to-register').addEventListener('click', () => {
    clearLoginForm();
    showScreen('screen-register');
  });
}

function clearLoginForm() {
  ['login-email', 'login-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
    markFieldError(id, false);
  });
  clearError('login-email-error');
  clearError('login-password-error');
  clearError('login-global-error');
}

// ─── Register Logic ───────────────────────────────────────────────────────────

function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    clearError('reg-name-error');
    clearError('reg-email-error');
    clearError('reg-password-error');
    clearError('reg-global-error');
    markFieldError('reg-name', false);
    markFieldError('reg-email', false);
    markFieldError('reg-password', false);

    if (!name || name.length < 2) {
      showError('reg-name-error', 'Informe seu nome completo.');
      markFieldError('reg-name', true);
      valid = false;
    }

    if (!email) {
      showError('reg-email-error', 'Informe seu e-mail.');
      markFieldError('reg-email', true);
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('reg-email-error', 'E-mail inválido.');
      markFieldError('reg-email', true);
      valid = false;
    }

    if (!password) {
      showError('reg-password-error', 'Informe uma senha.');
      markFieldError('reg-password', true);
      valid = false;
    } else if (password.length < 6) {
      showError('reg-password-error', 'A senha precisa ter pelo menos 6 caracteres.');
      markFieldError('reg-password', true);
      valid = false;
    }

    if (!valid) return;

    const users = DB.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      showError('reg-global-error', 'Este e-mail já está cadastrado.');
      markFieldError('reg-email', true);
      return;
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    DB.addUser(newUser);
    Session.set({ id: newUser.id, name: newUser.name, email: newUser.email });
    clearRegisterForm();
    loadDashboard();
    showScreen('screen-dashboard');
    showToast(`Conta criada! Bem-vindo(a), ${newUser.name.split(' ')[0]}! 🎉`);
  });

  document.getElementById('go-to-login').addEventListener('click', () => {
    clearRegisterForm();
    showScreen('screen-login');
  });
}

function clearRegisterForm() {
  ['reg-name', 'reg-email', 'reg-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
    markFieldError(id, false);
  });
  clearError('reg-name-error');
  clearError('reg-email-error');
  clearError('reg-password-error');
  clearError('reg-global-error');
}

// ─── Dashboard Logic ──────────────────────────────────────────────────────────

let currentFilter = 'all';

function loadDashboard() {
  const user = Session.get();
  if (!user) return;

  // Set greeting & avatar
  const firstName = user.name.split(' ')[0];
  document.getElementById('user-greeting').textContent = user.name;
  document.getElementById('user-avatar').textContent = firstName.charAt(0).toUpperCase();

  currentFilter = 'all';
  setActiveTab('all');
  renderTodos();
}

function getTodosForUser() {
  const user = Session.get();
  if (!user) return [];
  // userId armazenado como e-mail do usuário logado
  return DB.getTodos().filter(t => t.userId === user.email);
}

function renderTodos() {
  const user = Session.get();
  if (!user) return;

  const all = getTodosForUser();
  const filtered = all.filter(t => {
    if (currentFilter === 'pending') return !t.done;
    if (currentFilter === 'done')    return t.done;
    return true;
  });

  // Pendentes primeiro, concluídas no final; depois por data desc
  filtered.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  updateStats(all);

  const list = document.getElementById('todo-list');
  const empty = document.getElementById('todo-empty');

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = filtered.map(t => renderTodoItem(t)).join('');

  // Bind events
  list.querySelectorAll('.todo-checkbox').forEach(el => {
    el.addEventListener('click', () => toggleTodo(el.dataset.id));
  });
  list.querySelectorAll('.todo-complete-btn').forEach(el => {
    el.addEventListener('click', () => toggleTodo(el.dataset.id));
  });
  list.querySelectorAll('.todo-delete-btn').forEach(el => {
    el.addEventListener('click', () => deleteTodo(el.dataset.id));
  });
}

const TYPE_CONFIG = {
  trabalho: { label: 'Trabalho', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  pessoal:  { label: 'Pessoal',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  estudos:  { label: 'Estudos',  color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
};

function renderTodoItem(todo) {
  const cfg = TYPE_CONFIG[todo.type] || { label: todo.type || '', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  const date = new Date(todo.createdAt);
  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const desc = todo.description ? `<p class="text-slate-500 text-xs mt-1 leading-relaxed">${escapeHtml(todo.description)}</p>` : '';
  const completedOpacity = todo.done ? 'opacity-60' : '';

  return `
    <div class="todo-item ${todo.done ? 'completed' : ''} ${completedOpacity} rounded-xl px-4 py-3 flex items-start gap-3">
      <div class="todo-checkbox ${todo.done ? 'checked' : ''} mt-0.5" data-id="${todo.id}" role="checkbox" aria-checked="${todo.done}" tabindex="0">
        ${todo.done ? `<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="todo-text text-sm font-medium text-slate-200 leading-snug">${escapeHtml(todo.title || todo.text || '')}</p>
          <span class="badge text-xs" style="background:${cfg.bg}; color:${cfg.color};">${cfg.label}</span>
        </div>
        ${desc}
        <span class="text-slate-600 text-xs mt-1 block">${dateStr}</span>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0 mt-0.5">
        ${!todo.done ? `<button class="todo-complete-btn text-slate-500 hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" data-id="${todo.id}" title="Concluir"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></button>` : ''}
        <button class="todo-delete-btn text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" data-id="${todo.id}" aria-label="Excluir tarefa">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function updateStats(todos) {
  const done    = todos.filter(t => t.done).length;
  const pending = todos.filter(t => !t.done).length;
  document.getElementById('stat-total').textContent   = todos.length;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent    = done;
}

function toggleTodo(id) {
  const todos = DB.getTodos();
  const todo  = todos.find(t => t.id === id);
  if (!todo) return;
  DB.updateTodo(id, { done: !todo.done });
  renderTodos();
}

function deleteTodo(id) {
  DB.deleteTodo(id);
  renderTodos();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setActiveTab(filter) {
  ['all', 'pending', 'done'].forEach(f => {
    const btn = document.getElementById(`tab-${f}`);
    if (!btn) return;
    btn.classList.toggle('active', f === filter);
  });
}

function initDashboard() {
  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    Session.clear();
    clearLoginForm();
    showScreen('screen-login');
    showToast('Você saiu da conta.');
  });

  // Add todo
  const addBtn      = document.getElementById('add-todo-btn');
  const titleInput  = document.getElementById('new-todo-title');
  const typeSelect  = document.getElementById('new-todo-type');
  const descInput   = document.getElementById('new-todo-desc');

  function addTodo() {
    clearError('add-todo-error');
    const title       = titleInput ? titleInput.value.trim() : '';
    const type        = typeSelect ? typeSelect.value : 'pessoal';
    const description = descInput  ? descInput.value.trim() : '';
    const user        = Session.get();

    if (!title) {
      showError('add-todo-error', 'O título da tarefa é obrigatório.');
      markFieldError('new-todo-title', true);
      if (titleInput) titleInput.focus();
      return;
    }

    markFieldError('new-todo-title', false);

    const todo = {
      id:          `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId:      user.email,   // userId = e-mail do usuário logado
      title,
      type,
      description,
      done:        false,
      createdAt:   new Date().toISOString(),
    };

    DB.addTodo(todo);
    if (titleInput)  titleInput.value  = '';
    if (typeSelect)  typeSelect.value  = 'pessoal';
    if (descInput)   descInput.value   = '';
    renderTodos();
    showToast('Tarefa adicionada! ✅');
  }

  if (addBtn) addBtn.addEventListener('click', addTodo);
  if (titleInput) titleInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
  if (titleInput) titleInput.addEventListener('input', () => markFieldError('new-todo-title', false));

  // Filter tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      setActiveTab(currentFilter);
      renderTodos();
    });
  });

  // Clear done
  document.getElementById('clear-done-btn').addEventListener('click', () => {
    const user = Session.get();
    if (!user) return;
    const done = getTodosForUser().filter(t => t.done);
    if (done.length === 0) { showToast('Não há tarefas concluídas.'); return; }
    DB.deleteDoneTodosForUser(user.id);
    renderTodos();
    showToast(`${done.length} tarefa(s) removida(s).`);
  });
}

// ─── Keyboard accessibility for checkboxes ────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const el = e.target;
    if (el.classList.contains('todo-checkbox')) {
      e.preventDefault();
      toggleTodo(el.dataset.id);
    }
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

function boot() {
  setupPasswordToggle('login-toggle-pw', 'login-password');
  setupPasswordToggle('reg-toggle-pw', 'reg-password');

  initLogin();
  initRegister();
  initDashboard();

  const user = Session.get();
  if (user) {
    loadDashboard();
    showScreen('screen-dashboard');
  } else {
    showScreen('screen-login');
  }
}

document.addEventListener('DOMContentLoaded', boot);
