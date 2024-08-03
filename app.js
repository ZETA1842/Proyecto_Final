// Inicialización de IndexedDB
const dbName = 'userDB';
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('users', { keyPath: 'username' });
    objectStore.createIndex('password', 'password', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error('Error al abrir la base de datos:', event);
};

// Registro de usuarios
document.getElementById('register-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[#@])(?=.*[a-zA-Z0-9]).{4,}$/;
    
    if (!passwordRegex.test(password)) {
        document.getElementById('error-message').textContent = 'La contraseña debe tener al menos 4 caracteres, una mayúscula y un carácter especial (# o @)';
        return;
    }

    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.add({ username, password });

    request.onsuccess = function() {
        window.location.href = 'login.html';
    };

    request.onerror = function(event) {
        document.getElementById('error-message').textContent = 'Error al registrar el usuario';
    };
});

// Login de usuarios
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.get(username);

    request.onsuccess = function(event) {
        const user = event.target.result;
        if (user && user.password === password) {
            window.location.href = 'welcome.html';
        } else {
            document.getElementById('error-message').textContent = 'Usuario o contraseña incorrectos';
        }
    };

    request.onerror = function(event) {
        document.getElementById('error-message').textContent = 'Error al acceder al usuario';
    };
});
