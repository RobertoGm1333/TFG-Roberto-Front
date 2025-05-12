<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import DetallesGatoCard from "@/components/DetallesGatoCard.vue";
import { usegatosStore } from "@/stores/gatos";
import { useprotectorasStore } from "@/stores/protectoras";
import { useSolicitudesAdopcionStore } from "@/stores/solicitudesAdopcion";
import SolicitudAdopcionDto from "@/stores/dtos/solicitudadopcion.dto";
import { useAutenticacion } from '@/stores/Autentificacion';

const route = useRoute();
const gatosStore = usegatosStore();
const protectorasStore = useprotectorasStore();
const solicitudesStore = useSolicitudesAdopcionStore();
const Autenticacion = useAutenticacion();

const gato = ref<any>(null);
const protectora = ref<any>(null);
const cargando = ref(true);
const solicitudExistente = ref<any>(null);
const mostrarFormulario = computed(() => {
  return Autenticacion.esAutenticado && !solicitudExistente.value;
});

const comentarioUsuario = ref('');

// Usuario logueado dinámico
const idUsuario = computed(() => Autenticacion.usuario?.id_Usuario ?? 0);

// Función para formatear la fecha y hora
function formatearFechaHora(fecha: Date): string {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Reglas de validación
const rulesComentario = [
  (v: string) => !!v && v.trim().length > 0 || 'Este campo es obligatorio'
];

// Comprobar si ya existe una solicitud para este gato
async function comprobarSolicitudExistente() {
  if (!idUsuario.value || !gato.value) return;
  
  try {
    const response = await fetch(`http://localhost:5167/api/SolicitudAdopcion/usuario/${idUsuario.value}/gato/${gato.value.id_Gato}`);
    if (response.ok) {
      solicitudExistente.value = await response.json();
    }
  } catch (error) {
    console.error('Error al comprobar solicitud existente:', error);
  }
}

const obtenerGato = async () => {
  cargando.value = true;
  gato.value = null;
  protectora.value = null;
  solicitudExistente.value = null;

  const id = Number(route.params.id);

  if (gatosStore.gatos.length === 0) {
    await gatosStore.fetchGato();
  }

  gato.value = gatosStore.gatos.find((g) => g.id_Gato === id);

  if (gato.value) {
    if (protectorasStore.protectoras.length === 0) {
      await protectorasStore.fetchProtectora();
    }
    protectora.value = protectorasStore.protectoras.find(
      (p) => p.id_Protectora === gato.value.id_Protectora
    );
    if (Autenticacion.esAutenticado) {
      await comprobarSolicitudExistente();
    }
  }

  cargando.value = false;
};

const solicitarAdopcion = async () => {
  if (!gato.value || !idUsuario.value) {
    alert('Error: Usuario no logueado o gato no encontrado');
    return;
  }

  if (!comentarioUsuario.value.trim()) {
    alert('Por favor, cuéntanos por qué quieres adoptar a ' + gato.value.nombre_Gato);
    return;
  }

  try {
    const solicitud = new SolicitudAdopcionDto(
      0,
      idUsuario.value,
      gato.value.id_Gato,
      new Date(),
      'pendiente',
      comentarioUsuario.value,
      ''
    );
    await solicitudesStore.createSolicitud(solicitud);
    await comprobarSolicitudExistente(); // Recargar la solicitud para mostrar el estado actualizado
    comentarioUsuario.value = '';
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('Error al crear la solicitud de adopción');
    }
    await comprobarSolicitudExistente(); // Recargar por si acaso
  }
};

onMounted(() => {
  obtenerGato();
});

watch(() => route.params.id, obtenerGato);
</script>

<template>
  <v-container>
    <h1 v-if="gato?.nombre_Gato" class="titulo-detalles">Soy {{ gato.nombre_Gato }} ¡Conóceme! 🐾</h1>
    <v-row justify="center">
      <v-col cols="11" md="9" class="ContainerDetallesGatos">
        <DetallesGatoCard v-if="gato" :gato="gato" :protectora="protectora" />
        <v-alert v-else-if="cargando" type="info">Cargando...</v-alert>
        <v-alert v-else type="error">No se encontró el gato.</v-alert>
      </v-col>
    </v-row>

    <!-- Bloque solicitud con estilo limpio -->
    <v-row justify="center" v-if="gato">
      <v-col cols="11" md="9">
        <v-card class="pa-4 mt-6">
          <!-- Si el usuario no está autenticado -->
          <template v-if="!Autenticacion.esAutenticado">
            <v-alert type="info" class="mb-4">
              Para solicitar la adopción de {{ gato.nombre_Gato }}, necesitas iniciar sesión.
            </v-alert>
            <v-btn color="primary" to="/iniciar-sesion">
              Iniciar sesión
            </v-btn>
          </template>

          <!-- Si ya existe una solicitud -->
          <template v-else-if="solicitudExistente">
            <h3>Ya has solicitado adoptar a {{ gato.nombre_Gato }}</h3>
            <v-alert
              :type="solicitudExistente.estado.toLowerCase() === 'pendiente' ? 'warning' : 
                    solicitudExistente.estado.toLowerCase() === 'aceptada' ? 'success' : 'error'"
              class="mt-4"
            >
              <p><strong>Estado de tu solicitud:</strong> 
                <v-chip
                  :color="solicitudExistente.estado.toLowerCase() === 'pendiente' ? 'orange' : 
                         solicitudExistente.estado.toLowerCase() === 'aceptada' ? 'green' : 
                         solicitudExistente.estado.toLowerCase() === 'rechazada' ? 'red' : 'grey'"
                  text-color="white"
                  small
                  class="ml-2"
                >
                  {{ solicitudExistente.estado.charAt(0).toUpperCase() + solicitudExistente.estado.slice(1).toLowerCase() }}
                </v-chip>
              </p>
              <p><strong>Fecha de solicitud:</strong> {{ formatearFechaHora(solicitudExistente.fecha_Solicitud) }}</p>
              <p><strong>Tu comentario:</strong> {{ solicitudExistente.comentario_Usuario }}</p>
              <template v-if="solicitudExistente.comentario_Protectora">
                <p><strong>Respuesta de la protectora:</strong> {{ solicitudExistente.comentario_Protectora }}</p>
              </template>
            </v-alert>
            <v-btn color="primary" to="/solicitudes" class="mt-3">
              Ver todas mis solicitudes
            </v-btn>
          </template>

          <!-- Formulario de nueva solicitud -->
          <template v-else>
            <h3>Solicitar adopción de {{ gato.nombre_Gato }}</h3>
            <v-textarea
              v-model="comentarioUsuario"
              :label="`Cuéntanos por qué quieres adoptar a ${gato.nombre_Gato}`"
              :rules="rulesComentario"
              rows="3"
              auto-grow
              outlined
              dense
              class="mt-2"
            ></v-textarea>

            <v-btn color="primary" class="mt-3" @click="solicitarAdopcion">
              Enviar solicitud de adopción
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.ContainerDetallesGatos {
  display: flex;
  justify-content: center;
  padding: 0;
}

.titulo-detalles {
  margin-bottom: 20px;
  text-align: center;
  color: $color-principal;
}

.v-col-12 {
  flex: 0 0 125%;
  max-width: 125%;
}

:deep(.v-alert.info) {
  background-color: $color-principal !important;
  border-color: $color-principal !important;
  color: white !important;
}

:deep(.v-btn.primary) {
  background-color: $color-principal !important;
  border-color: $color-principal !important;
}

@media (min-width: 1010px) {
  .v-container {
    margin-top: 105px;
  }
}
</style>
