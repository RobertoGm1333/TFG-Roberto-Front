<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import Footer from '@/components/Footer.vue';
import { onMounted } from 'vue';

// Creamos un div para las huellas en el body al montar la aplicación
onMounted(() => {
  // Eliminar si ya existe
  const existingPawContainer = document.getElementById('paw-prints-container');
  if (existingPawContainer) {
    document.body.removeChild(existingPawContainer);
  }
  
  // Crear contenedor de huellas
  const pawContainer = document.createElement('div');
  pawContainer.id = 'paw-prints-container';
  
  // Crear las huellas individuales - de arriba izquierda a abajo derecha
  const pawPositions = [
    { left: '5%', top: '5%', rotate: '-30deg' },
    { left: '20%', top: '20%', rotate: '-30deg' },
    { left: '35%', top: '35%', rotate: '-30deg' },
    { left: '50%', top: '50%', rotate: '-30deg' },
    { left: '65%', top: '65%', rotate: '-30deg' },
    { left: '80%', top: '80%', rotate: '-30deg' },
    { left: '20%', top: '35%', rotate: '-30deg' },
    { left: '65%', top: '35%', rotate: '-30deg' },
  ];
  
  pawPositions.forEach((position) => {
    const pawElement = document.createElement('div');
    pawElement.className = 'paw-print';
    pawElement.style.left = position.left;
    pawElement.style.top = position.top;
    pawElement.style.transform = `rotate(${position.rotate})`;
    pawContainer.appendChild(pawElement);
  });
  
  // Añadir al body antes que cualquier otro elemento
  if (document.body.firstChild) {
    document.body.insertBefore(pawContainer, document.body.firstChild);
  } else {
    document.body.appendChild(pawContainer);
  }
});
</script>

<template>
  <div class="app-container">
    <Header />

    <RouterView />

    <Footer />
  </div>
</template>

<style>
/* Estilos globales para asegurar que el contenido esté por encima de las huellas */
body {
  position: relative;
}

#paw-prints-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -99999;
  pointer-events: none;
  overflow: hidden;
}

.paw-print {
  position: absolute;
  width: 90px;
  height: 90px;
  background-image: url('/Images/logos/Huella.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.2;
}

/* Aplicar z-index a todos los elementos directos del body excepto el contenedor de huellas */
body > *:not(#paw-prints-container) {
  position: relative;
  z-index: 1;
}
</style>

<style scoped lang="scss">
.app-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  z-index: 2;
}

.v-container {
  font-family: $fuente-textos;
  position: relative;
}

@media (min-width: 1010px) {
  .v-container {
    margin-top: 105px;
  }
}
</style> 