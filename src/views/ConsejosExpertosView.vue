<script setup lang="ts">
import ConsejoCard from '@/components/ConsejoCard.vue'
import { useI18n } from '@/stores/useI18n'

const { t } = useI18n()

const consejos = [
  {
    imagen: '../../Images/consejos/condicion-corporal.png',
    titulo: 'Condicion corporal en gatos',
    descripcion: 'El impacto positivo de una nutrición adecuada está bien establecido en todos los animales. Una alimentación adaptada a la edad y necesidades nutricionales de cada gato, mejora su calidad de vida.',
    ruta: '/condicion-corporal'
  },
  {
    imagen: '/Images/consejos/alimentacion.jpg',
    titulo: 'Guía de alimentación felina',
    descripcion: 'Descubre las claves de una dieta equilibrada para tu gato, incluyendo la frecuencia de alimentación adecuada y los alimentos que debes evitar.'
  },
  {
    imagen: '/Images/consejos/comportamiento.jpg',
    titulo: 'Entendiendo el comportamiento felino',
    descripcion: 'Interpreta el lenguaje corporal de tu gato y aprende a reconocer sus necesidades. Consejos para una mejor comunicación con tu mascota.'
  },
  {
    imagen: '/Images/consejos/salud.jpg',
    titulo: 'Cuidados veterinarios esenciales',
    descripcion: 'Calendario de vacunación, desparasitación y revisiones veterinarias. Aprende a detectar señales de alerta en la salud de tu gato.'
  },
  {
    imagen: '/Images/consejos/juegos.jpg',
    titulo: 'Juegos y ejercicios',
    descripcion: 'Ideas para mantener a tu gato activo y entretenido. Descubre juguetes seguros y actividades que estimularán física y mentalmente a tu felino.'
  },
  {
    imagen: '/Images/consejos/convivencia.jpg',
    titulo: 'Convivencia con otros animales',
    descripcion: 'Consejos prácticos para introducir un nuevo gato en un hogar con otras mascotas. Aprende a gestionar la convivencia de manera armoniosa.'
  }
]
</script>

<template>
  <div class="consejos-expertos-view">
    <div class="consejos-header">
      <h1>{{ t('consejos_expertos') }}</h1>
      <p class="consejos-descripcion">
        Nuestros expertos comparten su conocimiento para ayudarte a brindar la mejor vida posible a tu compañero felino.
      </p>
    </div>

    <div class="consejos-grid">
      <ConsejoCard
        v-for="consejo in consejos"
        :key="consejo.titulo"
        :imagen="consejo.imagen"
        :titulo="consejo.titulo"
        :descripcion="consejo.descripcion"
        :ruta="consejo.ruta"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.consejos-expertos-view {
  padding: $espacio-grande;
  max-width: 1400px;
  margin: 0 auto;
}

.consejos-header {
  text-align: center;
  margin-bottom: $espacio-extra-grande;

  h1 {
    color: $color-principal;
    font-size: 2.5rem;
    margin-bottom: $espacio-mediano;
  }
}

.consejos-descripcion {
  font-family: $fuente-textos;
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.consejos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $espacio-grande;
  padding: $espacio-mediano;
}

@media (prefers-color-scheme: dark) {
  .consejos-descripcion {
    color: #aaa;
  }
}

@media (max-width: 768px) {
  .consejos-expertos-view {
    padding: $espacio-mediano;
  }

  .consejos-header {
    h1 {
      font-size: 2rem;
    }
  }

  .consejos-descripcion {
    font-size: 1.1rem;
  }

  .consejos-grid {
    grid-template-columns: 1fr;
    padding: $espacio-pequeno;
  }
}
</style>

