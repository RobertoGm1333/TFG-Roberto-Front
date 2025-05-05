<script setup lang="ts">
import { defineProps } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  perro: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <v-card class="perro-card" max-width="344">
    <v-card @click="$router.push(`/detalles-perro/${perro.id_Perro}`)">
      <v-img class="perro-card__imagen" :src="perro.imagen_Perro" height="200px"></v-img>
      <v-card-title>{{ perro.nombre_Perro }}</v-card-title>
      <v-card-subtitle>{{ perro.raza }}</v-card-subtitle>
      <v-card-text>
        <div><strong>Sexo:</strong> {{ perro.sexo }}</div>
        <div><strong>Edad:</strong> {{ perro.edad }} años</div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style lang="scss" scoped>
.v-card {
  font-family: $fuente-textos;
}

.perro-card__imagen {
  :deep(.v-img__img--contain) {
    object-fit: cover;
  }
}

.perro-card__mensaje {
  text-align: center;
  color: green;
  margin-top: $espacio-mediano;
}

</style>