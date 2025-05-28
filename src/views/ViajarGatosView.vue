<template>
  <div class="viajar-gatos-view">
    <!-- Banner section -->
    <div class="banner" :style="{ backgroundImage: 'url(../../Images/consejos/background-banner.png)' }">
      <h1>Consejos para viajar con gatos</h1>
    </div>

    <!-- Content section -->
    <div class="content">
      <div class="content-container">
        <img 
          src="../../Images/consejos/viaje-gato.png" 
          alt="Viajar con gatos" 
          class="main-image" 
          @click="showZoomDialog = true"
        />

        <!-- Dialog para imagen ampliada -->
        <v-dialog
          v-model="showZoomDialog"
          max-width="90vw"
          max-height="90vh"
          :persistent="false"
          :scrim="true"
          @update:model-value="closeDialog"
        >
          <div class="zoom-overlay" @click="closeDialog">
            <div class="zoom-container" @click.stop>
              <v-btn
                icon
                @click="closeDialog"
                class="close-button"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <div 
                class="image-wrapper"
                @mousedown="startDrag"
                @mousemove="doDrag"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
                @click="handleImageClick"
              >
                <img 
                  src="../../Images/consejos/viaje-gato.png" 
                  alt="Viajar con gatos" 
                  class="zoomed-image"
                  :class="{ 
                    'can-zoom': !isZoomedIn,
                    'is-dragging': isDragging
                  }"
                  :style="{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    cursor: isZoomedIn ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                  }"
                  @dragstart.prevent
                />
              </div>
            </div>
          </div>
        </v-dialog>
        
        <div class="text-content">
          <section class="content-section">
            <p>
              Viajar con un gato puede ser una experiencia enriquecedora tanto para el dueño como para la mascota si se planifica adecuadamente. La clave está en la preparación y en conocer las necesidades específicas de nuestro felino durante el viaje.
            </p>
          </section>

          <section class="content-section">
            <p>
              Los gatos son animales territoriales y los cambios en su entorno pueden causarles estrés. Sin embargo, con la preparación adecuada y siguiendo algunas pautas básicas, podemos hacer que el viaje sea una experiencia positiva.
            </p>
          </section>

          <section class="content-section">
            <p>Antes del viaje, es importante:</p>
            <ul>
              <li>Visitar al veterinario para asegurarse de que el gato está en buen estado de salud y tiene todas sus vacunas al día.</li>
              <li>Preparar un transportín adecuado y acostumbrar al gato a él semanas antes del viaje.</li>
              <li>Llevar la documentación necesaria: cartilla de vacunación, microchip y pasaporte si es necesario.</li>
              <li>Preparar un kit de viaje con sus artículos esenciales: comida, agua, arena, juguetes familiares y medicamentos si los necesita.</li>
            </ul>
          </section>

          <section class="content-section">
            <p>Durante el transporte:</p>
            <ul>
              <li>Mantener el transportín seguro y estable durante el viaje.</li>
              <li>Evitar alimentar al gato justo antes del viaje para prevenir el mareo.</li>
              <li>Hacer paradas cada 2-3 horas en viajes largos para ofrecer agua y acceso al arenero.</li>
              <li>Mantener una temperatura adecuada y evitar la exposición directa al sol.</li>
            </ul>
          </section>

          <section class="content-section">
            <p>En el destino:</p>
            <ul>
              <li>Preparar una habitación tranquila donde el gato pueda adaptarse gradualmente al nuevo entorno.</li>
              <li>Mantener sus rutinas habituales de alimentación y juego en la medida de lo posible.</li>
              <li>Proporcionar lugares elevados y escondites donde pueda sentirse seguro.</li>
            </ul>
          </section>

          <section class="content-section">
            <p>
              Recuerda que cada gato es único y algunos pueden adaptarse mejor que otros a los viajes. Observa el comportamiento de tu gato y ajusta tus planes según sus necesidades específicas. Con paciencia y preparación, viajar con tu gato puede ser una experiencia positiva para ambos.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showZoomDialog = ref(false)
const isZoomedIn = ref(false)
const transform = ref({ x: 0, y: 0, scale: 1 })
const isDragging = ref(false)
const startPosition = ref({ x: 0, y: 0 })
const hasMoved = ref(false)

const handleImageClick = (event: MouseEvent) => {
  if (hasMoved.value) {
    hasMoved.value = false
    return
  }

  if (!isZoomedIn.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const centerX = (x / rect.width) * 100
    const centerY = (y / rect.height) * 100
    
    transform.value = {
      x: (50 - centerX) * 1.5,
      y: (50 - centerY) * 1.5,
      scale: 2
    }
    isZoomedIn.value = true
  } else {
    resetZoom()
  }
}

const startDrag = (event: MouseEvent) => {
  if (isZoomedIn.value && event.buttons === 1) {
    isDragging.value = true
    hasMoved.value = false
    startPosition.value = {
      x: event.clientX - transform.value.x,
      y: event.clientY - transform.value.y
    }
    event.preventDefault()
  }
}

const doDrag = (event: MouseEvent) => {
  if (isDragging.value && isZoomedIn.value && event.buttons === 1) {
    const deltaX = Math.abs(event.clientX - (startPosition.value.x + transform.value.x))
    const deltaY = Math.abs(event.clientY - (startPosition.value.y + transform.value.y))
    
    if (deltaX > 5 || deltaY > 5) {
      hasMoved.value = true
    }

    // Obtener el contenedor y la imagen
    const container = event.currentTarget as HTMLElement
    const image = container.querySelector('.zoomed-image') as HTMLElement

    if (container && image) {
      // Calcular los límites basados en el tamaño de la imagen y el zoom
      const imageRect = image.getBoundingClientRect()
      const maxX = (imageRect.width * (transform.value.scale - 1)) / 2
      const maxY = (imageRect.height * (transform.value.scale - 1)) / 2

      // Calcular la nueva posición limitada
      const newX = event.clientX - startPosition.value.x
      const newY = event.clientY - startPosition.value.y

      transform.value = {
        ...transform.value,
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY)
      }
    }

    event.preventDefault()
  } else if (isDragging.value) {
    stopDrag()
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const resetZoom = () => {
  transform.value = { x: 0, y: 0, scale: 1 }
  isZoomedIn.value = false
  isDragging.value = false
  hasMoved.value = false
}

const closeDialog = () => {
  showZoomDialog.value = false
  resetZoom()
}
</script>

<style scoped lang="scss">
.viajar-gatos-view {
  width: 100%;
  min-height: 100vh;
}

.banner {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  h1 {
    color: white;
    font-size: 3rem;
    text-align: center;
    position: relative;
    z-index: 1;
    padding: 0 20px;
    font-weight: bold;
  }
}

.content {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.content-container {
  width: 100%;
  max-width: none;
  margin: 0 auto;
}

.main-image {
  width: 100%;
  max-width: none;
  height: 400px;
  margin: 0 0 40px;
  display: block;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
}

.text-content {
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 0 20px;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.8;
}

.content-section {
  margin-bottom: 2.5rem;
  max-width: none;

  h2 {
    font-size: 1.4rem;
    color: #444;
    margin-bottom: 1.2rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: #666;
  }

  ul {
    list-style-type: disc;
    margin-left: 2.5rem;
    margin-bottom: 1.5rem;
    color: #666;

    li {
      margin-bottom: 0.8rem;
      line-height: 1.8;
      padding-left: 0.5rem;
    }
  }
}

.zoom-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.zoom-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none;
}

.zoomed-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  width: auto;
  height: auto;
  transition: transform 0.3s ease;
  transform-origin: center;
  user-select: none;
  -webkit-user-drag: none;
  
  &.can-zoom:hover {
    cursor: zoom-in;
  }

  &.is-dragging {
    transition: none;
    cursor: grabbing !important;
  }
}

.close-button {
  position: absolute;
  top: -40px;
  right: -40px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .banner {
    height: 200px;

    h1 {
      font-size: 2rem;
    }
  }

  .content {
    padding: 20px 0;
  }

  .text-content {
    padding: 0 15px;
  }

  .content-section {
    h2 {
      font-size: 1.3rem;
    }

    p {
      font-size: 1rem;
    }

    ul li {
      font-size: 1rem;
    }
  }

  .main-image {
    height: 250px;
  }

  .close-button {
    top: 8px;
    right: 8px;
  }

  .zoom-overlay {
    padding: 10px;
  }
}

@media (prefers-color-scheme: dark) {
  .content {
    background-color: #1a1a1a;
  }

  .content-section {
    p, ul, li {
      color: #b0b0b0;
    }

    h2 {
      color: #d0d0d0;
    }
  }
}
</style>