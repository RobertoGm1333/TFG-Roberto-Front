<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAutenticacion } from '@/stores/Autentificacion';
import { useSolicitudesAdopcionStore } from '@/stores/solicitudesAdopcion'

const authStore = useAutenticacion()
const solicitudesStore = useSolicitudesAdopcionStore()

const gatos = ref<any[]>([])
const mostrarDialogo = ref(false)
const mostrarConfirmacion = ref(false)
const gatoAEliminar = ref<any>(null)
const idProtectora = ref<number | null>(null)

const solicitudes = ref<any[]>([])
const nuevoEstado = ref('')
const comentarioProtectora = ref('')
const mostrarMensaje = ref(false)
const mensajeTexto = ref('')
const mensajeTipo = ref('success')

const gato = ref<any>({
  id_Gato: 0,
  nombre_Gato: '',
  raza: '',
  edad: 0,
  sexo: '',
  esterilizado: false,
  descripcion_Gato: '',
  imagen_Gato: '',
  id_Protectora: null,
  visible: true
})

const formularioGato = ref()

const nombresGatos = ref<Map<number, string>>(new Map())
const nombresUsuarios = ref<Map<number, string>>(new Map())

const headers = [
  { title: 'ID', key: 'id_Gato' },
  { title: 'Nombre', key: 'nombre_Gato' },
  { title: 'Raza', key: 'raza' },
  { title: 'Edad', key: 'edad' },
  { title: 'Sexo', key: 'sexo' },
  { title: 'Esterilizado', key: 'esterilizado' },
  { title: 'Visible', key: 'visible' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

// Reglas de validación
const reglas = {
  estado: [(v: string) => !!v || 'El estado es obligatorio'],
  comentario: [(v: string) => !!v || 'El comentario es obligatorio']
}

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:5167/api/Protectora/usuario/${authStore.obtenerIdUsuario}`);
    if (!response.ok) throw new Error("No se pudo obtener la protectora");

    const protectora = await response.json();
    idProtectora.value = protectora.id_Protectora;

    await cargarGatos()
    await cargarSolicitudes()
  } catch (err) {
    console.error("Error cargando datos de la protectora:", err);
  }
})

async function cargarGatos() {
  if (!idProtectora.value) return

  try {
    const res = await fetch(`http://localhost:5167/api/Gato/protectora/${idProtectora.value}`);
    if (!res.ok) throw new Error("Error al obtener gatos");

    gatos.value = await res.json();
  } catch (err) {
    console.error("Error cargando gatos:", err);
  }
}

async function cargarSolicitudes() {
  if (!idProtectora.value) return

  await solicitudesStore.fetchSolicitudesProtectora(idProtectora.value)
  solicitudes.value = solicitudesStore.solicitudes

  for (const solicitud of solicitudes.value) {
    await cargarDatosGato(solicitud.id_Gato)
    await cargarDatosUsuario(solicitud.id_Usuario)
  }
}

async function cargarDatosGato(idGato: number) {
  try {
    const res = await fetch(`http://localhost:5167/api/Gato/${idGato}`)
    if (!res.ok) throw new Error('Error al obtener el gato')
    const gato = await res.json()
    nombresGatos.value.set(idGato, gato.nombre_Gato)
  } catch (err) {
    console.error('Error cargando datos del gato:', err)
  }
}

async function cargarDatosUsuario(idUsuario: number) {
  try {
    const res = await fetch(`http://localhost:5167/api/Usuario/${idUsuario}`)
    if (!res.ok) throw new Error('Error al obtener el usuario')
    const usuario = await res.json()
    nombresUsuarios.value.set(idUsuario, `${usuario.nombre} ${usuario.apellido}`)
  } catch (err) {
    console.error('Error cargando datos del usuario:', err)
  }
}

async function actualizarEstado(solicitud: any) {
  // Validar campos
  if (!nuevoEstado.value || !comentarioProtectora.value) {
    mensajeTipo.value = 'error'
    mensajeTexto.value = 'Por favor, complete todos los campos'
    mostrarMensaje.value = true
    return
  }

  try {
    await solicitudesStore.updateEstadoSolicitud(solicitud.id_Solicitud, nuevoEstado.value, comentarioProtectora.value, idProtectora.value!)
    mensajeTipo.value = 'success'
    mensajeTexto.value = 'Solicitud editada correctamente'
    mostrarMensaje.value = true
    await cargarSolicitudes()
    nuevoEstado.value = ''
    comentarioProtectora.value = ''
  } catch (err) {
    console.error('Error actualizando estado:', err)
    mensajeTipo.value = 'error'
    mensajeTexto.value = 'Error al actualizar la solicitud'
    mostrarMensaje.value = true
  }
}

function abrirFormulario() {
  gato.value = {
    id_Gato: 0,
    nombre_Gato: '',
    raza: '',
    edad: 0,
    sexo: '',
    esterilizado: false,
    descripcion_Gato: '',
    imagen_Gato: '',
    id_Protectora: idProtectora.value,
    visible: true
  }
  mostrarDialogo.value = true
}

function editarGato(g: any) {
  gato.value = { ...g }
  mostrarDialogo.value = true
}

function cerrarDialogo() {
  mostrarDialogo.value = false
}

async function guardarGato() {
  const { valid } = await formularioGato.value?.validate()
  if (!valid) return

  if (!idProtectora.value) return

  gato.value.id_Protectora = idProtectora.value

  const metodo = gato.value.id_Gato ? 'PUT' : 'POST'
  const url = gato.value.id_Gato
    ? `http://localhost:5167/api/Gato/${gato.value.id_Gato}`
    : 'http://localhost:5167/api/Gato'

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gato.value)
    })

    if (!res.ok) throw new Error('Error al guardar el gato')
    cerrarDialogo()
    await cargarGatos()
  } catch (err) {
    console.error(err)
  }
}

function pedirConfirmacion(g: any) {
  gatoAEliminar.value = g
  mostrarConfirmacion.value = true
}

async function confirmarEliminacion() {
  if (!gatoAEliminar.value) return

  try {
    const res = await fetch(`http://localhost:5167/api/Gato/${gatoAEliminar.value.id_Gato}`, {
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('Error al eliminar el gato')
    mostrarConfirmacion.value = false
    await cargarGatos()
  } catch (err) {
    console.error(err)
  }
}

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'Pendiente':
      return 'orange'
    case 'Aceptada':
      return 'green'
    case 'Rechazada':
      return 'red'
    default:
      return 'grey'
  }
}
</script>


<template>
  <v-container fluid class="protectora-admin pa-0">
    <v-row justify="space-between" align="center" class="mb-4 mx-0">
      <v-col cols="12" sm="auto" class="text-center text-sm-start px-4">
        <h1 class="protectora-admin__titulo">Gestión de Gatos - Protectora</h1>
      </v-col>
      <v-col cols="12" sm="auto" class="text-center text-sm-start mt-4 mt-sm-0 px-4">
        <v-btn color="primary" @click="abrirFormulario" class="protectora-admin__boton">Nuevo gato</v-btn>
      </v-col>
    </v-row>

    <!-- Tabla responsive -->
    <div class="protectora-admin__tabla-container px-4">
      <v-data-table
        :headers="headers"
        :items="gatos"
        class="elevation-1 protectora-admin__tabla"
        :class="{'protectora-admin__tabla--mobile': $vuetify.display.smAndDown}"
      >
        <template v-slot:item.acciones="{ item }">
          <div class="protectora-admin__acciones">
            <v-btn color="primary" @click="editarGato(item)" class="mb-2 mb-sm-0 me-sm-2">
              <v-icon>mdi-pencil</v-icon>
              <span class="d-none d-sm-inline ms-2">Editar</span>
            </v-btn>
            <v-btn color="error" @click="pedirConfirmacion(item)">
              <v-icon>mdi-delete</v-icon>
              <span class="d-none d-sm-inline ms-2">Eliminar</span>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Mensaje de confirmación/error -->
    <v-snackbar
      v-model="mostrarMensaje"
      :color="mensajeTipo"
      :timeout="3000"
    >
      {{ mensajeTexto }}
    </v-snackbar>

    <!-- Sección de Solicitudes -->
    <v-row class="mt-8 mx-0">
      <v-col cols="12" class="px-4">
        <h2 class="protectora-admin__subtitulo">Solicitudes de Adopción</h2>
        <div class="protectora-admin__tabla-container">
          <v-data-table
            :headers="[
              { title: 'ID', key: 'id_Solicitud', align: 'start' },
              { title: 'Gato', key: 'id_Gato' },
              { title: 'Solicitante', key: 'id_Usuario' },
              { title: 'Estado', key: 'estado' },
              { title: 'Fecha', key: 'fecha_Solicitud' },
              { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
            ]"
            :items="solicitudes"
            class="elevation-1 protectora-admin__tabla mt-4"
            :class="{'protectora-admin__tabla--mobile': $vuetify.display.smAndDown}"
          >
            <template v-slot:item.id_Gato="{ item }">
              {{ nombresGatos.get(item.id_Gato) || 'Cargando...' }}
            </template>

            <template v-slot:item.id_Usuario="{ item }">
              {{ nombresUsuarios.get(item.id_Usuario) || 'Cargando...' }}
            </template>

            <template v-slot:item.fecha_Solicitud="{ item }">
              {{ new Date(item.fecha_Solicitud).toLocaleDateString() }}
            </template>
            
            <template v-slot:item.estado="{ item }">
              <v-chip
                :color="getEstadoColor(item.estado)"
                text-color="white"
                size="small"
              >
                {{ item.estado }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="protectora-admin__acciones">
                <v-dialog v-model="item.showDialog" max-width="500px">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      v-bind="props"
                      class="protectora-admin__boton"
                    >
                      <v-icon>mdi-cog</v-icon>
                      <span class="d-none d-sm-inline ms-2">Gestionar</span>
                    </v-btn>
                  </template>

                  <v-card class="protectora-admin__dialogo">
                    <v-card-title class="protectora-admin__dialogo-titulo">
                      Gestionar Solicitud
                    </v-card-title>
                    <v-card-text class="protectora-admin__dialogo-contenido">
                      <v-select
                        v-model="nuevoEstado"
                        :items="['Pendiente', 'Aceptada', 'Rechazada']"
                        label="Nuevo Estado"
                        :rules="reglas.estado"
                        class="mb-4"
                        required
                      ></v-select>
                      
                      <v-textarea
                        v-model="comentarioProtectora"
                        label="Comentario"
                        rows="3"
                        :rules="reglas.comentario"
                        class="mb-4"
                        required
                      ></v-textarea>
                    </v-card-text>
                    
                    <v-card-actions class="protectora-admin__dialogo-acciones">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="grey"
                        @click="item.showDialog = false"
                        class="me-2"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="success"
                        @click="() => {
                          actualizarEstado(item);
                          if (nuevoEstado && comentarioProtectora) {
                            item.showDialog = false;
                          }
                        }"
                        :disabled="!nuevoEstado || !comentarioProtectora"
                      >
                        Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>

    <!-- Formulario de creación/edición -->
    <v-dialog v-model="mostrarDialogo" max-width="600px">
      <v-card class="protectora-admin__dialogo">
        <v-card-title>{{ gato.id_Gato ? 'Editar Gato' : 'Nuevo Gato' }}</v-card-title>
        <v-card-text>
          <v-form ref="formularioGato">
            <v-text-field
              v-model="gato.nombre_Gato"
              label="Nombre del gato"
              :rules="[v => !!v || 'Campo obligatorio']"
            />
            <v-text-field
              v-model="gato.raza"
              label="Raza"
              :rules="[v => !!v || 'Campo obligatorio']"
            />
            <v-text-field
              v-model="gato.edad"
              label="Edad"
              type="number"
              :rules="[v => v > 0 || 'Debe ser mayor que 0']"
            />
            <v-select
              v-model="gato.sexo"
              :items="['Macho', 'Hembra']"
              label="Sexo"
              :rules="[v => !!v || 'Campo obligatorio']"
            />
            <v-checkbox v-model="gato.esterilizado" label="Esterilizado" />
            <v-textarea
              v-model="gato.descripcion_Gato"
              label="Descripción"
              :rules="[v => !!v || 'Campo obligatorio']"
            />
            <v-text-field
              v-model="gato.imagen_Gato"
              label="URL de imagen"
              :rules="[v => !!v || 'Campo obligatorio']"
            />
            <v-checkbox v-model="gato.visible" label="Visible públicamente" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="green" @click="guardarGato">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación para eliminar -->
    <v-dialog v-model="mostrarConfirmacion" max-width="500px">
      <v-card class="protectora-admin__dialogo">
        <v-card-title class="protectora-admin__dialogo-titulo">
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="py-4">
          ¿Estás seguro que quieres eliminar a <strong>{{ gatoAEliminar?.nombre_Gato }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="mostrarConfirmacion = false" class="me-2">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

  
<style scoped lang="scss">
.protectora-admin {
  width: 100%;
  margin: 0 auto;
  margin-bottom: $espacio-grande;

  &__titulo {
    font-size: 1.25rem;
    color: $color-principal;
    margin: $espacio-mediano 0;
    text-align: center;

    @media (min-width: 600px) {
      font-size: 2rem;
      text-align: left;
      margin-bottom: $espacio-grande;
    }
  }

  &__subtitulo {
    font-size: 1.1rem;
    color: $color-principal;
    margin: $espacio-mediano 0;
    text-align: center;

    @media (min-width: 600px) {
      font-size: 1.8rem;
      text-align: left;
    }
  }

  &__tabla-container {
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    margin: 0;
    padding: 0;

    :deep(.v-data-table) {
      width: 100%;
      font-size: 0.875rem;
      border-radius: 0;

      @media (min-width: 600px) {
        font-size: 1rem;
        border-radius: $espacio-pequeno;
      }
    }

    :deep(.v-data-table-header) {
      th {
        padding: 12px 16px !important;
        font-size: 0.875rem !important;
        height: 48px !important;
        background-color: $color-blanco;
      }
    }

    :deep(.v-data-table__wrapper) {
      td {
        padding: 12px 16px !important;
        font-size: 0.875rem !important;
        height: 48px !important;
      }
    }
  }

  &__tabla {
    width: 100%;
    background-color: $color-blanco;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.12);

    @media (min-width: 600px) {
      box-shadow: $sombra-contenedor;
    }

    &--mobile {
      :deep(.v-data-table__wrapper) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        width: 100%;
        margin: 0;
        padding: 0;
        
        table {
          width: 100%;
          min-width: 500px;
        }
      }

      :deep(th), :deep(td) {
        white-space: nowrap;
        min-width: 100px;
        padding: 12px 16px !important;
      }

      :deep(td:first-child), :deep(th:first-child) {
        padding-left: 16px !important;
      }

      :deep(td:last-child), :deep(th:last-child) {
        padding-right: 16px !important;
      }
    }
  }

  &__acciones {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    padding: 0;

    .v-btn {
      min-width: 40px !important;
      padding: 0 12px !important;
      height: 36px !important;

      @media (min-width: 600px) {
        min-width: 64px !important;
        padding: 0 16px !important;
      }
    }
  }

  &__boton {
    width: auto;
    min-width: 120px !important;
    height: 36px !important;
    font-size: 0.875rem !important;

    @media (min-width: 600px) {
      height: 40px !important;
      font-size: 1rem !important;
    }
  }

  &__dialogo {
    margin: 8px;
    width: auto;
    max-height: 90vh;
    overflow-y: auto;

    @media (min-width: 600px) {
      margin: 0;
    }

    &-titulo {
      background-color: $color-principal;
      color: $color-blanco;
      padding: 12px 16px;
      font-size: 1.1rem;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    &-contenido {
      padding: 16px 12px;

      :deep(.v-input) {
        margin-bottom: 12px;
      }

      :deep(.v-text-field) {
        font-size: 0.875rem;
      }

      :deep(.v-label) {
        font-size: 0.875rem;
      }
    }

    &-acciones {
      padding: 12px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }

  @media (min-width: 960px) {
    max-width: 1200px;
    padding: $espacio-grande;
    margin-top: 95px;
  }
}

@media (prefers-color-scheme: dark) {
  .protectora-admin {
    &__tabla {
      background-color: #272727;
      color: $color-blanco;
    }

    &__dialogo {
      background-color: #272727;
      color: $color-blanco;

      :deep(.v-text-field),
      :deep(.v-select),
      :deep(.v-textarea) {
        color: $color-blanco;
      }
    }
  }
}
</style>
