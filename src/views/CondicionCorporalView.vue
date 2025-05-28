<template>
  <div class="condicion-corporal-view">
    <!-- Banner section -->
    <div class="banner" :style="{ backgroundImage: 'url(../../Images/consejos/background-banner.png)' }">
      <h1>La condición corporal en perros y gatos</h1>
    </div>

    <!-- Content section -->
    <div class="content">
      <div class="content-container">
        <img src="../../Images/consejos/condicion-corporal.png" alt="Condición corporal en mascotas" class="main-image" />
        
        <div class="text-content">
          <section class="content-section">
            <p class="destacado">
              El impacto positivo de una nutrición adecuada está bien establecido en los gatos.
            </p>
            <p>
              Una alimentación adaptada a la edad y necesidades nutricionales de cada gato mejora su calidad de vida y forma parte esencial de su cuidado diario. Además, una dieta apropiada durante todas las etapas de la vida puede ayudar a prevenir enfermedades asociadas con la alimentación y a manejar otras.
            </p>
          </section>

          <section class="content-section">
            <p class="destacado">
              Un gato sano es un gato feliz y menos propenso a problemas de salud.
            </p>
            <p>
              Si tiene sobrepeso, será menos capaz de disfrutar del juego y el movimiento, y tendrá mayor riesgo de desarrollar problemas articulares. También aumenta la posibilidad de padecer diabetes tipo 2, enfermedades hepáticas, intolerancia al ejercicio o alteraciones cardiovasculares.
            </p>
          </section>

          <section class="content-section">
            <p class="destacado">
              Evaluar el estado nutricional de nuestro gato es clave para tomar decisiones acertadas.
            </p>
            <p>
              Para saber si nuestro gato tiene una condición corporal ideal y un peso adecuado, debemos fijarnos en algunos aspectos físicos. Las guías de puntuación corporal de organizaciones como la WSAVA (World Small Animal Veterinary Association) o la AAHA (American Animal Hospital Association) pueden ser de gran ayuda.
            </p>
            <p>
              Estas guías combinan la observación y la palpación para evaluar la condición corporal.
            </p>
          </section>

          <section class="content-section">
            <h2>En gatos con una condición corporal ideal:</h2>
            <ul>
              <li>Se pueden palpar las costillas con facilidad, sin exceso de grasa que las cubra.</li>
              <li>Desde arriba, se observa una cintura definida, similar a una forma de "reloj de arena".</li>
              <li>Al tocar con una ligera presión, deben poder distinguirse las costillas, las vértebras lumbares y los huesos de la cadera y la escápula bajo una fina capa de grasa.</li>
            </ul>
          </section>

          <section class="content-section">
            <p class="destacado">
              Es importante estar atentos a las variaciones de peso del gato.
            </p>
            <p>Si notamos que empieza a ganar peso, se pueden tomar estas medidas:</p>
            <ul>
              <li>Ajustar la cantidad diaria de alimento y limitar las golosinas.</li>
              <li>Optar por un alimento menos calórico, si es necesario.</li>
              <li>Aumentar su actividad con juegos interactivos y sesiones de ejercicio en casa.</li>
              <li>Visitar al veterinario para un control de peso y definir una pauta alimentaria personalizada.</li>
            </ul>
          </section>

          <section class="content-section">
            <p class="destacado">
              Un gato con sobrepeso no es un gato sano.
            </p>
            <p>
              La obesidad reduce su esperanza y calidad de vida. Consulta siempre con tu veterinario para mejorar su condición corporal y garantizar su bienestar.
            </p>
          </section>

          <section class="content-section">
            <h2>Recursos adicionales</h2>
            <p>Puedes consultar estas guías oficiales para orientación adicional:</p>
            <ul>
              <li>Puntuación de estado muscular (WSAVA)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped lang="scss">
.condicion-corporal-view {
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
  padding: 40px 20px;
  background-color: #f8f9fa;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-image {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 0 auto 40px;
  display: block;
}

.text-content {
  max-width: 800px;
  margin: 0 auto;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.8;
}

.content-section {
  margin-bottom: 2.5rem;

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

  .destacado {
    font-size: 1.2rem;
    color: #444;
    font-weight: 500;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
    color: #666;

    li {
      margin-bottom: 0.8rem;
      line-height: 1.8;
      padding-left: 0.5rem;
    }
  }
}

@media (max-width: 768px) {
  .banner {
    height: 200px;

    h1 {
      font-size: 2rem;
    }
  }

  .content {
    padding: 20px;
  }

  .content-section {
    h2 {
      font-size: 1.3rem;
    }

    p {
      font-size: 1rem;
    }

    .destacado {
      font-size: 1.2rem;
    }

    ul li {
      font-size: 1rem;
    }
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

    h2, .destacado {
      color: #d0d0d0;
    }
  }
}
</style>