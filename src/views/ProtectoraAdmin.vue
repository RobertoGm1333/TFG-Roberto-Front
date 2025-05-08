<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAutenticacion } from '@/stores/Autentificacion'

const authStore = useAutenticacion()
const gatos = ref<any[]>([])
const mostrarDialogo = ref(false)
const idProtectora = ref<number | null>(null)

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

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:5167/api/Protectora/usuario/${authStore.obtenerIdUsuario}`);
    if (!response.ok) throw new Error("No se pudo obtener la protectora");

    const protectora = await response.json();
    idProtectora.value = protectora.id_Protectora;

    await cargarGatos()
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
    id_Protectora: idProtectora.value, // correcto aquí
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
  if (!idProtectora.value) return

  gato.value.id_Protectora = idProtectora.value // forzar ID correcto siempre

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

async function eliminarGato(id: number) {
  try {
    const res = await fetch(`http://localhost:5167/api/Gato/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('Error al eliminar el gato')
    await cargarGatos()
  } catch (err) {
    console.error(err)
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
  
      <v-data-table :headers="headers" :items="gatos" class="elevation-1">
        <template v-slot:item.acciones="{ item }">
          <v-btn color="blue" @click="editarGato(item)">Editar</v-btn>
          <v-btn color="red" @click="eliminarGato(item.id_Gato)">Eliminar</v-btn>
        </template>
      </v-data-table>
  
      <v-dialog v-model="mostrarDialogo" max-width="600px">
        <v-card>
          <v-card-title>{{ gato.id_Gato ? 'Editar Gato' : 'Nuevo Gato' }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="gato.nombre_Gato" label="Nombre del gato" />
            <v-text-field v-model="gato.raza" label="Raza" />
            <v-text-field v-model="gato.edad" label="Edad" type="number" />
            <v-select
              v-model="gato.sexo"
              :items="['Macho', 'Hembra']"
              label="Sexo"
            />
            <v-checkbox v-model="gato.esterilizado" label="Esterilizado" />
            <v-textarea v-model="gato.descripcion_Gato" label="Descripción" />
            <v-text-field v-model="gato.imagen_Gato" label="URL de imagen" />
            <v-checkbox v-model="gato.visible" label="Visible públicamente" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="guardarGato">Guardar</v-btn>
            <v-btn color="grey" @click="cerrarDialogo">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>