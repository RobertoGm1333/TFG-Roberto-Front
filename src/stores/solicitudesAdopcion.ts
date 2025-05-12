import { ref } from 'vue'
import { defineStore } from 'pinia'
import type SolicitudAdopcionDto from './dtos/solicitudadopcion.dto'

export const useSolicitudesAdopcionStore = defineStore('solicitudesAdopcion', () => {
    const solicitudes = ref<SolicitudAdopcionDto[]>([])

    // Obtener el token de autenticación y datos del usuario
    function getAuthData() {
        const user = localStorage.getItem('user')
        if (!user) return null
        const userData = JSON.parse(user)
        return {
            token: userData.token,
            id: userData.id_Usuario
        }
    }

    // Obtener TODAS las solicitudes (admin)
    async function fetchSolicitudes() {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion', {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            })
            if (!response.ok) throw new Error('Error al obtener las solicitudes')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchSolicitudes:', error)
        }
    }

    // Obtener solicitudes del usuario loggeado
    async function fetchMisSolicitudes() {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/usuario/${authData.id}`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            })
            if (!response.ok) throw new Error('Error al obtener mis solicitudes')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchMisSolicitudes:', error)
        }
    }

    // Obtener solicitudes de una protectora (por idProtectora)
    async function fetchSolicitudesProtectora(idProtectora: number) {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/protectora/${idProtectora}`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            })
            if (!response.ok) throw new Error('Error al obtener solicitudes de protectora')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchSolicitudesProtectora:', error)
        }
    }

    // Crear solicitud (usuario)
    async function createSolicitud(solicitud: SolicitudAdopcionDto) {
        try {
            const authData = getAuthData()
            if (!authData) return

            // Primero verificar si ya existe una solicitud
            const checkResponse = await fetch(`http://localhost:5167/api/SolicitudAdopcion/usuario/${solicitud.id_Usuario}/gato/${solicitud.id_Gato}`)
            
            if (checkResponse.ok) {
                // Si la respuesta es ok, significa que ya existe una solicitud
                throw new Error('Ya existe una solicitud de adopción para este gato')
            }
            
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(solicitud)
            })

            if (!response.ok) throw new Error('Error al crear la solicitud')
            const nueva = await response.json()
            solicitudes.value.push(nueva)
            return nueva
        } catch (error) {
            console.error('Error en createSolicitud:', error)
            throw error // Propagar el error para manejarlo en el componente
        }
    }

    // Actualizar solicitud completa (solo para admin o caso especial)
    async function updateSolicitud(solicitud: SolicitudAdopcionDto) {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/${solicitud.id_Solicitud}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(solicitud)
            })

            if (!response.ok) throw new Error('Error al actualizar la solicitud')

            solicitudes.value = solicitudes.value.map(s =>
                s.id_Solicitud === solicitud.id_Solicitud ? solicitud : s
            )
        } catch (error) {
            console.error('Error en updateSolicitud:', error)
        }
    }

    // Cambiar solo estado y comentario de protectora (para protectora)
    async function updateEstadoSolicitud(idSolicitud: number, estado: string, comentarioProtectora: string, idProtectora: number) {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/estado/${idSolicitud}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({ estado, comentario_Protectora: comentarioProtectora })
            })
            if (!response.ok) throw new Error('Error al actualizar el estado')
    
            await fetchSolicitudesProtectora(idProtectora)
        } catch (error) {
            console.error('Error en updateEstadoSolicitud:', error)
        }
    }    

    // Eliminar solicitud
    async function deleteSolicitud(id_Solicitud: number) {
        try {
            const authData = getAuthData()
            if (!authData) return
            
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/${id_Solicitud}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            })

            if (!response.ok) throw new Error('Error al eliminar la solicitud')

            solicitudes.value = solicitudes.value.filter(s => s.id_Solicitud !== id_Solicitud)
        } catch (error) {
            console.error('Error en deleteSolicitud:', error)
        }
    }

    return {
        solicitudes,
        fetchSolicitudes,
        fetchMisSolicitudes,
        fetchSolicitudesProtectora,
        createSolicitud,
        updateSolicitud,
        updateEstadoSolicitud,
        deleteSolicitud
    }
})
