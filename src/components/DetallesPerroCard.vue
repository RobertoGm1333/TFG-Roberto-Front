<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAutenticacion } from "@/stores/Autentificacion";
import { useperrosStore } from "@/stores/perros.ts"
import type PerroDto from "../stores/dtos/perro.dto";
import type ProtectoraDto from "../stores/dtos/protectoras.dto";
</script>

<template>
  <v-card class="CardPerroDetalles">
    <v-img :src="perro.imagen_Perro" cover class="FotoDetallesPerro"></v-img>
    <v-card-title>{{ perro.nombre_Perro }}</v-card-title>
    <v-card-subtitle>{{ perro.raza }} - {{ perro.edad }} años</v-card-subtitle>
    <v-card-text>
      <p><strong>Sexo:</strong> {{ perro.sexo }}</p>
      <p><strong>Protectora:</strong> {{ protectora?.nombre_Protectora || "No disponible" }}</p>
      <p><strong>Descripción:</strong> {{ perro.descripcion_Perro }}</p>
    </v-card-text>
    <p v-if="mensaje" class="perro-card__mensaje">{{ mensaje }}</p>
    <v-card-actions>
      <v-btn color="#FF5500" to="/perro">Volver a perros</v-btn>
      <v-btn color="green" :href="`mailto:${protectora?.email}`" :disabled="!protectora?.email">
        Contactar Protectora
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.CardPerroDetalles {
  width: 100%;
}

.perro-card__mensaje {
  text-align: center;
  color: green;
}

.FotoDetallesPerro {
  max-height: 400px;
}

.v-card-actions {
  flex-direction: column;
}

@media (min-width: 620px) {
  .CardPerroDetalles {
    width: 50%;
  }

  .v-card-actions {
    flex-direction: row;
  }
}
</style>
