<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import DetallesPerroCard from "@/components/DetallesPerroCard.vue";
import { useperrosStore } from "@/stores/perros";
import { useprotectorasStore } from "@/stores/protectoras";

const route = useRoute();
const perrosStore = useperrosStore();
const protectorasStore = useprotectorasStore();

const perro = ref();
const protectora = ref();
const cargando = ref(true);

const obtenerPerro = async () => {
  const id = Number(route.params.id);

  if (perrosStore.perros.length === 0) {
    await perrosStore.fetchPerro();
  }

  perro.value = perrosStore.perros.find((g) => g.id_Perro === id);

  if (perro.value) {
    if (protectorasStore.protectoras.length === 0) {
      await protectorasStore.fetchProtectora();
    }
    protectora.value = protectorasStore.protectoras.find(
      (p) => p.id_Protectora === perro.value.id_Protectora
    );
  }

  cargando.value = false;
};

onMounted(() => {
  obtenerPerro();
});

watch(() => route.params.id, obtenerPerro);
</script>

<template>
  <v-container>
    <h1 v-if="perro" class="titulo-detalles">Soy {{ perro.nombre_Perro }} ¡Conóceme! 🐾</h1>
    <v-row justify="center">
      <v-col cols="11" md="9" class="ContainerDetallesPerros">
        <DetallesPerroCard v-if="perro" :perro="perro" :protectora="protectora" />
        <v-alert v-else-if="cargando" type="info">Cargando...</v-alert>
        <v-alert v-else type="error">No se encontró el perro.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.ContainerDetallesPerros {
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

@media (min-width: 1010px) {
  .v-container {
    margin-top: 105px;
  }
}
</style>
