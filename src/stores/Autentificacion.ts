import { defineStore } from 'pinia';

export const useAutenticacion = defineStore('Autenticacion', {
    state: () => ({
        usuario: null as {
            id_Usuario: number,
            nombre: string,
            apellido: string,
            email: string,
            rol: string,
            activo: boolean
        } | null
    }),

    getters: {
        esAutenticado: (state) => !!state.usuario,
        esAdmin: (state) => state.usuario?.rol === 'admin',
        esProtectora: (state) => state.usuario?.rol === 'protectora',
        obtenerIdUsuario: (state) => state.usuario?.id_Usuario ?? null
    },

    actions: {
        iniciarSesion(datosUsuario: any) {
            console.log("Usuario recibido al iniciar sesión:", datosUsuario);
            this.usuario = datosUsuario;
            localStorage.setItem('user', JSON.stringify(datosUsuario));
        },

        cerrarSesion() {
            this.usuario = null;
            localStorage.removeItem('user');
        },

        cargarUsuarioDesdeLocalStorage() {
            const usuario = localStorage.getItem('user');
            if (usuario) {
                this.usuario = JSON.parse(usuario);
            }
        }
    }
});
