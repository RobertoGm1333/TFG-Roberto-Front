<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAutenticacion } from "@/stores/Autentificacion";
import { usegatosStore } from "@/stores/gatos.ts"
import { useusuariosStore } from "@/stores/usuarios.ts"
import type GatoDto from "../stores/dtos/gato.dto";
import type ProtectoraDto from "../stores/dtos/protectoras.dto";

const props = defineProps<{ gato: GatoDto; protectora?: ProtectoraDto }>();
const autenticacion = useAutenticacion();
const { usuario } = storeToRefs(autenticacion);
const gatosStore = usegatosStore();
const gatosDeseados = computed(() => gatosStore.gatosDeseados);


const mensaje = ref("");
const esDeseado = ref(false);
const idDeseado = ref<number | null>(null);
const modal = ref(false);

onMounted(async () => {
  // Asegúrate de que el usuario esté cargado correctamente
  await autenticacion.cargarUsuarioDesdeLocalStorage?.();

  const id = autenticacion.usuario?.id_Usuario;
  if (!id) {

    return;
  }

  await gatosStore.obtenerGatosDeseados(id);
});


const abrirModal = () => {
  modal.value = true;
};

const cerrarModal = () => {
  modal.value = false;
  mensaje.value = "";
};

const agregarADeseados = async () => {
  if (!autenticacion.usuario) {
    mensaje.value = "Debes iniciar sesión para agregar a deseados";
    return;
  }

  if (esDeseado.value) {
    mensaje.value = "Este gato ya está en deseados";
    return;
  }

  try {
    const nuevoDeseado = await gatosStore.agregarGatoADeseados(
      autenticacion.usuario.id_Usuario,
      props.gato.id_Gato
    );

    // Extraemos el ID pero no lo forzamos como obligatorio
    const id = nuevoDeseado?.id_Deseado ?? nuevoDeseado?.Id_Deseado ?? null;
    
    esDeseado.value = true;
    idDeseado.value = id;
    mensaje.value = "Gato agregado a deseados";
  } catch (error) {
    console.error("Error al agregar a deseados:", error);
    mensaje.value = "No se pudo agregar a deseados";
  }
};


const eliminarDeDeseados = async () => {
  if (!autenticacion.usuario) {
    mensaje.value = "Debes iniciar sesión para eliminar de deseados";
    return;
  }

  if (idDeseado.value === null || idDeseado.value === undefined) {
    mensaje.value = "No se encontró el ID de deseados";
    console.error("Error: idDeseado es null o undefined", idDeseado.value);
    return;
  }

  try {
    await gatosStore.eliminarGatoDeDeseados(idDeseado.value);
    esDeseado.value = false;
    idDeseado.value = null;
    mensaje.value = "Gato eliminado de deseados";
  } catch (error) {
    console.error("Error:", error);
    mensaje.value = "No se pudo eliminar de deseados";
  }
};
</script>

<template>
  <v-card class="CardGatoDetalles">
    <v-img :src="gato.imagen_Gato" cover class="FotoDetallesGato"></v-img>
    <v-card-title>{{ gato.nombre_Gato }}</v-card-title>
    <v-card-subtitle>{{ gato.raza }} - {{ gato.edad }} años</v-card-subtitle>
    <v-card-text>
      <p><strong>Sexo:</strong> {{ gato.sexo }}</p>
      <p><strong>Protectora:</strong> {{ protectora?.nombre_Protectora || "No disponible" }}</p>
      <p><strong>Descripción:</strong> {{ gato.descripcion_Gato }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="usuario" color="green" @click="agregarADeseados" :disabled="esDeseado">Añadir a Deseados</v-btn>
      <v-btn v-if="usuario" color="red" @click="eliminarDeDeseados" :disabled="!esDeseado">Eliminar de Deseados</v-btn>
    </v-card-actions>
    <p v-if="mensaje" class="gato-card__mensaje">{{ mensaje }}</p>
    <v-card-actions>
      <v-btn color="#FF5500" to="/gato">Volver a gatos</v-btn>
      <v-btn color="green" :href="`mailto:${protectora?.email}`" :disabled="!protectora?.email">
        Contactar Protectora
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.CardGatoDetalles {
  width: 100%;
}

.gato-card__mensaje {
  text-align: center;
  color: green;
}

.FotoDetallesGato {
  max-height: 400px;
}

.v-card-actions {
  flex-direction: column;
}

@media (min-width: 620px) {
  .CardGatoDetalles {
    width: 50%;
  }

  .v-card-actions {
    flex-direction: row;
  }
}
</style>
