<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAutenticacion } from '@/stores/Autentificacion';
import { esContraseñaValida } from '@/stores/validaciones';

const autenticacion = useAutenticacion();
const { usuario } = storeToRefs(autenticacion);
const router = useRouter();

const nuevaContraseña = ref('');
const repetirContraseña = ref('');
const verNueva = ref(false);
const verRepetir = ref(false);
const mensaje = ref('');

onMounted(() => {
  autenticacion.cargarUsuarioDesdeLocalStorage();
  console.log("Usuario en el perfil:", usuario.value);
});

const cambiarContraseña = async () => {
  if (!nuevaContraseña.value || !repetirContraseña.value) {
    mensaje.value = 'Introduce y repite la nueva contraseña';
    return;
  }
  if (nuevaContraseña.value !== repetirContraseña.value) {
    mensaje.value = 'Las contraseñas no coinciden';
    return;
  }
  if (!esContraseñaValida(nuevaContraseña.value)) {
    mensaje.value = 'La contraseña debe tener al menos 7 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo.';
    return;
  }
  try {
    const response = await fetch(`http://localhost:5167/api/Usuario/${usuario.value?.id_Usuario}/cambiar-contraseña`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nuevaContraseña: nuevaContraseña.value
      })
    });

    if (!response.ok) throw new Error('Error al cambiar la contraseña');
    mensaje.value = 'Contraseña actualizada con éxito';
    nuevaContraseña.value = '';
    repetirContraseña.value = '';
  } catch (error) {
    mensaje.value = 'Error al cambiar la contraseña';
    console.error(error);
  }
};

const cerrarSesion = () => {
  autenticacion.cerrarSesion();
  router.push('/');
};
</script>

<template>
  <div class="perfil">
    <h1 class="perfil__titulo">Mi Perfil</h1>
    <p class="perfil__dato"><strong>Nombre:</strong> {{ usuario.nombre }}</p>
    <p class="perfil__dato"><strong>Apellido:</strong> {{ usuario.apellido }}</p>
    <p class="perfil__dato"><strong>Email:</strong> {{ usuario.email }}</p>

    <div class="perfil__cambiar-contrasena">
      <h2 class="perfil__subtitulo">Cambiar Contraseña</h2>

      <div class="perfil__password-wrapper">
        <input
          :type="verNueva ? 'text' : 'password'"
          class="perfil__input"
          v-model="nuevaContraseña"
          placeholder="Nueva contraseña"
        />
        <button type="button" class="perfil__eye-icon" @click="verNueva = !verNueva">
          <span v-if="verNueva">👁️</span>
          <span v-else>👁️‍🗨️</span>
        </button>
      </div>

      <div class="perfil__password-wrapper">
        <input
          :type="verRepetir ? 'text' : 'password'"
          class="perfil__input"
          v-model="repetirContraseña"
          placeholder="Repite la contraseña"
        />
        <button type="button" class="perfil__eye-icon" @click="verRepetir = !verRepetir">
          <span v-if="verRepetir">👁️</span>
          <span v-else>👁️‍🗨️</span>
        </button>
      </div>

      <button class="perfil__boton" @click="cambiarContraseña">Actualizar</button>
      <p class="perfil__mensaje" v-if="mensaje">{{ mensaje }}</p>
    </div>

    <button class="perfil__boton perfil__boton--rojo" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
</template>

<style scoped lang="scss">
.perfil {
  width: 90%;
  max-width: 400px;
  margin: $espacio-grande auto;
  margin-top: 40px;
  padding: $espacio-grande;
  border: $border-gris1;
  border-radius: $espacio-mediano;
  background-color: #fff;
  box-shadow: 0 4px $espacio-mediano rgba(0, 0, 0, 0.1);

  &__titulo,
  &__subtitulo {
    text-align: center;
    margin-bottom: 15px;
    color: $color-principal;
  }

  &__dato {
    margin-bottom: $espacio-mediano;
  }

  &__cambiar-contrasena {
    margin-top: $espacio-grande;
    text-align: center;
  }

  &__input {
    width: 100%;
    padding: $espacio-mediano;
    margin-top: $espacio-mediano;
    border: $border-gris2;
    border-radius: 6px;
  }

  &__boton {
    width: 100%;
    padding: $espacio-mediano;
    margin-top: $espacio-mediano;
    background-color: $color-principal;
    color: $color-blanco;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;

    &--rojo {
      background-color: $color-rojo;
      margin-top: $espacio-grande;
      font-size: 18px;
    }

    &:hover {
      background-color: darken($color-principal, 10%);
    }

    &--rojo:hover {
      background-color: darken($color-rojo, 10%);
    }
  }

  &__mensaje {
    margin-top: $espacio-mediano;
    color: green;
  }

  &__password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__eye-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
  }
}

@media (prefers-color-scheme: dark) {
  .perfil {
    color: black;
  }
}

@media (min-width: 768px) {
  .perfil {
    max-width: 600px;
    padding: $espacio-extra-grande;
  }

  .perfil__boton {
    padding: 12px;
    font-size: 18px;
  }
}
</style>