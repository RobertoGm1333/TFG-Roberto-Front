<script setup lang="ts">
import { useperrosStore } from '@/stores/perros'
import PerroCard from '@/components/PerroCard.vue'
import FiltrosPerro from '@/components/FiltrosPerro.vue'
import { computed, ref } from 'vue'

const store = useperrosStore()

store.fetchPerro()

const edadMin = ref(1)
const edadMax = ref(15)
const razaSeleccionada = ref('')

// Función para actualizar los filtros desde el componente hijo
const actualizarFiltros = (filtros) => {
  edadMin.value = filtros.edadMin
  edadMax.value = filtros.edadMax
  razaSeleccionada.value = filtros.razaSeleccionada
}

// Perros filtrados como propiedad computada
const perrosFiltrados = computed(() => {
  return store.perros.filter(perro => {
    // Filtrar por edad
    const edadEnRango = perro.edad >= edadMin.value && perro.edad <= edadMax.value
    
    // Filtrar por raza (si hay una seleccionada)
    const razaCoincide = razaSeleccionada.value === '' || perro.raza === razaSeleccionada.value
    
    return edadEnRango && razaCoincide
  })
})
</script>

<template>
  <v-container fluid>
    <!-- Componente de filtros desplegable horizontal -->
    <v-row>
      <v-col cols="12">
        <FiltrosPerro @actualizar-filtros="actualizarFiltros" />
      </v-col>
    </v-row>
    
    <!-- Contenido principal con los perros filtrados -->
    <v-row class="justify-center">
      <!-- Mensaje si no hay perros que coincidan con los filtros -->
      <v-col v-if="perrosFiltrados.length === 0" cols="12" class="NoFiltroContenedor">
        <v-alert
          text="Todavía no tenemos perros que cumplan estas condiciones."
          class="NoFiltro"
        ></v-alert>
      </v-col>
      
      <!-- Mostrar los perros filtrados -->
      <v-col v-for="perro in perrosFiltrados" :key="perro.id_Perro" cols="12" sm="6" md="4" lg="3">
        <PerroCard :perro="perro" style="object-fit: cover;"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.v-row + .v-row {
  margin-top: 8px;
}

.NoFiltroContenedor {
  display: flex;
  justify-content: center;
}

.NoFiltro {
  background-color: $color-principal;
  max-width: 500px;
  display: flex;
  justify-content: center;
  color:$color-blanco;
}

:deep(.v-btn.primary),
:deep(.v-alert.info) {
  background-color: $color-principal !important;
  border-color: $color-principal !important;
}

</style>