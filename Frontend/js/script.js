// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// SPA Routing
const app = document.getElementById('app');

// Vistas
const rutas = {
  '/': '<h1>Inicio</h1><p>Bienvenido al panel forense.</p>',
  '/casos': '<h1>Casos</h1><p>Listado de casos activos.</p>',
  '/usuarios': '<h1>Usuarios</h1><p>Gestión de usuarios del sistema.</p>',
  '/reportes': '<h1>Reportes</h1><p>Generación de reportes forenses.</p>',
  '/configuracion': '<h1>Configuración</h1><p>Ajustes del sistema.</p>',
};

// Función para renderizar según la ruta
function router() {
  const path = window.location.pathname;
  app.innerHTML = rutas[path] || '<h1>404</h1><p>Página no encontrada</p>';
}

// Navegación sin recargar
function navegar(event) {
  const link = event.target.closest('a[data-link]');
  if (!link) return;

  event.preventDefault();
  const href = link.getAttribute('href');
  history.pushState(null, null, href);
  router();
}

// Escuchar clics en links del menú
document.addEventListener('click', navegar);

// Soportar botones de navegación (atrás/adelante)
window.addEventListener('popstate', router);

// Inicializar la vista
router();
