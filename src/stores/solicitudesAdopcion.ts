import { ref } from 'vue'
import { defineStore } from 'pinia'
import type SolicitudAdopcionDto from './dtos/solicitudadopcion.dto'

export const useSolicitudesAdopcionStore = defineStore('solicitudesAdopcion', () => {
    const solicitudes = ref<SolicitudAdopcionDto[]>([])

    async function fetchSolicitudes() {
        try {
            const response = await fetch('http://localhost:5167/api/SolicitudAdopcion')
            if (!response.ok) throw new Error('Error al obtener las solicitudes')
            solicitudes.value = await response.json()
        } catch (error) {
            console.error('Error en fetchSolicitudes:', error)
        }
    }

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
        createSolicitud,
        updateSolicitud,
        deleteSolicitud
    }
})
