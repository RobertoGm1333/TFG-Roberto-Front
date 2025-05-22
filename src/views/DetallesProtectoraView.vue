<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useprotectorasStore } from '@/stores/protectoras';
import DetallesProtectoraCard from "@/components/DetallesProtectoraCard.vue";

const route = useRoute();
const store = useprotectorasStore();
const cargando = ref(true);

onMounted(async () => {
  try {
    const protectoraId = Number(route.params.id);
    await store.fetchProtectoraById(protectoraId);
  } catch (error) {
    console.error('Error al cargar la protectora:', error);
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <v-container>
    <h1 v-if="store.currentProtectora" class="titulo-detalles">
      {{ store.currentProtectora.nombre_Protectora }}
    </h1>
    <v-row justify="center">
      <v-col cols="11" md="9" class="container-detalles-protectora">
        <DetallesProtectoraCard 
          v-if="store.currentProtectora" 
          :protectora="store.currentProtectora" 
        />
        <v-alert v-else-if="cargando" type="info" class="ma-4">Cargando...</v-alert>
        <v-alert v-else type="error" class="ma-4">No se encontró la protectora.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.container-detalles-protectora {
  display: flex;
  justify-content: center;
  padding: 0;
  max-width: 100%;
}

.titulo-detalles {
  margin: $espacio-grande 0;
  text-align: center;
  color: $color-principal;
  font-size: 1.5rem;

  @media (min-width: 600px) {
    font-size: 2rem;
  }
}

:deep(.v-alert.info) {
  background-color: $color-principal !important;
  border-color: $color-principal !important;
  color: white !important;
}

.v-container {
  padding-top: $espacio-grande;
  min-height: 100vh;
  
  @media (min-width: 600px) {
    padding-top: calc($espacio-grande * 2);
  }

  @media (min-width: 1010px) {
    margin-top: 95px;
    padding-top: $espacio-grande;
  }
}

// Ajustes para modo oscuro
@media (prefers-color-scheme: dark) {
  .titulo-detalles {
    color: lighten($color-principal, 10%);
  }
}
</style> 