<script setup lang="ts">
import type ProtectoraDto from '@/stores/dtos/protectoras.dto';

const props = defineProps<{
  protectora: ProtectoraDto
}>();
</script>

<template>
  <v-card class="protectora-card-details">
    <div class="image-container">
      <v-img 
        :src="protectora.imagen_Protectora" 
        class="protectora-image"
        :height="250"
      ></v-img>
    </div>
    <v-card-title>{{ protectora.nombre_Protectora }}</v-card-title>
    <v-card-text>
      <div class="info-section">
        <p><strong>Dirección:</strong> {{ protectora.direccion }}</p>
        <p><strong>Teléfono:</strong> {{ protectora.telefono_Protectora }}</p>
        <p><strong>Correo:</strong> {{ protectora.correo_Protectora }}</p>
        <p><strong>Página Web:</strong> 
          <a :href="protectora.pagina_Web" target="_blank" rel="noopener noreferrer">
            {{ protectora.pagina_Web }}
          </a>
        </p>
      </div>

      <div class="map-section">
        <h3>Ubicación</h3>
        <div class="map-container">
          <iframe
            :src="protectora.ubicacion"
            class="google-map"
            style="border:0;"
            allowfullscreen="true"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div class="description-section">
        <h3>Sobre nosotros</h3>
        <p>{{ protectora.descripcion_Protectora }}</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="#FF5500" to="/protectoras">Volver a protectoras</v-btn>
      <v-btn color="green" :href="`mailto:${protectora.correo_Protectora}`">
        Contactar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.protectora-card-details {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.image-container {
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}

.protectora-image {
  max-height: 250px;
  width: auto;
  background-color: transparent;

  :deep(.v-img__img) {
    object-fit: inherit;
  }
}

.info-section {
  margin: $espacio-mediano 0;
  
  p {
    margin-bottom: $espacio-pequeno;
  }
}

.map-section {
  margin: $espacio-mediano 0;

  h3 {
    color: $color-principal;
    margin-bottom: $espacio-pequeno;
  }
}

.map-container {
  position: relative;
  width: 100%;
  padding-bottom: 45%;
  height: 0;
  overflow: hidden;
  border-radius: $espacio-pequeno;
  box-shadow: $sombra-contenedor;
}

.google-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.description-section {
  margin-top: $espacio-mediano;
  
  h3 {
    color: $color-principal;
    margin-bottom: $espacio-pequeno;
  }
  
  p {
    line-height: 1.5;
    text-align: justify;
  }
}

.v-card-actions {
  padding: $espacio-mediano;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $espacio-pequeno;
}

// Tablet
@media (min-width: 600px) {
  .map-container {
    padding-bottom: 40%;
  }

  .v-card-actions {
    flex-wrap: nowrap;
  }
}

// Desktop
@media (min-width: 960px) {
  .protectora-card-details {
    padding: $espacio-mediano;
    width: 50%;
  }

  .map-container {
    padding-bottom: 35%;
  }
}
</style> 