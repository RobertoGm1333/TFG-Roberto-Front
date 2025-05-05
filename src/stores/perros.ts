import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type PerroDto from './dtos/perro.dto'
import type DeseadoDto from './dtos/deseados.dto'

export const useperrosStore = defineStore('perros', () => {
    let perros = ref<PerroDto[]>([])
    let perrosFiltrados = ref<PerroDto[]>([])
    let perrosDeseados = ref<DeseadoDto[]>([]);

    // Estados para los filtros
    const filtros = ref({
        edadMin: 1,
        edadMax: 15,
        raza: ''
    })

    function cargarPerrosDeseadosDesdeStorage() {
        const perrosDeseadosGuardados = JSON.parse(localStorage.getItem('perrosDeseados') || '[]');
        if (perrosDeseadosGuardados.length > 0) {
            perrosDeseados.value = perrosDeseadosGuardados;
        } else {
            obtenerPerrosDeseados(); // Si no hay datos locales, carga desde API
        }
    }

    // Almacenar perrosDeseados en LocalStorage
    function guardarPerrosDeseadosEnStorage() {
        localStorage.setItem('perrosDeseados', JSON.stringify(perrosDeseados.value));
    }

    /* function createPerro(perro: PerroDto) {
         //fetch(POST)
         //body: JSON.stringify()
         perros.value.push(perro)
     }*/

    async function fetchPerro() {
        try {
            const response = await fetch("https://localhost:7278/api/Perro");

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data: PerroDto[] = await response.json();
            perros.value = data;
            aplicarFiltros() // Aplicar filtros después de cargar los datos
            console.log('Perros obtenidos:', data);
        } catch (error) {
            console.error('Error al obtener los perros:', error);
        }
    }

    // Función para actualizar los filtros
    function actualizarFiltros(nuevosFiltros) {
        filtros.value = { ...filtros.value, ...nuevosFiltros }
        aplicarFiltros()
    }

    // Función para aplicar los filtros actuales a la lista de perros
    function aplicarFiltros() {
        perrosFiltrados.value = perros.value.filter(perro => {
            // Filtrar por edad
            const edadEnRango = perro.edad >= filtros.value.edadMin &&
                perro.edad <= filtros.value.edadMax

            // Filtrar por raza (si hay una seleccionada)
            const razaCoincide = filtros.value.raza === '' ||
                perro.raza === filtros.value.raza

            return edadEnRango && razaCoincide
        })
    }

    async function obtenerPerrosDeseados(id_Usuario: number) {
        try {
            const response = await fetch(`https://localhost:7278/api/Deseado/usuario/${id_Usuario}`);
            if (!response.ok) {
                throw new Error('Error al obtener los perros deseados');
            }
            const data = await response.json();

            // Obtener la información completa de cada perro incluyendo `id_Deseado`
            const perrosCompletos = await Promise.all(
                data.map(async (deseado: any) => {
                    const perroResponse = await fetch(`https://localhost:7278/api/Perro/${deseado.id_Perro}`);
                    if (!perroResponse.ok) {
                        throw new Error(`Error al obtener el perro con id ${deseado.id_Perro}`);
                    }
                    const perro = await perroResponse.json();

                    return { ...perro, id_Deseado: deseado.id_Deseado }; // ✅ Guardamos `id_Deseado`
                })
            );

            perrosDeseados.value = perrosCompletos; // ✅ Ahora sí incluye `id_Deseado`
            guardarPerrosDeseadosEnStorage(); // Guarda en LocalStorage
        } catch (error) {
            console.error('Error al obtener los perros deseados:', error);
        }
    }


    async function agregarPerroADeseados(idUsuario: number, id_Perro: number) {
        try {
            const response = await fetch('https://localhost:7278/api/Deseado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_Usuario: idUsuario,
                    id_Perro: id_Perro,
                    fecha_Deseado: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Error al agregar el perro a deseados');
            }

            const nuevoDeseado = await response.json(); // Obtener el ID generado

            if (!nuevoDeseado.id_Deseado) {
                throw new Error("La API no devolvió un ID de deseado válido");
            }

            perrosDeseados.value.push({ ...nuevoDeseado, id_Deseado: nuevoDeseado.id_Deseado });
            guardarPerrosDeseadosEnStorage();
            console.log('Perro agregado a deseados:', nuevoDeseado);

            return nuevoDeseado; // Devolver el nuevo ID de deseado

        } catch (error) {
            console.error('Error en agregarPerroADeseados:', error);
            throw error; // Lanza el error para manejarlo en el componente
        }
    }


    // Eliminar un perro de los deseados usando el idDeseado
    async function eliminarPerroDeDeseados(idDeseado: number) {
        try {
            const response = await fetch(`https://localhost:7278/api/Deseado/${idDeseado}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el perro de deseados');
            }

            // Filtrar correctamente usando id_Deseado
            perrosDeseados.value = perrosDeseados.value.filter(perro => perro.id_Deseado !== idDeseado);
            guardarPerrosDeseadosEnStorage();
            console.log(`Perro con ID deseado ${idDeseado} eliminado de deseados.`);
        } catch (error) {
            console.error('Error en eliminarPerroDeDeseados:', error);
        }
    }

    async function createPerro(nuevoPerro: PerroDto) {
        try {
            const response = await fetch("https://localhost:7278/api/Perro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_Perro: nuevoPerro.nombre_Perro,
                    raza: nuevoPerro.raza,
                    edad: nuevoPerro.edad,
                    sexo: nuevoPerro.sexo,
                    esterilizado: nuevoPerro.esterilizado,
                    descripcion_Perro: nuevoPerro.descripcion_Perro,
                    imagen_Perro: nuevoPerro.imagen_Perro,
                    id_Protectora: nuevoPerro.id_Protectora
                })
            });

            if (!response.ok) {
                throw new Error("Error al agregar el perro");
            }

            const perroCreado = await response.json();
            perros.value.push(perroCreado);
            console.log("Perro agregado exitosamente:", perroCreado);
            aplicarFiltros() // Volver a aplicar los filtros cuando se agregue un perro

        } catch (error) {
            console.error("Error al agregar el perro:", error);
        }
    }

    async function deletePerro(id_Perro: number) {
        try {
            const response = await fetch(`https://localhost:7278/api/Perro/${id_Perro}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el perro");
            }

            perros.value = perros.value.filter(g => g.id_Perro !== id_Perro);
            console.log(`Perro con ID ${id_Perro} eliminado correctamente.`);
        } catch (error) {
            console.error("Error al eliminar el perro:", error);
        }
    }

    async function updatePerro(perro: PerroDto) {
        try {
            console.log("Enviando datos para actualizar:", perro);

            const response = await fetch(`https://localhost:7278/api/Perro/${perro.id_Perro}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perro)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la API:", errorText);
                throw new Error("Error al actualizar el usuario");
            }

            perros.value = perros.value.map(g => (g.id_Perro === perro.id_Perro ? perro : g));
            console.log("Perro actualizado correctamente:", perro);
            aplicarFiltros()
        } catch (error) {
            console.error("Error al actualizar el perro:", error);
        }
    }

    return {
        perros,
        perrosFiltrados,
        filtros,
        perrosDeseados,
        createPerro,
        deletePerro,
        updatePerro,
        fetchPerro,
        actualizarFiltros,
        aplicarFiltros,
        obtenerPerrosDeseados,
        agregarPerroADeseados,
        eliminarPerroDeDeseados,
        cargarPerrosDeseadosDesdeStorage
    }
})