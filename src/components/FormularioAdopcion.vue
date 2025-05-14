<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAutenticacion } from '@/stores/Autentificacion';
import { useSolicitudesAdopcionStore } from '@/stores/solicitudesAdopcion';

const props = defineProps<{
  idGato: number;
  nombreGato: string;
  onSuccess: () => void;
  onCancel: () => void;
}>();

const emit = defineEmits(['success', 'cancel']);

// Definir las referencias con sus tipos
const dniInput = ref<HTMLInputElement | null>(null);
const hogarInput = ref<HTMLInputElement | null>(null);

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('cancel');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
});

const autenticacion = useAutenticacion();
const solicitudesStore = useSolicitudesAdopcionStore();

const reglas = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  numero: (v: number) => v > 0 || 'El número debe ser positivo',
  email: (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido',
  telefono: (v: string) => /^\d{9}$/.test(v) || 'El teléfono debe tener 9 dígitos',
  soloNumeros: (v: string) => !v || /^\d+$/.test(v) || 'Solo se permiten números'
};

const formulario = ref({
  nombreCompleto: '',
  edad: null as number | null,
  direccion: '',
  dni: '',
  telefono: '',
  email: '',
  tipoVivienda: '',
  propiedadAlquiler: '',
  permiteAnimales: false,
  numeroPersonas: null as number | null,
  hayNinos: false,
  edadesNinos: '',
  experienciaGatos: false,
  tieneOtrosAnimales: false,
  cortarUnas: false,
  animalesVacunadosEsterilizados: false,
  historialMascotas: '',
  motivacionAdopcion: '',
  problemasComportamiento: '',
  enfermedadesCostosas: '',
  vacaciones: '',
  seguimientoPostAdopcion: false,
  visitaHogar: false,
  fotos_Hogar: [] as File[],
  fotos_DNI: [] as File[]
});

const form = ref<any>(null);
const enviando = ref(false);
const error = ref('');

// Función para manejar la eliminación de fotos del DNI
function eliminarFotoDNI(index: number) {
  const newFiles = [...formulario.value.fotos_DNI];
  newFiles.splice(index, 1);
  formulario.value.fotos_DNI = newFiles;
}

// Función para manejar la eliminación de fotos del hogar
function eliminarFotoHogar(index: number) {
  const newFiles = [...formulario.value.fotos_Hogar];
  newFiles.splice(index, 1);
  formulario.value.fotos_Hogar = newFiles;
}

// Función para manejar la adición de nuevas fotos del DNI
function agregarFotosDNI(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = [...formulario.value.fotos_DNI];
    Array.from(input.files).forEach(file => {
      if (newFiles.length < 2) { // Límite de 2 fotos para DNI
        newFiles.push(file);
      }
    });
    formulario.value.fotos_DNI = newFiles;
  }
}

// Función para manejar la adición de nuevas fotos del hogar
function agregarFotosHogar(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = [...formulario.value.fotos_Hogar];
    Array.from(input.files).forEach(file => {
      if (newFiles.length < 10) { // Límite de 10 fotos para hogar
        newFiles.push(file);
      }
    });
    formulario.value.fotos_Hogar = newFiles;
  }
}

async function enviarSolicitud() {
  if (!autenticacion.usuario?.id_Usuario) {
    error.value = 'Debes iniciar sesión para enviar una solicitud';
    return;
  }

  const { valid } = await form.value.validate();
  
  if (!valid) {
    error.value = 'Por favor, completa todos los campos obligatorios marcados en rojo';
    // Hacer scroll al primer error
    const firstError = document.querySelector('.v-input.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Validar fotos requeridas
  if (formulario.value.fotos_DNI.length < 2) {
    error.value = 'Debes subir las dos caras del DNI';
    return;
  }

  if (formulario.value.fotos_Hogar.length < 3) {
    error.value = 'Debes subir al menos 3 fotos de la vivienda';
    return;
  }

  try {
    enviando.value = true;
    error.value = '';

    // Validar tamaño de las imágenes
    const maxSizeInMB = 5;
    const validarTamanoImagen = (file: File) => {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizeInMB) {
        throw new Error(`La imagen ${file.name} es demasiado grande. El tamaño máximo es ${maxSizeInMB}MB`);
      }
    };

    // Validar todas las imágenes
    [...formulario.value.fotos_DNI, ...formulario.value.fotos_Hogar].forEach(validarTamanoImagen);

    // Procesar las imágenes antes de enviar
    const fotosHogarBase64 = await processFiles(formulario.value.fotos_Hogar);
    const fotosDNIBase64 = await processFiles(formulario.value.fotos_DNI);

    const solicitud = {
      id_Solicitud: 0,
      id_Usuario: autenticacion.usuario.id_Usuario,
      id_Gato: props.idGato,
      fecha_Solicitud: new Date(),
      estado: 'pendiente',
      nombreCompleto: formulario.value.nombreCompleto.trim(),
      edad: formulario.value.edad || 0,
      direccion: formulario.value.direccion.trim(),
      dni: formulario.value.dni.trim(),
      telefono: formulario.value.telefono.trim(),
      email: formulario.value.email.trim(),
      tipoVivienda: formulario.value.tipoVivienda,
      propiedadAlquiler: formulario.value.propiedadAlquiler,
      permiteAnimales: formulario.value.permiteAnimales,
      numeroPersonas: formulario.value.numeroPersonas || 0,
      hayNinos: formulario.value.hayNinos,
      edadesNinos: formulario.value.edadesNinos.trim(),
      experienciaGatos: formulario.value.experienciaGatos,
      tieneOtrosAnimales: formulario.value.tieneOtrosAnimales,
      cortarUnas: formulario.value.cortarUnas,
      animalesVacunadosEsterilizados: formulario.value.animalesVacunadosEsterilizados,
      historialMascotas: formulario.value.historialMascotas.trim(),
      motivacionAdopcion: formulario.value.motivacionAdopcion.trim(),
      problemasComportamiento: formulario.value.problemasComportamiento.trim(),
      enfermedadesCostosas: formulario.value.enfermedadesCostosas.trim(),
      vacaciones: formulario.value.vacaciones.trim(),
      seguimientoPostAdopcion: formulario.value.seguimientoPostAdopcion,
      visitaHogar: formulario.value.visitaHogar,
      fotos_Hogar: fotosHogarBase64,
      fotos_DNI: fotosDNIBase64,
      comentario_Protectora: ''
    };

    try {
      console.log('Enviando solicitud:', solicitud);
      await solicitudesStore.createSolicitud(solicitud);
      emit('success');
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.';
      }
      throw err; // Re-lanzar el error para que se maneje en el componente padre si es necesario
    }
  } catch (err) {
    console.error('Error en la validación o procesamiento:', err);
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
    }
  } finally {
    enviando.value = false;
  }
}

// Función auxiliar para procesar archivos a Base64
async function processFiles(files: File[]): Promise<string> {
  if (!files || files.length === 0) return '';

  const processFile = async (file: File): Promise<string> => {
    // Crear un canvas para comprimir la imagen
    const compressImage = async (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calcular nuevas dimensiones manteniendo la proporción
          let width = img.width;
          let height = img.height;
          const maxDimension = 800; // Máximo tamaño de lado

          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a Blob con calidad reducida
          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Error al comprimir la imagen'));
              }
            },
            'image/jpeg',
            0.7 // Calidad de compresión (0.7 = 70%)
          );
        };
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
      });
    };

    try {
      const compressedBlob = await compressImage(file);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressedBlob);
      });
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      throw error;
    }
  };

  const base64Array = await Promise.all(files.map(processFile));
  return base64Array.join(',');
}
</script>

<template>
  <v-card class="formulario-adopcion">
    <v-card-title class="formulario-adopcion__titulo">
      Solicitud de Adopción para {{ nombreGato }}
    </v-card-title>

    <v-card-text class="formulario-adopcion__contenido">
      <v-form 
        ref="form"
        @submit.prevent="enviarSolicitud"
        class="formulario-adopcion__form"
        validate-on="submit"
      >
        <!-- Información Personal -->
        <div class="formulario-adopcion__seccion">
          <h3>Información Personal</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formulario.nombreCompleto"
                label="Nombre completo *"
                :rules="[v => !!v || 'El nombre es obligatorio']"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formulario.edad"
                label="Edad *"
                type="number"
                :rules="[
                  v => !!v || 'La edad es obligatoria',
                  v => v > 17 || 'Debes ser mayor de edad'
                ]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formulario.direccion"
                label="Dirección completa *"
                :rules="[v => !!v || 'La dirección es obligatoria']"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formulario.dni"
                label="DNI/NIE *"
                :rules="[
                  v => !!v || 'El DNI/NIE es obligatorio',
                  v => /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/.test(v) || 'DNI/NIE no válido'
                ]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formulario.telefono"
                label="Teléfono *"
                :rules="[
                  v => !!v || 'El teléfono es obligatorio',
                  v => /^[0-9]{9}$/.test(v) || 'Teléfono no válido'
                ]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formulario.email"
                label="Email *"
                :rules="[
                  v => !!v || 'El email es obligatorio',
                  v => /.+@.+\..+/.test(v) || 'Email no válido'
                ]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Campo de fotos DNI -->
          <v-row>
            <v-col cols="12">
              <div class="file-input-container">
                <label class="file-input-label">
                  Foto DNI/NIE (ambas caras) *
                  <span class="file-counter">{{ formulario.fotos_DNI.length }}/2</span>
                </label>
                
                <div class="file-list" v-if="formulario.fotos_DNI.length > 0">
                  <div v-for="(file, index) in formulario.fotos_DNI" :key="index" class="file-item">
                    <v-icon size="small" class="file-icon">mdi-file-image</v-icon>
                    <span class="file-name">{{ file.name }}</span>
                    <v-btn
                      size="small"
                      icon
                      variant="text"
                      color="error"
                      @click="eliminarFotoDNI(index)"
                      class="delete-btn"
                    >
                      <v-icon size="small">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>

                <div class="file-input-actions">
                  <input
                    type="file"
                    accept="image/*"
                    @change="agregarFotosDNI"
                    :disabled="formulario.fotos_DNI.length >= 2"
                    ref="dniInput"
                    style="display: none"
                    multiple
                  >
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-camera"
                    @click="dniInput?.click()"
                    :disabled="formulario.fotos_DNI.length >= 2"
                  >
                    Añadir foto
                  </v-btn>
                </div>

                <div class="input-hints">
                  <span class="hint-text">Sube las fotos de ambas caras del DNI/NIE</span>
                  <span v-if="formulario.fotos_DNI.length < 2" class="error-text">
                    Este campo es obligatorio
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Información de Vivienda -->
        <div class="formulario-adopcion__seccion">
          <h3>Información de Vivienda</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formulario.tipoVivienda"
                :items="['Piso', 'Casa', 'Chalet', 'Otro']"
                label="Tipo de vivienda *"
                :rules="[v => !!v || 'El tipo de vivienda es obligatorio']"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formulario.propiedadAlquiler"
                :items="['Propiedad', 'Alquiler']"
                label="Propiedad o alquiler *"
                :rules="[v => !!v || 'Este campo es obligatorio']"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="formulario.permiteAnimales"
                label="¿Se permiten animales? *"
                :rules="[v => v || 'Debe permitirse tener animales']"
                required
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formulario.numeroPersonas"
                label="Número de personas en la vivienda *"
                type="number"
                :rules="[v => !!v || 'Este campo es obligatorio']"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="formulario.hayNinos"
                label="¿Hay niños?"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6" v-if="formulario.hayNinos">
              <v-text-field
                v-model="formulario.edadesNinos"
                label="Edades de los niños *"
                :rules="[v => !formulario.hayNinos || !!v || 'Indique las edades']"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Campo de fotos Hogar -->
          <v-row>
            <v-col cols="12">
              <div class="file-input-container">
                <label class="file-input-label">
                  Fotos de la vivienda *
                  <span class="file-counter">{{ formulario.fotos_Hogar.length }}/10</span>
                </label>
                
                <div class="file-list" v-if="formulario.fotos_Hogar.length > 0">
                  <div v-for="(file, index) in formulario.fotos_Hogar" :key="index" class="file-item">
                    <v-icon size="small" class="file-icon">mdi-file-image</v-icon>
                    <span class="file-name">{{ file.name }}</span>
                    <v-btn
                      size="small"
                      icon
                      variant="text"
                      color="error"
                      @click="eliminarFotoHogar(index)"
                      class="delete-btn"
                    >
                      <v-icon size="small">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>

                <div class="file-input-actions">
                  <input
                    type="file"
                    accept="image/*"
                    @change="agregarFotosHogar"
                    :disabled="formulario.fotos_Hogar.length >= 10"
                    ref="hogarInput"
                    style="display: none"
                    multiple
                  >
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-camera"
                    @click="hogarInput?.click()"
                    :disabled="formulario.fotos_Hogar.length >= 10"
                  >
                    Añadir foto
                  </v-btn>
                </div>

                <div class="input-hints">
                  <span class="hint-text">Sube entre 3 y 10 fotos de diferentes espacios de la vivienda</span>
                  <span v-if="formulario.fotos_Hogar.length < 3" class="error-text">
                    Se requieren al menos 3 fotos
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Experiencia con Mascotas -->
        <div class="formulario-adopcion__seccion">
          <h3>Experiencia con Mascotas</h3>

          <v-checkbox
            v-model="formulario.experienciaGatos"
            label="¿Tiene experiencia con gatos? *"
            :rules="[v => v !== null || 'Debes indicar si tienes experiencia con gatos']"
            required
          ></v-checkbox>

          <v-checkbox
            v-model="formulario.tieneOtrosAnimales"
            label="¿Tiene otros animales? *"
            :rules="[v => v !== null || 'Debes indicar si tienes otros animales']"
            required
          ></v-checkbox>

          <v-checkbox
            v-model="formulario.cortarUnas"
            label="¿Sabe cortar uñas? *"
            :rules="[v => v !== null || 'Debes indicar si sabes cortar uñas']"
            required
          ></v-checkbox>

          <v-checkbox
            v-model="formulario.animalesVacunadosEsterilizados"
            label="¿Animales vacunados/esterilizados? *"
            :rules="[v => v !== null || 'Debes indicar si tus animales están vacunados/esterilizados']"
            required
          ></v-checkbox>

          <v-textarea
            v-model="formulario.historialMascotas"
            label="Historial con mascotas *"
            :rules="[reglas.required]"
            required
          ></v-textarea>
        </div>

        <!-- Compromiso y Responsabilidad -->
        <div class="formulario-adopcion__seccion">
          <h3>Compromiso y Responsabilidad</h3>

          <v-textarea
            v-model="formulario.motivacionAdopcion"
            label="Motivación para adoptar *"
            :rules="[reglas.required]"
            required
          ></v-textarea>

          <v-textarea
            v-model="formulario.problemasComportamiento"
            label="¿Qué harías ante problemas de comportamiento? *"
            :rules="[reglas.required]"
            required
          ></v-textarea>

          <v-textarea
            v-model="formulario.enfermedadesCostosas"
            label="¿Qué harías ante enfermedades costosas? *"
            :rules="[reglas.required]"
            required
          ></v-textarea>

          <v-textarea
            v-model="formulario.vacaciones"
            label="Plan para vacaciones *"
            :rules="[reglas.required]"
            required
          ></v-textarea>

          <v-checkbox
            v-model="formulario.seguimientoPostAdopcion"
            label="¿Acepta seguimiento post-adopción? *"
            :rules="[v => v || 'Debes aceptar el seguimiento post-adopción']"
            required
          ></v-checkbox>

          <v-checkbox
            v-model="formulario.visitaHogar"
            label="¿Acepta visita al hogar? *"
            :rules="[v => v || 'Debes aceptar la visita al hogar']"
            required
          ></v-checkbox>
        </div>

        <!-- Botones de acción -->
        <div class="formulario-adopcion__acciones">
          <v-btn
            color="error"
            variant="outlined"
            @click="emit('cancel')"
            :disabled="enviando"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="enviando"
          >
            Enviar solicitud
          </v-btn>
        </div>

        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
          variant="tonal"
          closable
        >
          {{ error }}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.formulario-adopcion {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;

  &__titulo {
    background-color: $color-principal;
    color: white;
    padding: 16px 20px;
    font-size: 1.2rem;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  &__contenido {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__seccion {
    background: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    
    h3 {
      color: $color-principal;
      font-size: 1.1rem;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid $color-principal;
    }
  }

  &__acciones {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  :deep(.v-input.error) {
    .v-field {
      border-color: rgb(var(--v-theme-error)) !important;
    }
    
    .v-messages {
      color: rgb(var(--v-theme-error));
      font-size: 0.875rem;
      margin-top: 4px;
    }
  }

  :deep(.v-checkbox.error) {
    .v-selection-control {
      color: rgb(var(--v-theme-error));
    }
    
    .v-messages {
      color: rgb(var(--v-theme-error));
      font-size: 0.875rem;
      margin-top: 4px;
    }
  }

  :deep(.v-file-input) {
    .v-input__details {
      padding-top: 4px;
    }

    .v-counter {
      color: rgba(var(--v-theme-on-surface), 0.7);
    }

    .v-field--error {
      .v-counter {
        color: rgb(var(--v-theme-error));
      }
    }

    .v-input__hint {
      color: rgba(var(--v-theme-on-surface), 0.7);
      font-size: 0.875rem;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .formulario-adopcion {
    background: #272727;
    color: white;

    &__seccion {
      background: #1e1e1e;
    }

    &__acciones {
      background: #272727;
      border-top-color: rgba(255, 255, 255, 0.12);
    }
  }
}

.file-input-container {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 4px;
  padding: 12px;
  background-color: rgb(var(--v-theme-surface));

  .file-input-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    margin-bottom: 8px;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }

  .file-counter {
    font-size: 0.875rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
  }

  .file-list {
    margin: 8px 0;
    max-height: 200px;
    overflow-y: auto;
  }

  .file-item {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    margin: 4px 0;
    background-color: rgba(var(--v-theme-on-surface), 0.04);
    border-radius: 4px;

    .file-icon {
      margin-right: 8px;
      color: rgba(var(--v-theme-on-surface), 0.6);
    }

    .file-name {
      flex: 1;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .delete-btn {
      margin-left: 8px;
    }
  }

  .file-input-actions {
    margin-top: 8px;
  }

  .input-hints {
    margin-top: 8px;
    font-size: 0.75rem;

    .hint-text {
      color: rgba(var(--v-theme-on-surface), 0.6);
    }

    .error-text {
      color: rgb(var(--v-theme-error));
      margin-left: 8px;
    }
  }

  &:hover {
    border-color: rgba(var(--v-theme-on-surface), 0.24);
  }

  &:focus-within {
    border-color: rgb(var(--v-theme-primary));
  }
}

@media (prefers-color-scheme: dark) {
  .file-input-container {
    background-color: rgba(var(--v-theme-surface), 0.1);
    
    .file-item {
      background-color: rgba(var(--v-theme-surface), 0.2);
    }

    .file-input-label {
      color: rgba(255, 255, 255, 0.7);
    }

    .file-counter {
      color: rgba(255, 255, 255, 0.6);
    }

    .file-item {
      background-color: rgba(255, 255, 255, 0.04);

      .file-icon {
        color: rgba(255, 255, 255, 0.6);
      }

      .file-name {
        color: rgba(255, 255, 255, 0.87);
      }
    }

    .input-hints {
      .hint-text {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style> 