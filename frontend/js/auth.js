// Sistema de autenticación
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('forensic_users')) || this.initializeDefaultUsers();
        this.casos = JSON.parse(localStorage.getItem('forensic_casos')) || this.initializeDefaultCasos();
    }

    initializeDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'superusuario',
                name: 'Administrador del Sistema'
            },
            {
                id: 2,
                username: 'recolector',
                password: 'recolector123',
                role: 'recolector',
                name: 'Téc. Patricia Vega'
            },
            {
                id: 3,
                username: 'investigador',
                password: 'investigador123',
                role: 'investigador',
                name: 'Dr. Alejandro Rojas'
            }
        ];
        localStorage.setItem('forensic_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    initializeDefaultCasos() {
        const defaultCasos = [
            {
                id: '1',
                numero: 'ML-2023-01584',
                tipo: 'Muerte violenta – Sospecha de homicidio',
                fecha: '15/10/2023',
                recolector: 'Téc. Patricia Vega',
                investigador: 'Dr. Alejandro Rojas',
                estado: 'en investigacion'
            },
            {
                id: '2', 
                numero: 'ML-2023-01585',
                tipo: 'Muerte sospechosa',
                fecha: '16/10/2023',
                recolector: 'Téc. Patricia Vega',
                investigador: 'Dr. Carlos Mendoza',
                estado: 'pendiente'
            }
        ];
        localStorage.setItem('forensic_casos', JSON.stringify(defaultCasos));
        return defaultCasos;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            this.currentUser = stored ? JSON.parse(stored) : null;
        }
        return this.currentUser;
    }

    hasPermission(action) {
        const user = this.getCurrentUser();
        if (!user) return false;

        const permissions = {
            'superusuario': ['create', 'read', 'update', 'delete'],
            'recolector': ['create', 'read'],
            'investigador': ['read', 'update']
        };

        return permissions[user.role]?.includes(action) || false;
    }

    canDeleteCaso(caso) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        console.log('Verificando eliminación para:', user.name, 'rol:', user.role);
        console.log('Caso recolector:', caso.recolector);
        
        // Superusuario puede eliminar cualquier caso
        if (user.role === 'superusuario') {
            console.log('Superusuario puede eliminar');
            return true;
        }
        
        // Recolector solo puede eliminar sus propios casos
        if (user.role === 'recolector') {
            const puedeEliminar = caso.recolector === user.name;
            console.log('Recolector puede eliminar:', puedeEliminar);
            return puedeEliminar;
        }
        
        console.log('No puede eliminar');
        return false;
    }

    canUpdateCaso(caso) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        console.log('Verificando actualización para:', user.name, 'rol:', user.role);
        console.log('Caso investigador:', caso.investigador);
        
        // Superusuario puede actualizar cualquier caso
        if (user.role === 'superusuario') {
            console.log('Superusuario puede actualizar');
            return true;
        }
        
        // Investigador solo puede actualizar casos asignados a él
        if (user.role === 'investigador') {
            const puedeActualizar = caso.investigador === user.name;
            console.log('Investigador puede actualizar:', puedeActualizar);
            return puedeActualizar;
        }
        
        console.log('No puede actualizar');
        return false;
    }

    getCasos() {
        return this.casos;
    }

    addCaso(caso) {
        // Generar ID único
        caso.id = Date.now().toString();
        this.casos.push(caso);
        localStorage.setItem('forensic_casos', JSON.stringify(this.casos));
        return caso.id;
    }

    deleteCaso(id) {
        this.casos = this.casos.filter(c => c.id !== id);
        localStorage.setItem('forensic_casos', JSON.stringify(this.casos));
    }

    canDeleteCaso(caso) {
    const user = this.getCurrentUser();
    if (!user) {
        console.log('No hay usuario logueado');
        return false;
    }
    
    console.log('=== VERIFICANDO ELIMINACIÓN ===');
    console.log('Usuario:', user.name, 'Rol:', user.role);
    console.log('Caso recolector:', caso.recolector);
    console.log('Caso investigador:', caso.investigador);
    
    // Superusuario puede eliminar cualquier caso
    if (user.role === 'superusuario') {
        console.log('✅ Superusuario puede eliminar cualquier caso');
        return true;
    }
    
    // Recolector solo puede eliminar sus propios casos
    if (user.role === 'recolector') {
        const puedeEliminar = caso.recolector === user.name;
        console.log('🔍 Recolector puede eliminar:', puedeEliminar);
        console.log('Comparación:', caso.recolector, '===', user.name);
        return puedeEliminar;
    }
    
    // Investigador NO puede eliminar casos
    console.log('❌ No puede eliminar - Rol:', user.role);
    return false;
}

canUpdateCaso(caso) {
    const user = this.getCurrentUser();
    if (!user) {
        console.log('No hay usuario logueado');
        return false;
    }
    
    console.log('=== VERIFICANDO ACTUALIZACIÓN ===');
    console.log('Usuario:', user.name, 'Rol:', user.role);
    console.log('Caso investigador:', caso.investigador);
    
    // Superusuario puede actualizar cualquier caso
    if (user.role === 'superusuario') {
        console.log('✅ Superusuario puede actualizar cualquier caso');
        return true;
    }
    
    // Investigador solo puede actualizar casos asignados a él
    if (user.role === 'investigador') {
        const puedeActualizar = caso.investigador === user.name;
        console.log('🔍 Investigador puede actualizar:', puedeActualizar);
        console.log('Comparación:', caso.investigador, '===', user.name);
        return puedeActualizar;
    }
    
    // Recolector NO puede actualizar casos
    console.log('❌ No puede actualizar - Rol:', user.role);
    return false;
}


}


const auth = new AuthSystem();