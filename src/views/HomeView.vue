<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/stores/useI18n'

const { t } = useI18n()
</script>

<template>
  <div class="titulo">
    <h1 class="logo-container">
      AdoptArag
      <svg class="logo-svg" width="40" height="40" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" fill="none">
        <circle cx="100" cy="120" r="40" fill="#FF5500" stroke="#3B2F2F" stroke-width="5"/>
        <circle cx="60" cy="70" r="20" fill="#FF5500" stroke="#3B2F2F" stroke-width="4"/>
        <circle cx="100" cy="60" r="22" fill="#FF5500" stroke="#3B2F2F" stroke-width="4"/>
        <circle cx="140" cy="70" r="20" fill="#FF5500" stroke="#3B2F2F" stroke-width="4"/>
        <circle cx="100" cy="132" r="27" fill="whitesmoke"/>
      </svg>
      n
    </h1>
  </div>

  <div class="page-container">
    <div class="quienes-somos">
      <p>{{ t('quienes_1') }}</p>
      <br>
      <p>{{ t('quienes_2') }}</p>
      <br>
      <img src="../../Images/logos/foto-home.jpeg" alt="foto-home" class="imagen-home" />
      <br>
      <p>{{ t('quienes_3') }}</p>
      <br>
      <p>{{ t('quienes_4') }}</p>
      <br>
      <div class="cta-container">
        <RouterLink to="/gato">
          <button class="cta-button">{{ t('ver_gatos') }}</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.titulo {
  text-align: center;
  margin-bottom: $espacio-grande;
  padding: 0 15px;
}

.page-container {
  font-family: $fuente-textos;
  padding: 0 $espacio-grande;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: bold;
  color: #ddd;
  gap: $espacio-pequeno;
}

.logo-svg {
  margin-left: -10px;
  width: 1em;
  height: 1em;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: #F7A277;
  margin-top: $espacio-pequeno;
}

.quienes-somos {
  background: rgba(255, 85, 0, 0.1);
  padding: $espacio-extra-grande;
  border-radius: $espacio-mediano;
  color: black;
  text-align: center;
  max-width: 800px;
  margin: 0 auto $espacio-grande;
}

.imagen-home {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  margin-top: -15px;
  border-radius: $espacio-mediano;
}

.highlight {
  color: $color-principal;
  font-weight: bold;
}

.cta-container {
  margin-top: $espacio-grande;
}

.cta-button {
  background-color: $color-principal;
  color: #EEEEEE;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: $espacio-extra-grande;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: #FB7C3C;
  }
}

@media (prefers-color-scheme: dark) {
  .quienes-somos {
    background: rgba(255, 85, 0, 0.1);
    color: $color-blanco;
  }
}

@media (min-width: 1010px) {
  .page-container {
    padding: 0 $espacio-extra-grande;
  }

  .logo-container {
    font-size: 2.8rem;
    margin-top: 92px;
  }

  .quienes-somos {
    padding: 25px;
  }

  .cta-button {
    font-size: 1.1rem;
    padding: $espacio-mediano $espacio-grande;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0 $espacio-grande;
  }

  .logo-container {
    font-size: 2.2rem;
  }

  .quienes-somos {
    padding: $espacio-grande;
    text-align: left;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .cta-button {
    font-size: 1rem;
    padding: $espacio-mediano 16px;
    width: 100%;
  }
}

@media (max-width: 360px) {
  .page-container {
    padding: 0 15px;
  }

  .logo-container {
    font-size: 1.8rem;
  }

  .quienes-somos {
    padding: 15px;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>
