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
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-col cols="auto">
        <h1>Gestión de Gatos - Protectora</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="abrirFormulario">Nuevo gato</v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="gatos" class="elevation-1 protectora-admin__tabla">
      <template v-slot:item.acciones="{ item }">
        <div class="botones-control">
          <v-btn color="blue" @click="editarGato(item)">Editar</v-btn>
          <v-btn color="red" @click="pedirConfirmacion(item)">Eliminar</v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Mensaje de confirmación/error -->
    <v-snackbar
      v-model="mostrarMensaje"
      :color="mensajeTipo"
      :timeout="3000"
    >
      {{ mensajeTexto }}
    </v-snackbar>

    <!-- Sección de Solicitudes -->
    <v-row class="mt-8">
      <v-col>
        <h1>Solicitudes de Adopción</h1>
        <v-data-table
          :headers="[
            { title: 'ID', key: 'id_Solicitud' },
            { title: 'Gato', key: 'id_Gato' },
            { title: 'Solicitante', key: 'id_Usuario' },
            { title: 'Estado', key: 'estado' },
            { title: 'Fecha', key: 'fecha_Solicitud' },
            { title: 'Acciones', key: 'actions', sortable: false }
          ]"
          :items="solicitudes"
          class="elevation-1 protectora-admin__tabla mt-4"
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
              small
            >
              {{ item.estado }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="botones-control">
              <v-dialog v-model="item.showDialog" max-width="500">
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="blue"
                    v-bind="props"
                    class="protectora-admin__boton protectora-admin__boton--editar"
                  >
                    Gestionar
                  </v-btn>
                </template>

                <v-card class="protectora-admin__dialogo">
                  <v-card-title class="protectora-admin__dialogo-titulo">Gestionar Solicitud</v-card-title>
                  <v-card-text class="protectora-admin__dialogo-formulario">
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
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="green"
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
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro que quieres eliminar a <strong>{{ gatoAEliminar?.nombre_Gato }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="mostrarConfirmacion = false">Cancelar</v-btn>
          <v-btn color="red" @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

  
<style scoped lang="scss">
.protectora-admin {
  margin: 2rem auto;
  max-width: 1200px;
  padding: 1rem;
  background-color: #121212;
  border-radius: 10px;
  min-height: calc(100vh - 180px); // Ajuste para mantener el footer en la parte inferior
  display: flex;
  flex-direction: column;

  &__titulo {
    font-size: 1.6rem;
    font-weight: bold;
    color: #eeeeee;
    margin-bottom: 1rem;
  }

  &__top-bar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__section {
    margin-bottom: 2rem;
  }

  &__boton-nuevo {
    background-color: #FF5500;
    color: white;
    font-weight: 600;
    border-radius: 6px;
    padding: 0.5rem 1rem;

    &:hover {
      background-color: darken(#FF5500, 10%);
    }
  }

  &__tabla {
    background-color: #E9E9E9;
    border-radius: 8px;
    overflow-x: auto;

    th {
      color: #f5f5f5;
      font-weight: 600;
    }

    td {
      color: #dddddd;
      border-color: #333;
    }

    tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }

  &__boton {
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    margin-right: 0.5rem;

    &--editar {
      background-color: #2680eb;
      color: white;
      &:hover {
        background-color: #3a90f0;
      }
    }

    &--eliminar {
      background-color: #e53935;
      color: white;
      &:hover {
        background-color: #c62828;
      }
    }
  }

  &__dialogo {
    .v-card {
      background-color: #202020;
      color: #eeeeee;
      border-radius: 10px;
    }

    &-titulo {
      font-size: 1.3rem;
      font-weight: bold;
      color: #f5f5f5;
    }

    &-formulario {
      .v-text-field,
      .v-select,
      .v-textarea,
      .v-checkbox {
        background-color: #2a2a2a;
        color: #eeeeee;
        border-radius: 6px;
        margin-bottom: 1rem;
      }

      input,
      textarea {
        color: #eeeeee !important;
      }
    }

    &-acciones {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  }
}

.botones-control {
  display: flex;
  gap: 10px;
  padding-top: 4%;
  padding-bottom: 4%;
}

@media (prefers-color-scheme: dark) {
  .protectora-admin__tabla {
    background-color: #272727;
    color: whitesmoke;
    border: solid #5d5d5d;
    border-color: rgba(93, 93, 93, 0.5);
  }
  .protectora-admin__dialogo {
    background-color: #272727;
    color: whitesmoke;
  }
}

@media (width <= 978px) {
  .v-container {
    padding-left: 5%;
    padding-right: 5%;
  }
  .botones-control {
    flex-wrap: wrap;
  }
}
</style>
