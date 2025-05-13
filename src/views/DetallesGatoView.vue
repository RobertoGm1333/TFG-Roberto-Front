<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import DetallesGatoCard from "@/components/DetallesGatoCard.vue";
import FormularioAdopcion from "@/components/FormularioAdopcion.vue";
import { usegatosStore } from "@/stores/gatos";
import { useprotectorasStore } from "@/stores/protectoras";
import { useSolicitudesAdopcionStore } from "@/stores/solicitudesAdopcion";
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
const dialogoFormulario = ref(false);

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

const handleSolicitudSuccess = async () => {
  dialogoFormulario.value = false;
  await comprobarSolicitudExistente();
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
              <template v-if="solicitudExistente.comentario_Protectora">
                <p><strong>Respuesta de la protectora:</strong> {{ solicitudExistente.comentario_Protectora }}</p>
              </template>
            </v-alert>
            <v-btn color="primary" to="/solicitudes" class="mt-3">
              Ver todas mis solicitudes
            </v-btn>
          </template>

          <!-- Botón para mostrar el formulario -->
          <template v-else>
            <div class="text-center">
              <v-btn
                color="primary"
                size="large"
                @click="dialogoFormulario = true"
                class="mb-4"
              >
                Rellenar solicitud de adopción
              </v-btn>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo del formulario -->
    <v-dialog
      v-model="dialogoFormulario"
      max-width="800px"
      persistent
    >
      <v-card class="formulario-dialog">
        <v-card-text class="pa-0">
          <div class="formulario-container">
            <FormularioAdopcion
              v-if="dialogoFormulario"
              :idGato="gato?.id_Gato"
              :nombreGato="gato?.nombre_Gato"
              @success="handleSolicitudSuccess"
              @cancel="dialogoFormulario = false"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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

.formulario-dialog {
  display: flex;
  flex-direction: column;
  height: 90vh;
  margin: 0;
  
  :deep(.v-card) {
    border-radius: 0;
    box-shadow: none;
  }

  :deep(.v-card-text) {
    height: 100%;
    padding: 0;
  }
}

.formulario-container {
  height: 100%;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $color-principal;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: darken($color-principal, 10%);
  }
}

@media (max-width: 600px) {
  .formulario-dialog {
    height: 100vh;
    margin: 0;
  }
}

@media (min-width: 1010px) {
  .v-container {
    margin-top: 105px;
  }
}
</style>
