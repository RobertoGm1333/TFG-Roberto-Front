<script setup lang="ts">
import ConsejoCard from '@/components/ConsejoCard.vue'
import { useI18n } from '@/stores/useI18n'

const { t } = useI18n()

const consejos = [
  {
    imagen: '../../Images/consejos/condicion-corporal.png',
    titulo: t('consejo_condicion_titulo'),
    descripcion: t('consejo_condicion_descripcion'),
    ruta: '/condicion-corporal'
  },
  {
    imagen: '../../Images/consejos/viaje-gato.png',
    titulo: t('consejo_viaje_titulo'),
    descripcion: t('consejo_viaje_descripcion'),
    ruta: '/Viajar-Gatos'
  },
  {
    imagen: '/Images/consejos/comportamiento.jpg',
    titulo: t('consejo_comportamiento_titulo'),
    descripcion: t('consejo_comportamiento_descripcion')
  },
  {
    imagen: '/Images/consejos/salud.jpg',
    titulo: t('consejo_salud_titulo'),
    descripcion: t('consejo_salud_descripcion')
  },
  {
    imagen: '/Images/consejos/juegos.jpg',
    titulo: t('consejo_juegos_titulo'),
    descripcion: t('consejo_juegos_descripcion')
  },
  {
    imagen: '/Images/consejos/convivencia.jpg',
    titulo: t('consejo_convivencia_titulo'),
    descripcion: t('consejo_convivencia_descripcion')
  }
]
</script>

<template>
  <div class="consejos-expertos-view">
    <div class="consejos-header">
      <h1>{{ t('consejos_expertos') }}</h1>
      <p class="consejos-descripcion">
        {{ t('consejos_descripcion') }}
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

