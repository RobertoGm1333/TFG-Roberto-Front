<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAutenticacion } from '@/stores/Autentificacion';
import { useSolicitudesAdopcionStore } from '@/stores/solicitudesAdopcion';

const props = defineProps<{
  idGato: number;
  nombreGato: string;
  onSuccess: () => void;
  onCancel: () => void;
}>();

const emit = defineEmits(['success', 'cancel']);

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

// Estado del wizard
const pasoActual = ref(1);
const totalPasos = 4;

const reglas = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  numero: (v: number) => v > 0 || 'El número debe ser positivo',
  email: (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido',
  telefono: (v: string) => /^\d{9}$/.test(v) || 'El teléfono debe tener 9 dígitos',
  soloNumeros: (v: string) => !v || /^\d+$/.test(v) || 'Solo se permiten números'
};

// Valores por defecto para los campos
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
  visitaHogar: false
});

const form = ref<any>(null);
const enviando = ref(false);
const error = ref('');

// Títulos de los pasos
const titulosPasos = [
  'Información Personal',
  'Información de Vivienda',
  'Experiencia con Mascotas',
  'Compromiso y Responsabilidad'
];

// Computed para mostrar el progreso
const progreso = computed(() => (pasoActual.value / totalPasos) * 100);

// Funciones de navegación
async function siguientePaso() {
  const valido = await validarPasoActual();
  if (valido && pasoActual.value < totalPasos) {
    pasoActual.value++;
  }
}

function pasoAnterior() {
  if (pasoActual.value > 1) {
    pasoActual.value--;
  }
}

function irAPaso(paso: number) {
  if (paso >= 1 && paso <= totalPasos) {
    pasoActual.value = paso;
  }
}

// Validación por pasos
async function validarPasoActual(): Promise<boolean> {
  if (!form.value) return false;
  
  error.value = '';
  
  // Validar campos específicos según el paso actual
  const camposValidar = getCamposPorPaso(pasoActual.value);
  let valid = true;
  
  // Verificar manualmente los campos requeridos del paso actual
  for (const campo of camposValidar) {
    if (campo.required && !validarCampo(campo.key, campo.validator)) {
      valid = false;
      break;
    }
  }
  
  if (!valid) {
    error.value = 'Por favor, completa todos los campos obligatorios de este paso';
    // Hacer scroll al primer error
    setTimeout(() => {
      const firstError = document.querySelector('.v-input.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
  
  return valid;
}

function getCamposPorPaso(paso: number) {
  const camposPorPaso = {
    1: [
      { key: 'nombreCompleto', required: true, validator: (v: any) => !!v },
      { key: 'edad', required: true, validator: (v: any) => !!v && v > 17 },
      { key: 'direccion', required: true, validator: (v: any) => !!v },
      { key: 'dni', required: true, validator: (v: any) => !!v && /^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/.test(v) },
      { key: 'telefono', required: true, validator: (v: any) => !!v && /^[0-9]{9}$/.test(v) },
      { key: 'email', required: true, validator: (v: any) => !!v && /.+@.+\..+/.test(v) }
    ],
    2: [
      { key: 'tipoVivienda', required: true, validator: (v: any) => !!v },
      { key: 'propiedadAlquiler', required: true, validator: (v: any) => !!v },
      { key: 'permiteAnimales', required: true, validator: (v: any) => v === true },
      { key: 'numeroPersonas', required: true, validator: (v: any) => !!v }
    ],
    3: [
      { key: 'experienciaGatos', required: true, validator: (v: any) => v !== null },
      { key: 'tieneOtrosAnimales', required: true, validator: (v: any) => v !== null },
      { key: 'cortarUnas', required: true, validator: (v: any) => v !== null },
      { key: 'animalesVacunadosEsterilizados', required: true, validator: (v: any) => v !== null },
      { key: 'historialMascotas', required: true, validator: (v: any) => !!v }
    ],
    4: [
      { key: 'motivacionAdopcion', required: true, validator: (v: any) => !!v },
      { key: 'problemasComportamiento', required: true, validator: (v: any) => !!v },
      { key: 'enfermedadesCostosas', required: true, validator: (v: any) => !!v },
      { key: 'vacaciones', required: true, validator: (v: any) => !!v },
      { key: 'seguimientoPostAdopcion', required: true, validator: (v: any) => v === true },
      { key: 'visitaHogar', required: true, validator: (v: any) => v === true }
    ]
  };
  
  return camposPorPaso[paso as keyof typeof camposPorPaso] || [];
}

function validarCampo(key: string, validator: (v: any) => boolean): boolean {
  const valor = formulario.value[key as keyof typeof formulario.value];
  return validator(valor);
}

async function enviarSolicitud() {
  console.log("Iniciando envío de solicitud...");
  
  if (!autenticacion.usuario?.id_Usuario) {
    error.value = 'Debes iniciar sesión para enviar una solicitud';
    return;
  }

  // Validar todos los pasos antes de enviar
  let todosLospassosValidos = true;
  for (let i = 1; i <= totalPasos; i++) {
    const campos = getCamposPorPaso(i);
    for (const campo of campos) {
      if (campo.required && !validarCampo(campo.key, campo.validator)) {
        todosLospassosValidos = false;
        break;
      }
    }
    if (!todosLospassosValidos) break;
  }

  if (!todosLospassosValidos) {
    error.value = 'Hay campos obligatorios sin completar. Revisa todos los pasos.';
    return;
  }

  try {
    enviando.value = true;
    error.value = '';

    // Asegurarse de que los valores no sean nulos
    const solicitud = {
      id_Solicitud: 0,
      id_Usuario: autenticacion.usuario.id_Usuario,
      id_Gato: props.idGato,
      fecha_Solicitud: new Date(),
      estado: 'pendiente',
      nombreCompleto: formulario.value.nombreCompleto?.trim() || '',
      edad: formulario.value.edad || null,
      direccion: formulario.value.direccion?.trim() || '',
      dni: formulario.value.dni?.trim() || '',
      telefono: formulario.value.telefono?.trim() || '',
      email: formulario.value.email?.trim() || '',
      tipoVivienda: formulario.value.tipoVivienda || '',
      propiedadAlquiler: formulario.value.propiedadAlquiler || '',
      permiteAnimales: formulario.value.permiteAnimales === true,
      numeroPersonas: formulario.value.numeroPersonas || null,
      hayNinos: formulario.value.hayNinos === true,
      edadesNinos: formulario.value.edadesNinos?.trim() || '',
      experienciaGatos: formulario.value.experienciaGatos === true,
      tieneOtrosAnimales: formulario.value.tieneOtrosAnimales === true,
      cortarUnas: formulario.value.cortarUnas === true,
      animalesVacunadosEsterilizados: formulario.value.animalesVacunadosEsterilizados === true,
      historialMascotas: formulario.value.historialMascotas?.trim() || '',
      motivacionAdopcion: formulario.value.motivacionAdopcion?.trim() || '',
      problemasComportamiento: formulario.value.problemasComportamiento?.trim() || '',
      enfermedadesCostosas: formulario.value.enfermedadesCostosas?.trim() || '',
      vacaciones: formulario.value.vacaciones?.trim() || '',
      seguimientoPostAdopcion: formulario.value.seguimientoPostAdopcion === true,
      visitaHogar: formulario.value.visitaHogar === true,
      comentario_Protectora: ''
    };

    try {
      console.log('Enviando solicitud:', JSON.stringify(solicitud, null, 2));
      await solicitudesStore.createSolicitud(solicitud);
      console.log('Solicitud enviada correctamente');
      emit('success');
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      if (err instanceof Error) {
        error.value = `Error: ${err.message}`;
      } else {
        error.value = 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.';
      }
    }
  } catch (err) {
    console.error('Error en la validación o procesamiento:', err);
    if (err instanceof Error) {
      error.value = `Error: ${err.message}`;
    } else {
      error.value = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
    }
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <v-card class="formulario-adopcion-wizard">
    <v-card-title class="formulario-adopcion-wizard__titulo">
      Solicitud de Adopción para {{ nombreGato }}
    </v-card-title>

    <!-- Indicador de progreso -->
    <div class="formulario-adopcion-wizard__progreso">
      <v-progress-linear
        :model-value="progreso"
        color="primary"
        height="4"
        class="mb-4"
      ></v-progress-linear>
      
      <!-- Stepper horizontal -->
      <div class="formulario-adopcion-wizard__stepper">
        <div 
          v-for="(titulo, index) in titulosPasos" 
          :key="index"
          class="formulario-adopcion-wizard__step"
          :class="{ 
            'formulario-adopcion-wizard__step--active': pasoActual === index + 1,
            'formulario-adopcion-wizard__step--completed': pasoActual > index + 1
          }"
          @click="irAPaso(index + 1)"
        >
          <div class="formulario-adopcion-wizard__step-number">
            <v-icon v-if="pasoActual > index + 1" size="small">mdi-check</v-icon>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="formulario-adopcion-wizard__step-title">{{ titulo }}</span>
        </div>
      </div>
    </div>

    <v-card-text class="formulario-adopcion-wizard__contenido">
      <v-form 
        ref="form"
        @submit.prevent="pasoActual === totalPasos ? enviarSolicitud() : siguientePaso()"
        class="formulario-adopcion-wizard__form"
        validate-on="submit"
      >
        <!-- Paso 1: Información Personal -->
        <div v-if="pasoActual === 1" class="formulario-adopcion-wizard__paso">
          <h3 class="formulario-adopcion-wizard__paso-titulo">{{ titulosPasos[0] }}</h3>
          
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
        </div>

        <!-- Paso 2: Información de Vivienda -->
        <div v-if="pasoActual === 2" class="formulario-adopcion-wizard__paso">
          <h3 class="formulario-adopcion-wizard__paso-titulo">{{ titulosPasos[1] }}</h3>
          
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
        </div>

        <!-- Paso 3: Experiencia con Mascotas -->
        <div v-if="pasoActual === 3" class="formulario-adopcion-wizard__paso">
          <h3 class="formulario-adopcion-wizard__paso-titulo">{{ titulosPasos[2] }}</h3>

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

        <!-- Paso 4: Compromiso y Responsabilidad -->
        <div v-if="pasoActual === 4" class="formulario-adopcion-wizard__paso">
          <h3 class="formulario-adopcion-wizard__paso-titulo">{{ titulosPasos[3] }}</h3>

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

        <!-- Botones de navegación -->
        <div class="formulario-adopcion-wizard__navegacion">
          <div class="formulario-adopcion-wizard__navegacion-left">
            <v-btn
              color="error"
              variant="outlined"
              @click="emit('cancel')"
              :disabled="enviando"
            >
              Cancelar
            </v-btn>
          </div>
          
          <div class="formulario-adopcion-wizard__navegacion-right">
            <v-btn
              v-if="pasoActual > 1"
              variant="outlined"
              @click="pasoAnterior"
              :disabled="enviando"
              class="mr-2"
            >
              Anterior
            </v-btn>
            
            <v-btn
              v-if="pasoActual < totalPasos"
              color="primary"
              @click="siguientePaso"
              :disabled="enviando"
            >
              Siguiente
            </v-btn>
            
            <v-btn
              v-if="pasoActual === totalPasos"
              color="success"
              @click="enviarSolicitud"
              :loading="enviando"
            >
              Enviar solicitud
            </v-btn>
          </div>
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
.formulario-adopcion-wizard {
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

  &__progreso {
    padding: 16px 20px 8px;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  &__stepper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    gap: 8px;
    
    @media (max-width: 768px) {
      flex-wrap: wrap;
      gap: 4px;
    }
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px 4px;
    border-radius: 8px;
    flex: 1;
    min-width: 0;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    &--active {
      .formulario-adopcion-wizard__step-number {
        background-color: $color-principal;
        color: white;
        border-color: $color-principal;
      }
      
      .formulario-adopcion-wizard__step-title {
        color: $color-principal;
        font-weight: 600;
      }
    }

    &--completed {
      .formulario-adopcion-wizard__step-number {
        background-color: #4caf50;
        color: white;
        border-color: #4caf50;
      }
      
      .formulario-adopcion-wizard__step-title {
        color: #4caf50;
      }
    }
  }

  &__step-number {
    width: 32px;
    height: 32px;
    border: 2px solid #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    background-color: white;
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }

  &__step-title {
    font-size: 11px;
    text-align: center;
    color: #666;
    line-height: 1.2;
    word-break: break-word;
    
    @media (max-width: 768px) {
      font-size: 10px;
    }
  }

  &__contenido {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__paso {
    flex: 1;
    background: #f8f8f8;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  &__paso-titulo {
    color: $color-principal;
    font-size: 1.3rem;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid $color-principal;
    font-weight: 600;
  }

  &__navegacion {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    margin-top: auto;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    background: white;
    position: sticky;
    bottom: 0;
  }

  &__navegacion-left,
  &__navegacion-right {
    display: flex;
    gap: 8px;
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
}

@media (prefers-color-scheme: dark) {
  .formulario-adopcion-wizard {
    background: #272727;
    color: white;

    &__progreso {
      background: #272727;
      border-bottom-color: rgba(255, 255, 255, 0.12);
    }

    &__paso {
      background: #1e1e1e;
    }

    &__navegacion {
      background: #272727;
      border-top-color: rgba(255, 255, 255, 0.12);
    }

    &__step {
      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
    }

    &__step-number {
      background-color: #272727;
      border-color: #555;
    }

    &__step-title {
      color: #ccc;
    }
  }
}

@media (max-width: 480px) {
  .formulario-adopcion-wizard {
    &__step-title {
      display: none;
    }
    
    &__step-number {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
    
    &__navegacion {
      flex-direction: column;
      gap: 12px;
      
      &-left,
      &-right {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>