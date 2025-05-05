<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useperrosStore } from "@/stores/perros.ts";

const perrosStore = useperrosStore();
const mostrarModal = ref(false);
const usuarioEditado = ref({ id_Perro: 0, nombre_Perro: "", raza: "", edad: 0, sexo: "", esterilizado: false, descripcion_Perro: "", imagen_Perro: "", id_Protectora: 1 });

const nuevoPerro = ref({
    id_Perro: 0,  // Se genera en la API, pero en el frontend puede ser un valor temporal
    nombre_Perro: "",
    raza: "",
    edad: 0,
    sexo: "",
    esterilizado: false,
    descripcion_Perro: "", 
    imagen_Perro: "",
    id_Protectora: 1 
});

onMounted(() => {
    perrosStore.fetchPerro();
});

const crearPerro = async () => {
    try {
        await perrosStore.createPerro(nuevoPerro.value);
        alert("Perro agregado exitosamente");
        // Limpiar formulario
        nuevoPerro.value = { id_Perro: 0, nombre_Perro: "", raza: "", edad: 0, sexo: "", esterilizado: false, descripcion_Perro: "", imagen_Perro: "", id_Protectora: 1 };
    } catch (error) {
        console.error("Error al agregar el perro:", error);
    }
};

const eliminarPerro = async (id_Perro: number) => {
    console.log("Intentando eliminar perro con ID:", id_Perro); // Verifica el ID antes de eliminar

    if (!id_Perro || id_Perro === 0) {
        alert("Error: ID de perro inválido.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este perro?")) {
        await perrosStore.deletePerro(id_Perro);
    }
};

const editarPerro = (perro: any) => {
    usuarioEditado.value = { ...perro };
    mostrarModal.value = true;
};

const guardarEdicion = async () => {
    await perrosStore.updatePerro(usuarioEditado.value);
    cerrarModal();
};

const cerrarModal = () => {
    mostrarModal.value = false;
};

</script>

<template>
    <div class="admin-perros">
        <h2 class="admin-perros__titulo">Gestión de Perros</h2>

        <div class="admin-perros__formulario">
            <h3 class="admin-perros__subtitulo">Agregar Nuevo Perro</h3>
            <form @submit.prevent="crearPerro" class="admin-perros__form">
                <input v-model="nuevoPerro.nombre_Perro" placeholder="Nombre del perro" required>
                <input v-model="nuevoPerro.raza" placeholder="Raza" required>
                <input v-model.number="nuevoPerro.edad" type="number" placeholder="Edad" required>
                <input v-model="nuevoPerro.sexo" placeholder="Sexo" required>
                <label>
                    <input v-model="nuevoPerro.esterilizado" type="checkbox"> Esterilizado
                </label>
                <input v-model="nuevoPerro.descripcion_Perro" placeholder="Descripción" required>
                <input v-model="nuevoPerro.imagen_Perro" placeholder="URL de imagen" required>
                <button type="submit" class="admin-perros__boton">Agregar Perro</button>
            </form>
        </div>

        <div class="admin-perros__lista">
            <h3 class="admin-perros__subtitulo">Lista de Perros</h3>
            <div class="admin-perros__grid">
                <div v-for="perro in perrosStore.perros" :key="perro.id_Perro" class="admin-perros__item">
                    <img :src="perro.imagen_Perro" alt="Perro" class="admin-perros__imagen">
                    <div class="admin-perros__info">
                        <p><strong>Nombre:</strong> {{ perro.nombre_Perro }}</p>
                        <p><strong>Raza:</strong> {{ perro.raza }}</p>
                        <p><strong>Edad:</strong> {{ perro.edad }} años</p>
                        <p><strong>Sexo:</strong> {{ perro.sexo }}</p>
                    </div>
                    <div class="admin-perros__acciones">
                        <button @click="editarPerro(perro)" class="admin-perros__boton--editar">Editar</button>
                        <button @click="eliminarPerro(perro.id_Perro)" class="admin-perros__boton--eliminar">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

        <v-dialog v-model="mostrarModal" max-width="500px">
            <v-card>
                <v-card-title>Editar Perro</v-card-title>
                <v-card-text>
                    <input v-model="usuarioEditado.nombre_Perro" placeholder="Nombre" style="margin-right: 10px;">
                    <input v-model="usuarioEditado.raza" placeholder="Raza">
                    <input v-model.number="usuarioEditado.edad" type="number" placeholder="Edad">
                    <input v-model="usuarioEditado.sexo" placeholder="Sexo"><br>
                    <label>
                        <input v-model="usuarioEditado.esterilizado" type="checkbox"> Esterilizado
                    </label>
                    <input v-model="usuarioEditado.descripcion_Perro" placeholder="Descripción" style="width: 272px; margin-left: 10px">
                    <input v-model="usuarioEditado.imagen_Perro" placeholder="URL de imagen">
                </v-card-text>
                <v-card-actions>
                    <v-btn color="grey"@click="cerrarModal" class="admin-perros__boton">Cancelar</v-btn>
                    <v-btn color="green" @click="guardarEdicion" class="admin-perros__boton">Guardar Cambios</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped lang="scss">
.admin-perros {
    padding: $espacio-grande;
    max-width: 800px;
    margin: auto;
    text-align: center;

    &__titulo {
        font-size: 2rem;
        color: #333;
        margin-bottom: $espacio-grande;
    }

    &__formulario {
        padding: $espacio-grande;
        border-radius: $espacio-mediano;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: $espacio-extra-grande;
    }

    &__subtitulo {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: $espacio-mediano;

        input {
            padding: $espacio-mediano;
            border: 1px solid $border-gris2;
            border-radius: $espacio-pequeno;
        }

        label {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        button {
            background: $color-principal;
            color: white;
            padding: $espacio-mediano;
            border: none;
            border-radius: $espacio-pequeno;
            cursor: pointer;
            transition: background 0.3s;

            &:hover {
                background: $color-principal-oscuro;
            }
        }
    }

    &__lista {
        margin-top: $espacio-grande;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        padding: $espacio-mediano;
    }

    &__item {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: $sombra-contenedor;
        text-align: left;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__imagen {
        width: 100%;
        max-width: 200px;
        height: 150px;
        border-radius: $espacio-pequeno;
        object-fit: cover;
        margin-bottom: $espacio-mediano;
    }

    &__info {
        width: 100%;
        text-align: center;
    }

    &__acciones {
        margin-top: $espacio-mediano;
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    &__boton--editar {
        background: $color-principal;
        color: $color-blanco;
        padding: 8px;
        border: none;
        border-radius: $espacio-pequeno;
        cursor: pointer;
        margin-top: $espacio-mediano;

        &:hover {
            background: $color-principal-oscuro;
        }
    }

    &__boton--eliminar {
        background: $color-rojo;
        color: $color-blanco;
        padding: 8px;
        border: none;
        border-radius: $espacio-pequeno;
        cursor: pointer;
        margin-top: $espacio-mediano;

        &:hover {
            background: darkred;
        }
    }
}

.v-card-text {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>