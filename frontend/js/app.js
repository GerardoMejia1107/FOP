// Aplicación principal
class ForensicApp {
    constructor() {
        this.auth = auth;
        this.currentView = 'login';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadView();
    }

    checkAuth() {
        const user = this.auth.getCurrentUser();
        if (user) {
            this.currentView = 'dashboard';
        } else {
            this.currentView = 'login';
        }
        this.updateNavigation();
    }

    setupEventListeners() {
        this.setupNavigationListeners();
    }

    setupNavigationListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('#nav-dashboard')) {
                e.preventDefault();
                this.showDashboard();
            } else if (e.target.matches('#nav-casos')) {
                e.preventDefault();
                this.showCasos();
            } else if (e.target.matches('#nav-reportes')) {
                e.preventDefault();
                this.showReportes();
            } else if (e.target.matches('#nav-usuarios')) {
                e.preventDefault();
                this.showUsuarios();
            } else if (e.target.matches('#nav-login')) {
                e.preventDefault();
                this.handleAuthButton();
            }
        });
    }

    handleAuthButton() {
        if (this.auth.getCurrentUser()) {
            this.logout();
        } else {
            this.showLogin();
        }
    }

    loadView() {
        const content = document.getElementById('content');
        
        switch(this.currentView) {
            case 'login':
                content.innerHTML = this.renderLogin();
                this.setupLoginListener();
                break;
            case 'dashboard':
                content.innerHTML = this.renderDashboard();
                break;
            case 'casos':
                content.innerHTML = this.renderCasos();
                this.setupCasosListeners();
                break;
            case 'reportes':
                content.innerHTML = this.renderReportes();
                this.setupReportesListeners();
                break;
            case 'usuarios':
                content.innerHTML = this.renderUsuarios();
                break;
        }
        
        this.updateNavigation();
    }

    setupLoginListener() {
        setTimeout(() => {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }
        }, 100);
    }

    setupCasosListeners() {
        setTimeout(() => {
            // Listener para nuevo caso
            const nuevoCasoBtn = document.getElementById('btn-nuevo-caso');
            if (nuevoCasoBtn) {
                nuevoCasoBtn.addEventListener('click', () => this.mostrarFormularioCaso());
            }

            // Delegación de eventos para botones de la tabla
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-ver-caso')) {
                    const casoId = e.target.getAttribute('data-caso-id');
                    this.verCaso(casoId);
                }
                if (e.target.classList.contains('btn-editar-caso')) {
                    const casoId = e.target.getAttribute('data-caso-id');
                    this.editarCaso(casoId);
                }
                if (e.target.classList.contains('btn-eliminar-caso')) {
                    const casoId = e.target.getAttribute('data-caso-id');
                    this.eliminarCaso(casoId);
                }
                if (e.target.classList.contains('btn-nuevo-caso')) {
                    this.mostrarFormularioCaso();
                }
            });

            // Listener para formulario de caso (si existe)
            const casoForm = document.getElementById('caso-form');
            if (casoForm) {
                casoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.crearCaso();
                });
            }

            // Listener para cancelar formulario (si existe)
            const cancelarBtn = document.getElementById('btn-cancelar-caso');
            if (cancelarBtn) {
                cancelarBtn.addEventListener('click', () => this.showCasos());
            }
        }, 100);
    }

    setupReportesListeners() {
        setTimeout(() => {
            const generarReporteBtn = document.getElementById('btn-generar-reporte');
            if (generarReporteBtn) {
                generarReporteBtn.addEventListener('click', () => this.generarReporte());
            }
        }, 100);
    }

    renderLogin() {
        return `
            <div class="login-container">
                <h2>Iniciar Sesión</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">Usuario:</label>
                        <input type="text" id="username" name="username" required value="admin">
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña:</label>
                        <input type="password" id="password" name="password" required value="admin123">
                    </div>
                    <button type="submit" class="btn">Ingresar</button>
                </form>
                <div class="usuarios-prueba">
                    <h4>Usuarios de prueba:</h4>
                    <p><strong>Superusuario:</strong> admin / admin123</p>
                    <p><strong>Recolector:</strong> recolector / recolector123</p>
                    <p><strong>Investigador:</strong> investigador / investigador123</p>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        const user = this.auth.getCurrentUser();
        if (!user) {
            this.showLogin();
            return '';
        }

        const casos = this.auth.getCasos();
        const myCasos = casos.filter(caso => 
            caso.recolector === user.name || 
            caso.investigador === user.name
        ).length;

        return `
            <div class="user-info">
                <h2>Bienvenido, ${user.name}</h2>
                <p>Rol: ${user.role}</p>
            </div>
            <h2>Dashboard</h2>
            <div class="dashboard">
                <div class="card">
                    <h3>Total de Casos</h3>
                    <div class="number">${casos.length}</div>
                </div>
                <div class="card">
                    <h3>Mis Casos</h3>
                    <div class="number">${myCasos}</div>
                </div>
                <div class="card">
                    <h3>Casos Pendientes</h3>
                    <div class="number">${casos.filter(c => c.estado === 'pendiente').length}</div>
                </div>
                <div class="card">
                    <h3>Casos Cerrados</h3>
                    <div class="number">${casos.filter(c => c.estado === 'cerrado').length}</div>
                </div>
            </div>
        `;
    }

    renderCasos() {
        const user = this.auth.getCurrentUser();
        if (!user) {
            this.showLogin();
            return '';
        }

        // Verificar si debemos mostrar el formulario
        if (window.location.hash === '#nuevo-caso' && this.auth.hasPermission('create')) {
            return this.renderFormularioCaso();
        }

        let casos = this.auth.getCasos();

        // Filtrar casos según permisos
        if (user.role === 'recolector') {
            casos = casos.filter(caso => caso.recolector === user.name);
        } else if (user.role === 'investigador') {
            casos = casos.filter(caso => caso.investigador === user.name);
        }

        let actions = '';
        if (this.auth.hasPermission('create')) {
            actions = '<button class="btn btn-nuevo-caso">Nuevo Caso</button>';
        }

        const casosHTML = casos.length > 0 ? casos.map(caso => {
            return `
                <tr>
                    <td>${caso.numero}</td>
                    <td>${caso.tipo}</td>
                    <td>${caso.fecha}</td>
                    <td>${caso.recolector}</td>
                    <td>${caso.investigador}</td>
                    <td><span class="estado-badge estado-${(caso.estado || 'pendiente').replace(' ', '-')}">${caso.estado || 'pendiente'}</span></td>
                    <td>
                        <button class="btn btn-ver-caso" data-caso-id="${caso.id}">Ver</button>
                        ${this.auth.canUpdateCaso(caso) ? `<button class="btn btn-editar-caso" data-caso-id="${caso.id}">Editar</button>` : ''}
                        ${this.auth.canDeleteCaso(caso) ? `<button class="btn btn-danger btn-eliminar-caso" data-caso-id="${caso.id}">Eliminar</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="7" style="text-align: center;">No hay casos registrados</td></tr>';

        return `
            <div class="casos-header">
                <h2>Gestión de Casos</h2>
                ${actions}
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>N° Caso</th>
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Recolector</th>
                            <th>Investigador</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${casosHTML}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderFormularioCaso() {
        const user = this.auth.getCurrentUser();
        const fechaHoy = new Date().toISOString().split('T')[0];
        
        return `
            <div class="form-container">
                <h2>Nuevo Caso Forense</h2>
                <form id="caso-form">
                    <div class="form-section">
                        <h3>Datos Generales del Caso</h3>
                        <div class="form-group">
                            <label for="numero-caso">N° Caso:</label>
                            <input type="text" id="numero-caso" name="numero-caso" required placeholder="Ej: ML-2023-01586">
                        </div>
                        <div class="form-group">
                            <label for="tipo-caso">Tipo:</label>
                            <select id="tipo-caso" name="tipo-caso" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="Muerte violenta – Sospecha de homicidio">Muerte violenta – Sospecha de homicidio</option>
                                <option value="Muerte sospechosa">Muerte sospechosa</option>
                                <option value="Accidente">Accidente</option>
                                <option value="Suicidio">Suicidio</option>
                                <option value="Natural">Natural</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="fecha-caso">Fecha del Hecho:</label>
                            <input type="date" id="fecha-caso" name="fecha-caso" required value="${fechaHoy}">
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Asignaciones</h3>
                        <div class="form-group">
                            <label for="recolector">Recolector:</label>
                            <input type="text" id="recolector" name="recolector" value="${user.name}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="investigador">Investigador/Forense:</label>
                            <select id="investigador" name="investigador" required>
                                <option value="">Seleccionar investigador</option>
                                <option value="Dr. Alejandro Rojas">Dr. Alejandro Rojas</option>
                                <option value="Dr. Carlos Mendoza">Dr. Carlos Mendoza</option>
                                <option value="Dra. Laura Fernández">Dra. Laura Fernández</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-success">Crear Caso</button>
                        <button type="button" class="btn btn-secondary" id="btn-cancelar-caso">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
    }

    renderReportes() {
        const user = this.auth.getCurrentUser();
        if (!user) {
            this.showLogin();
            return '';
        }

        return `
            <div class="user-info">
                <h2>Reportes y Autopsias</h2>
                ${this.auth.hasPermission('create') ? '<button class="btn" id="btn-generar-reporte">Generar Reporte</button>' : ''}
            </div>
            <div class="reportes-container">
                <div class="card">
                    <h3>Reporte Forense Simplificado</h3>
                    <p>Formulario para crear reportes forenses completos.</p>
                    <button class="btn btn-ver-caso">Acceder</button>
                </div>
                <div class="card">
                    <h3>Reporte de Autopsia</h3>
                    <p>Formulario para registrar resultados de autopsias.</p>
                    <button class="btn btn-ver-caso">Acceder</button>
                </div>
                <div class="card">
                    <h3>Reportes Estadísticos</h3>
                    <p>Generar reportes estadísticos de casos.</p>
                    <button class="btn btn-ver-caso">Generar</button>
                </div>
            </div>
        `;
    }

    renderUsuarios() {
        const user = this.auth.getCurrentUser();
        if (!user) {
            this.showLogin();
            return '';
        }

        if (!this.auth.hasPermission('delete')) {
            return '<div class="card"><p>No tiene permisos para acceder a esta sección.</p></div>';
        }

        return `
            <div class="user-info">
                <h2>Gestión de Usuarios</h2>
                <button class="btn" onclick="app.mostrarAlerta('Nuevo usuario')">Nuevo Usuario</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.auth.users.map(user => `
                            <tr>
                                <td>${user.username}</td>
                                <td>${user.name}</td>
                                <td>${user.role}</td>
                                <td>
                                    <button class="btn" onclick="app.mostrarAlerta('Editar usuario ${user.username}')">Editar</button>
                                    <button class="btn btn-danger" onclick="app.mostrarAlerta('Eliminar usuario ${user.username}')">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Métodos para gestión de casos
    mostrarFormularioCaso() {
        window.location.hash = 'nuevo-caso';
        this.showCasos();
    }

    crearCaso() {
        const numeroCaso = document.getElementById('numero-caso').value;
        const tipoCaso = document.getElementById('tipo-caso').value;
        const fechaCaso = document.getElementById('fecha-caso').value;
        const recolector = document.getElementById('recolector').value;
        const investigador = document.getElementById('investigador').value;

        if (numeroCaso && tipoCaso && fechaCaso && investigador) {
            const nuevoCaso = {
                numero: numeroCaso,
                tipo: tipoCaso,
                fecha: fechaCaso,
                recolector: recolector,
                investigador: investigador,
                estado: 'pendiente'
            };

            this.auth.addCaso(nuevoCaso);
            this.mostrarAlerta(`Caso ${numeroCaso} creado exitosamente`);
            window.location.hash = '';
            this.showCasos();
        } else {
            this.mostrarAlerta('Por favor complete todos los campos requeridos');
        }
    }

    verCaso(id) {
        const caso = this.auth.getCasos().find(c => c.id === id);
        if (caso) {
            this.mostrarAlerta(`Viendo caso: ${caso.numero}\nTipo: ${caso.tipo}\nEstado: ${caso.estado}`);
        }
    }

    editarCaso(id) {
        const caso = this.auth.getCasos().find(c => c.id === id);
        if (caso) {
            this.mostrarAlerta(`Editando caso: ${caso.numero}\nEsta funcionalidad estará disponible próximamente.`);
        }
    }

    eliminarCaso(id) {
        const caso = this.auth.getCasos().find(c => c.id === id);
        if (caso && confirm(`¿Está seguro de eliminar el caso ${caso.numero}?`)) {
            this.auth.deleteCaso(id);
            this.showCasos();
            this.mostrarAlerta('Caso eliminado correctamente');
        }
    }

    generarReporte() {
        this.mostrarAlerta('Generando reporte... Esta funcionalidad estará disponible próximamente.');
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (this.auth.login(username, password)) {
            this.currentView = 'dashboard';
            this.loadView();
            this.mostrarAlerta(`Bienvenido ${username}`);
        } else {
            this.mostrarAlerta('Usuario o contraseña incorrectos');
        }
    }

    logout() {
        this.auth.logout();
        this.currentView = 'login';
        this.loadView();
        this.mostrarAlerta('Sesión cerrada correctamente');
    }

    updateNavigation() {
        const user = this.auth.getCurrentUser();
        const loginBtn = document.getElementById('nav-login');
        
        if (user) {
            loginBtn.textContent = 'Cerrar Sesión';
            document.getElementById('nav-usuarios').style.display = 
                this.auth.hasPermission('delete') ? 'block' : 'none';
            
            document.querySelectorAll('nav ul li:not(#nav-login)').forEach(item => {
                item.style.display = 'block';
            });
        } else {
            loginBtn.textContent = 'Iniciar Sesión';
            document.getElementById('nav-usuarios').style.display = 'none';
            
            document.querySelectorAll('nav ul li:not(#nav-login)').forEach(item => {
                item.style.display = 'none';
            });
        }
    }

    showDashboard() {
        if (!this.auth.getCurrentUser()) {
            this.showLogin();
            return;
        }
        this.currentView = 'dashboard';
        this.loadView();
    }

    showCasos() {
        if (!this.auth.getCurrentUser()) {
            this.showLogin();
            return;
        }
        this.currentView = 'casos';
        this.loadView();
    }

    showReportes() {
        if (!this.auth.getCurrentUser()) {
            this.showLogin();
            return;
        }
        this.currentView = 'reportes';
        this.loadView();
    }

    showUsuarios() {
        if (!this.auth.getCurrentUser()) {
            this.showLogin();
            return;
        }
        this.currentView = 'usuarios';
        this.loadView();
    }

    showLogin() {
        this.currentView = 'login';
        this.loadView();
    }

    mostrarAlerta(mensaje) {
        alert(mensaje);
    }


renderCasos() {
    const user = this.auth.getCurrentUser();
    if (!user) {
        this.showLogin();
        return '';
    }

    // Verificar si debemos mostrar el formulario
    if (window.location.hash === '#nuevo-caso' && this.auth.hasPermission('create')) {
        return this.renderFormularioCaso();
    }

    let casos = this.auth.getCasos();

    // Filtrar casos según permisos
    if (user.role === 'recolector') {
        casos = casos.filter(caso => caso.recolector === user.name);
    } else if (user.role === 'investigador') {
        casos = casos.filter(caso => caso.investigador === user.name);
    }

    let actions = '';
    if (this.auth.hasPermission('create')) {
        actions = '<button class="btn btn-nuevo-caso" id="btn-nuevo-caso">Nuevo Caso</button>';
    }

    const casosHTML = casos.length > 0 ? casos.map(caso => {
        console.log('Renderizando caso:', caso.numero);
        console.log('- Puede actualizar:', this.auth.canUpdateCaso(caso));
        console.log('- Puede eliminar:', this.auth.canDeleteCaso(caso));
        
        return `
            <tr>
                <td>${caso.numero}</td>
                <td>${caso.tipo}</td>
                <td>${caso.fecha}</td>
                <td>${caso.recolector}</td>
                <td>${caso.investigador}</td>
                <td><span class="estado-badge estado-${(caso.estado || 'pendiente').replace(' ', '-')}">${caso.estado || 'pendiente'}</span></td>
                <td>
                    <button class="btn btn-ver" data-caso-id="${caso.id}">Ver</button>
                    ${this.auth.canUpdateCaso(caso) ? `<button class="btn btn-editar" data-caso-id="${caso.id}">Editar</button>` : ''}
                    ${this.auth.canDeleteCaso(caso) ? `<button class="btn btn-danger btn-eliminar" data-caso-id="${caso.id}">Eliminar</button>` : ''}
                </td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="7" style="text-align: center;">No hay casos registrados</td></tr>';

    return `
        <div class="casos-header">
            <h2>Gestión de Casos</h2>
            ${actions}
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>N° Caso</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Recolector</th>
                        <th>Investigador</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${casosHTML}
                </tbody>
            </table>
        </div>
    `;
}

setupCasosListeners() {
    setTimeout(() => {
        console.log('Configurando listeners de casos...');
        
        // Listener para nuevo caso
        const nuevoCasoBtn = document.getElementById('btn-nuevo-caso');
        if (nuevoCasoBtn) {
            nuevoCasoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Nuevo caso clickeado');
                this.mostrarFormularioCaso();
            });
        }

        // Delegación de eventos para botones de la tabla
        document.addEventListener('click', (e) => {
            console.log('Click detectado en:', e.target.className);
            
            if (e.target.classList.contains('btn-ver')) {
                const casoId = e.target.getAttribute('data-caso-id');
                console.log('Ver caso:', casoId);
                this.verCaso(casoId);
            }
            if (e.target.classList.contains('btn-editar')) {
                const casoId = e.target.getAttribute('data-caso-id');
                console.log('Editar caso:', casoId);
                this.editarCaso(casoId);
            }
            if (e.target.classList.contains('btn-eliminar')) {
                const casoId = e.target.getAttribute('data-caso-id');
                console.log('Eliminar caso:', casoId);
                this.eliminarCaso(casoId);
            }
            if (e.target.classList.contains('btn-nuevo-caso')) {
                console.log('Nuevo caso desde delegación');
                this.mostrarFormularioCaso();
            }
        });

        // Listener para formulario de caso (si existe)
        const casoForm = document.getElementById('caso-form');
        if (casoForm) {
            casoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Formulario enviado');
                this.crearCaso();
            });
        }

        // Listener para cancelar formulario (si existe)
        const cancelarBtn = document.getElementById('btn-cancelar-caso');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                console.log('Cancelar formulario');
                window.location.hash = '';
                this.showCasos();
            });
        }
    }, 100);
}

}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ForensicApp();
});