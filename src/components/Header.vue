<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useAutenticacion } from '@/stores/Autentificacion';
import { useI18n } from '@/stores/useI18n';
import esFlag from '@/assets/es-flag.svg';
import gbFlag from '@/assets/gb-flag.svg';

const { t, cambiarIdioma, idioma } = useI18n();
const Autenticacion = useAutenticacion();
const { usuario } = storeToRefs(Autenticacion);
const mostrarMenu = ref(false);
const mostrarIdiomaMenu = ref(false);
const mostrarMenuHamburguesa = ref(false);
const isHovering = ref(false);
const offsets = ref([0, 0, 0]);
const menuContainer = ref<HTMLElement | null>(null);
const userIcon = ref<HTMLElement | null>(null);
const idiomaMenuRef = ref<HTMLElement | null>(null);
const menuHamburguesaRef = ref<HTMLElement | null>(null);
const hamburguesaBtn = ref<HTMLElement | null>(null);

onMounted(() => {
  Autenticacion.cargarUsuarioDesdeLocalStorage();
  console.log("Usuario cargado en el Header:", usuario.value);

  // Asegurarnos de que el canvas existe y tiene el contexto correcto
  const initCanvas = () => {
    const canvas = document.getElementById('pawCanvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        drawPaw(ctx);
        canvas.addEventListener('mouseenter', () => {
          isHovering.value = true;
          animateRaise(ctx);
        });
        canvas.addEventListener('mouseleave', () => {
          isHovering.value = false;
          resetPaw(ctx);
        });
      }
    }
  };

  // Intentar inicializar el canvas varias veces para asegurar que se dibuja
  initCanvas();
  setTimeout(initCanvas, 100); // Reintento después de 100ms
  setTimeout(initCanvas, 500); // Reintento después de 500ms

  document.addEventListener('click', (event) => {
    closeMenu(event);
    closeIdiomaMenu(event);
    closeMenuHamburguesa(event);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu);
  document.removeEventListener('click', closeIdiomaMenu);
  document.removeEventListener('click', closeMenuHamburguesa);
});

const toggleMenu = () => {
  mostrarMenu.value = !mostrarMenu.value;
};

const toggleIdiomaMenu = () => {
  mostrarIdiomaMenu.value = !mostrarIdiomaMenu.value;
};

const toggleMenuHamburguesa = () => {
  mostrarMenuHamburguesa.value = !mostrarMenuHamburguesa.value;
};

const closeMenu = (event: Event) => {
  if (
    mostrarMenu.value &&
    menuContainer.value &&
    !menuContainer.value.contains(event.target as Node) &&
    userIcon.value &&
    !userIcon.value.contains(event.target as Node)
  ) {
    mostrarMenu.value = false;
  }
};

const closeIdiomaMenu = (event: Event) => {
  if (
    mostrarIdiomaMenu.value &&
    idiomaMenuRef.value &&
    !idiomaMenuRef.value.contains(event.target as Node)
  ) {
    mostrarIdiomaMenu.value = false;
  }
};

const closeMenuHamburguesa = (event: Event) => {
  if (
    mostrarMenuHamburguesa.value &&
    menuHamburguesaRef.value &&
    !menuHamburguesaRef.value.contains(event.target as Node) &&
    hamburguesaBtn.value &&
    !hamburguesaBtn.value.contains(event.target as Node)
  ) {
    mostrarMenuHamburguesa.value = false;
  }
};

const cerrarMenuHamburguesa = () => {
  mostrarMenuHamburguesa.value = false;
};

const cambiarIdiomaSeleccionado = (nuevoIdioma: 'es' | 'en') => {
  if (idioma.value !== nuevoIdioma) {
    cambiarIdioma();
  }
  mostrarIdiomaMenu.value = false;
};

function drawPaw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 200, 200);

  ctx.beginPath();
  ctx.arc(100, 120, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#FF5500";
  ctx.strokeStyle = "#3B2F2F";
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(100, 132, 27, 0, Math.PI * 2);
  ctx.fillStyle = "whitesmoke";
  ctx.fill();

  drawCircle(ctx, 60, 70 + offsets.value[0], 20);
  drawCircle(ctx, 100, 60 + offsets.value[1], 22);
  drawCircle(ctx, 140, 70 + offsets.value[2], 20);
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#FF5500";
  ctx.strokeStyle = "#3B2F2F";
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();
}

function animateRaise(ctx: CanvasRenderingContext2D) {
  const maxOffset = -30;
  let index = 0;

  function raiseStep() {
    if (!isHovering.value) return;

    if (index < 3) {
      offsets.value[index] = maxOffset;
      index++;
      drawPaw(ctx);
      setTimeout(raiseStep, 200);
    } else {
      setTimeout(() => resetPaw(ctx), 600);
    }
  }

  raiseStep();
}

function resetPaw(ctx: CanvasRenderingContext2D) {
  offsets.value = [0, 0, 0];
  drawPaw(ctx);
}
</script>

<template>
  <main>
    <header>
      <div class="logo-container">
        <RouterLink to="/">
          <canvas id="pawCanvas"></canvas>
        </RouterLink>
      </div>
      <div class="text">
        <nav class="desktop-nav">
          <RouterLink to="/gato">{{ t('gatos') }}</RouterLink>
          <RouterLink to="/protectoras">{{ t('protectoras') }}</RouterLink>
          <RouterLink to="/consejos-expertos">{{ t('consejos_expertos') }}</RouterLink>
        </nav>
        
        <!-- Botón hamburguesa para móvil -->
        <button 
          class="menu-hamburguesa-btn" 
          @click="toggleMenuHamburguesa"
          ref="hamburguesaBtn"
          :class="{ 'activo': mostrarMenuHamburguesa }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Menú hamburguesa desplegable -->
        <nav 
          v-if="mostrarMenuHamburguesa" 
          class="menu-hamburguesa" 
          ref="menuHamburguesaRef"
        >
          <RouterLink to="/gato" @click="cerrarMenuHamburguesa">{{ t('gatos') }}</RouterLink>
          <RouterLink to="/protectoras" @click="cerrarMenuHamburguesa">{{ t('protectoras') }}</RouterLink>
          <RouterLink to="/consejos-expertos" @click="cerrarMenuHamburguesa">{{ t('consejos_expertos') }}</RouterLink>
        </nav>

        <div class="usuario">
          <div class="idioma-selector" ref="idiomaMenuRef">
            <button @click="toggleIdiomaMenu" class="idioma-btn">
              <img 
                :src="idioma === 'es' ? esFlag : gbFlag" 
                :alt="idioma === 'es' ? 'Español' : 'English'"
                class="bandera"
              >
              <span class="idioma-texto">{{ idioma.toUpperCase() }}</span>
            </button>
            <div v-if="mostrarIdiomaMenu" class="idioma-menu">
              <button 
                v-if="idioma !== 'es'" 
                @click="cambiarIdiomaSeleccionado('es')" 
                class="idioma-opcion"
              >
                <img 
                  :src="esFlag" 
                  alt="Español"
                  class="bandera"
                >
                <span class="idioma-texto">ES</span>
              </button>
              <button 
                v-if="idioma !== 'en'" 
                @click="cambiarIdiomaSeleccionado('en')" 
                class="idioma-opcion"
              >
                <img 
                  :src="gbFlag" 
                  alt="English"
                  class="bandera"
                >
                <span class="idioma-texto">EN</span>
              </button>
            </div>
          </div>
          <template v-if="!usuario">
            <RouterLink to="/iniciar-sesion">{{ t('iniciar_sesion') }}</RouterLink>
            <RouterLink to="/registrarse">{{ t('registrarse') }}</RouterLink>
          </template>
          <template v-else>
            <div class="usuario-menu">
              <svg @click="toggleMenu" ref="userIcon" width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#FF5500" stroke="#3B2F2F" stroke-width="2" class="circulo-usuario" />
                <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#3B2F2F" stroke-width="2" class="cuerpo-usuario" />
              </svg>
              <div v-if="mostrarMenu" ref="menuContainer" class="datos-usuario">
                <p>{{ t('hola') }} {{ usuario.nombre }}</p>
                <RouterLink to="/perfil" class="boton-1"><span>{{ t('mi_perfil') }}</span></RouterLink>
                <RouterLink to="/deseados" class="boton-2"><span>❤️ {{ t('deseados') }}</span></RouterLink>
                <RouterLink to="/solicitudes" class="boton-2"><span>📋 {{ t('solicitudes') }}</span></RouterLink>
                <RouterLink v-if="usuario.rol === 'admin'" to="/admin" class="admin-boton">{{ t('panel_admin') }}</RouterLink>
                <RouterLink v-if="usuario.rol === 'protectora'" to="/protectora-admin" class="admin-boton">{{ t('panel_protectora') }}</RouterLink>
                <RouterLink to="/"><button class="logout-btn" @click="Autenticacion.cerrarSesion">{{ t('cerrar_sesion') }}</button></RouterLink>
              </div>
            </div>
          </template>
        </div>
      </div>
    </header>
  </main>
</template>

<style scoped lang="scss">
header {
  font-family: $fuente-titulos;
  @include center-flex;
  padding: $espacio-mediano 15px;
  width: 100%;
}

.text {
  width: 200px;
  position: relative;
}

.desktop-nav {
  display: flex;
  flex-direction: column;
  width: 200px;
  justify-content: center;

  a {
    white-space: nowrap;
    font-size: 0.95rem;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.menu-hamburguesa-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  
  span {
    width: 100%;
    height: 3px;
    background-color: #FF5500;
    border-radius: 3px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &.activo {
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    span:nth-child(2) {
      opacity: 0;
      transform: translateX(20px);
    }
    
    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
}

.menu-hamburguesa {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1500;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  a {
    padding: 12px 15px;
    border-radius: 6px;
    transition: background-color 0.2s;
    text-decoration: none;
    color: inherit;
    font-size: 0.95rem;

    &:hover {
      background-color: rgba(255, 85, 0, 0.1);
    }
  }
}

canvas {
  display: block;
  width: 80px;
  height: 80px;
}

.usuario {
  display: flex;
  align-items: center;
  gap: 15px;

  a {
    white-space: nowrap;
    font-size: 0.95rem;
  }
}

.usuario-menu {
  position: relative;
  display: inline-flex;
  align-items: center;

  .datos-usuario {
    position: absolute;
    left: -60px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: $border-gris1;
    border-radius: $espacio-pequeno;
    box-shadow: $sombra-contenedor;
    background: $color-blanco;
    padding: $espacio-mediano;
    z-index: 1400;

    & .boton-1 {
      background-color: $color-principal;
      color: $color-blanco;
      margin: 15px 0;
      padding: $espacio-mediano 15px;
      border-radius: $espacio-mediano;
    }

    & .boton-2 {
      background-color: $color-principal;
      color: $color-blanco;
      margin-bottom: $espacio-mediano;
      padding: $espacio-mediano 15px;
      border-radius: $espacio-mediano;
    }
  }
}

.logout-btn {
  margin-top: $espacio-pequeno;
  background: $color-rojo;
  color: $color-blanco;
  border: none;
  padding: $espacio-pequeno $espacio-mediano;
  cursor: pointer;
  border-radius: $espacio-pequeno;
}

.idioma-selector {
  position: relative;
  display: inline-block;
}

.idioma-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 15px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: $espacio-pequeno;
  background-color: rgba(255, 255, 255, 0.1);

  &:hover {
    transform: scale(1.05);
    background-color: rgba(255, 255, 255, 0.2);
  }

  .bandera {
    width: 20px;
    height: 15px;
    object-fit: cover;
    border-radius: 2px;
  }

  .idioma-texto {
    font-size: 0.9rem;
    font-weight: bold;
  }
}

.idioma-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: $border-gris1;
  border-radius: $espacio-pequeno;
  box-shadow: $sombra-contenedor;
  z-index: 1300;
  margin-top: 5px;
  min-width: 100%;

  .idioma-opcion {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .bandera {
      width: 20px;
      height: 15px;
      object-fit: cover;
      border-radius: 2px;
    }

    .idioma-texto {
      font-size: 0.9rem;
      font-weight: bold;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .datos-usuario {
    color: black;
  }
  .usuario-menu circle {
    stroke: #ddd;
  }
  .usuario-menu path {
    stroke: #ddd;
  }
  .idioma-menu {
    background: #272727;
    border-color: #404040;

    .idioma-opcion {
      color: whitesmoke;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .idioma-btn {
    color: whitesmoke;
  }

  .menu-hamburguesa {
    background: #272727;
    border-color: #404040;
    color: whitesmoke;

    a {
      color: whitesmoke;

      &:hover {
        background-color: rgba(255, 85, 0, 0.2);
      }
    }
  }

  .menu-hamburguesa-btn span {
    background-color: #FF5500;
  }
}

@media (min-width: 788px) {
  header {
    padding: 15px $espacio-extra-grande;
  }

  .text {
    display: flex;
    width: 700px;
  }

  .desktop-nav {
    flex-grow: 1;
    width: 300px;
    gap: $espacio-pequeno;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    a {
      margin-bottom: 0;
    }
  }

  .usuario {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
  }

  .menu-hamburguesa-btn {
    display: none !important;
  }

  .menu-hamburguesa {
    display: none !important;
  }
}

@media (min-width: 1010px) {
  header {
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .text {
    width: 1310px;
  }

  svg {
    width: 70px;
    height: 70px;
  }

  .desktop-nav {
    gap: $espacio-grande;
    align-items: center;
  }

  .usuario {
    gap: $espacio-grande;
  }
}

@media (min-width: 768px) {
  .idioma-btn .bandera,
  .idioma-menu .idioma-opcion .bandera {
    width: 24px;
    height: 18px;
  }
}

@media (min-width: 1024px) {
  .idioma-btn .bandera,
  .idioma-menu .idioma-opcion .bandera {
    width: 28px;
    height: 21px;
  }
}

@media (max-width: 787px) {
  header {
    display: flex;
    justify-content: space-between;
    padding: $espacio-mediano 15px;
  }

  .logo-container {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 5px;

    canvas {
      width: 85px !important;
      height: 85px !important;
    }
  }

  .text {
    width: 50%;
    padding-top: 10px;
  }

  .desktop-nav {
    display: none;
  }

  .menu-hamburguesa-btn {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
  }

  .menu-hamburguesa {
    top: 40px;
    bottom: auto;
    margin-top: 0;
    margin-bottom: 0;
  }

  .usuario {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-top: 45px;

    .idioma-selector {
      align-self: flex-start;
    }

    .usuario-menu {
      align-self: flex-start;

      .datos-usuario {
        left: 0;
      }
    }
  }
}

// Para pantallas aún más pequeñas, mantener un tamaño mínimo
@media (max-width: 375px) {
  .logo-container canvas {
    width: 80px !important;
    height: 80px !important;
  }
}</style>