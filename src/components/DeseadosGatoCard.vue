<script setup lang="ts">
import { defineProps } from 'vue';
import { ref } from 'vue';
import { useI18n } from '@/stores/useI18n';

const { t } = useI18n();
const props = defineProps({
  gato: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <v-card class="gato-card" max-width="344">
    <v-card @click="$router.push(`/detalles-gato/${gato.id_Gato}`)">
      <v-img class="gato-card__imagen" :src="gato.imagen_Gato" height="200px"></v-img>
      <v-card-title>{{ gato.nombre_Gato }}</v-card-title>
      <v-card-subtitle>{{ gato.raza }}</v-card-subtitle>
      <v-card-text>
        <div><strong>{{ t('sexo') }}:</strong> {{ gato.sexo }}</div>
        <div><strong>{{ t('edad') }}:</strong> {{ gato.edad }} {{ t('años') }}</div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style lang="scss" scoped>
.gato-card__imagen {
  :deep(.v-img__img--contain) {
    object-fit: cover;
  }
}

</style>