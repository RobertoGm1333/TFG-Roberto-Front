import { ref } from 'vue'
import { defineStore } from 'pinia'
import type SolicitudAdopcionDto from './dtos/solicitudadopcion.dto'

export const useSolicitudesAdopcionStore = defineStore('solicitudesAdopcion', () => {
    const solicitudes = ref<SolicitudAdopcionDto[]>([])

    // Obtener TODAS las solicitudes (admin)
    async function fetchSolicitudes() {
        try {
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion')
            if (!response.ok) throw new Error('Error al obtener las solicitudes')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchSolicitudes:', error)
        }
    }

    // Obtener solicitudes del usuario loggeado
    async function fetchMisSolicitudes() {
        try {
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion/mias')
            if (!response.ok) throw new Error('Error al obtener mis solicitudes')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchMisSolicitudes:', error)
        }
    }

    // Obtener solicitudes de una protectora (por idProtectora)
    async function fetchSolicitudesProtectora(idProtectora: number) {
        try {
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/protectora/${idProtectora}`)
            if (!response.ok) throw new Error('Error al obtener solicitudes de protectora')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchSolicitudesProtectora:', error)
        }
    }

    // Crear solicitud (usuario)
    async function createSolicitud(solicitud: SolicitudAdopcionDto) {
        try {
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(solicitud)
            })

            if (!response.ok) throw new Error('Error al crear la solicitud')
            const nueva = await response.json()
            solicitudes.value.push(nueva)
        } catch (error) {
            console.error('Error en createSolicitud:', error)
        }
    }

    // Actualizar solicitud completa (solo para admin o caso especial)
    async function updateSolicitud(solicitud: SolicitudAdopcionDto) {
        try {
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/${solicitud.id_Solicitud}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/estado/${idSolicitud}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado, comentario_Protectora: comentarioProtectora })
            })
            if (!response.ok) throw new Error('Error al actualizar el estado')
    
            // ✅ Ahora sí pasas el idProtectora activo que te llegue desde donde llames a esta función
            await fetchSolicitudesProtectora(idProtectora)
        } catch (error) {
            console.error('Error en updateEstadoSolicitud:', error)
        }
    }    

    // Eliminar solicitud
    async function deleteSolicitud(id_Solicitud: number) {
        try {
            const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/${id_Solicitud}`, {
                method: 'DELETE'
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
