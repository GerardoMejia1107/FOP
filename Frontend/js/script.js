// SPA Routing
const app = document.getElementById('app');


// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});


// Vistas
const rutas = {
  '/inicio': 'vistas/inicio.html',
  '/casos': 'vistas/casos.html',
  '/usuarios': 'vistas/usuarios.html',
  '/reportes': 'vistas/reportes.html',
  '/configuracion': 'vistas/configuracion.html',
};


// Función para renderizar según la ruta
function router() {
  let path = window.location.pathname;

  // Redirigir raíz o index.html a /inicio
  if (path === '/' || path === '/index.html') {
    history.replaceState(null, null, '/inicio');
    path = '/inicio';
  }

  const ruta = rutas[path];

  if (ruta) {
    fetch(ruta)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la vista');
        }
        return response.text();
      })
      .then(html => {
        app.innerHTML = html;
      })
      .catch(err => {
        app.innerHTML = '<h1>Error</h1><p>No se pudo cargar la vista solicitada.</p>';
        console.error(err);
      });
  } else {
    app.innerHTML = '<h1>404</h1><p>Página no encontrada</p>';
  }
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
