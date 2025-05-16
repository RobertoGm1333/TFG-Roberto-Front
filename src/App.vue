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
  
  // Crear las huellas en sets de 2 en 2, en diagonal, con más separación horizontal y ahora más separación vertical
  const pawPositions = [
    { left: '20%', top: '8%', rotate: '-45deg' },
    { left: '35%', top: '12%', rotate: '-45deg' },

    { left: '35%', top: '36%', rotate: '-45deg' },
    { left: '50%', top: '40%', rotate: '-45deg' },

    { left: '50%', top: '64%', rotate: '-45deg' },
    { left: '65%', top: '68%', rotate: '-45deg' },

    { left: '65%', top: '92%', rotate: '-45deg' },
    { left: '80%', top: '96%', rotate: '-45deg' },
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
  width: 150px;
  height: 150px;
  background-image: url('/Images/logos/Huella.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.1;
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