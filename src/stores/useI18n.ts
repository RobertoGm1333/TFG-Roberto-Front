import { ref } from 'vue'

type Idioma = 'es' | 'en'
type Traducciones = {
  [key in Idioma]: {
    [clave: string]: string
  }
}

interface TranslationParams {
  [key: string]: string | number;
}

const idioma = ref<Idioma>((localStorage.getItem('idioma') as Idioma) || 'es')

const traducciones: Traducciones = {
  es: {
    // Home
    quienes_1: "Nosotros somos AdoptAragón, un espacio dedicado a conectar a los gatos en adopción de Zaragoza con personas que desean darles un hogar. Nuestro propósito es servir como un punto de encuentro entre las protectoras locales y quienes buscan adoptar, facilitando así el proceso de adopción responsable y brindando mayor visibilidad a los felinos que esperan una segunda oportunidad.",
    quienes_2: "Colaboramos con distintas protectoras de Zaragoza, recopilando y mostrando en un solo lugar información sobre los gatos en adopción. Esto facilita que las personas interesadas en adoptar puedan encontrar a su compañero felino ideal de manera más sencilla y eficiente.",
    quienes_3: "Cada gato en nuestra plataforma tiene su propia historia y personalidad única. Trabajamos para asegurarnos de que cada perfil proporcione información detallada y actualizada, permitiendo a los potenciales adoptantes tomar decisiones informadas.",
    quienes_4: "Si estás pensando en adoptar un gato, te invitamos a explorar nuestra plataforma. Cada adopción no solo cambia la vida de un gato, sino también la del adoptante. ¡Encuentra a tu compañero perfecto!",
    ver_gatos: "Ver gatos disponibles",

    // Navegación
    iniciar_sesion: "Iniciar sesión",
    registrarse: "Registrarse",
    gatos: "Gatos",
    protectoras: "Protectoras",
    mi_perfil: "Mi Perfil",
    deseados: "Deseados",
    solicitudes: "Solicitudes",
    panel_admin: "Panel de Admin",
    panel_protectora: "Panel de Protectora",
    cerrar_sesion: "Cerrar Sesión",

    // Formularios
    email: "Correo electrónico",
    contraseña: "Contraseña",
    confirmar_contraseña: "Confirmar Contraseña",
    nombre: "Nombre",
    apellidos: "Apellidos",
    entrar: "Entrar",
    campos_obligatorios: "Todos los campos son obligatorios",
    contraseñas_no_coinciden: "Las contraseñas no coinciden",
    contraseña_invalida: "La contraseña debe tener al menos 7 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo.",
    error_registro: "Error al registrar usuario",
    registro_exitoso: "Registro exitoso. Redirigiendo...",
    error_inicio_sesion: "Correo electrónico o contraseña incorrectos",
    inicio_sesion_exitoso: "Inicio de sesión exitoso. Redirigiendo...",
    error_inesperado: "Ha ocurrido un error inesperado",

    // Perfil
    cambiar_contraseña: "Cambiar Contraseña",
    nueva_contraseña: "Nueva contraseña",
    repetir_contraseña: "Repite la contraseña",
    actualizar: "Actualizar",
    contraseña_actualizada: "Contraseña actualizada con éxito",
    error_actualizar_contraseña: "Error al cambiar la contraseña",

    // Gatos
    edad: "Edad",
    años: "años",
    sexo: "Sexo",
    macho: "Macho",
    hembra: "Hembra",
    raza: "Raza",
    esterilizado: "Esterilizado",
    descripcion: "Descripción",
    añadir_deseados: "Añadir a Deseados",
    eliminar_deseados: "Eliminar de Deseados",
    volver_gatos: "Volver a gatos",
    contactar_protectora: "Contactar Protectora",
    adoptar: "Adoptar",
    no_gatos_filtro: "Todavía no tenemos gatos que cumplan estas condiciones.",

    // Protectoras
    direccion: "Dirección",
    correo: "Correo",
    telefono: "Teléfono",

    // Footer
    desarrollado_por: "Desarrollado con ❤️ por",
    derechos_reservados: "Todos los derechos reservados.",
    preguntas_frecuentes: "Preguntas Frecuentes",
    footer_info: "Esta plataforma reúne a todas las protectoras de Zaragoza para facilitar la adopción responsable de animales.",
    hola: "Hola",
    conoceme: "¡Soy {nombre}! ¡Conóceme! 🐾",
    cargando: "Cargando...",
    gato_no_encontrado: "No se encontró el gato.",
    login_adoptar: "Para solicitar la adopción de {nombre}, necesitas iniciar sesión.",
    solicitudes_adopcion: "Solicitudes de adopción para {nombre}",
    no_solicitudes: "No hay solicitudes de adopción para este gato.",
    solicitante: "Solicitante",
    fecha: "Fecha",
    acciones: "Acciones",
    ver_detalles: "Ver detalles",
    ya_solicitado: "Ya has solicitado adoptar a {nombre}",
    estado_solicitud: "Estado de tu solicitud",
    pendiente: "Pendiente",
    aceptada: "Aceptada",
    rechazada: "Rechazada",
    ver_solicitudes: "Ver todas mis solicitudes",
    rellenar_solicitud: "Rellenar solicitud de adopción",
    protectora: "Protectora",
    no_disponible: "No disponible"
  },
  en: {
    // Home
    quienes_1: "We are AdoptAragón, a space dedicated to connecting cats for adoption in Zaragoza with people who want to give them a home. Our purpose is to serve as a meeting point between local shelters and those looking to adopt, thus facilitating the responsible adoption process and providing greater visibility to felines waiting for a second chance.",
    quienes_2: "We collaborate with various shelters in Zaragoza, collecting and displaying information about cats for adoption in one place. This makes it easier for people interested in adopting to find their ideal feline companion more simply and efficiently.",
    quienes_3: "Each cat on our platform has its own unique history and personality. We work to ensure that each profile provides detailed and up-to-date information, allowing potential adopters to make informed decisions.",
    quienes_4: "If you're thinking about adopting a cat, we invite you to explore our platform. Each adoption not only changes a cat's life but also the adopter's. Find your perfect companion!",
    ver_gatos: "See available cats",

    // Navigation
    iniciar_sesion: "Login",
    registrarse: "Register",
    gatos: "Cats",
    protectoras: "Shelters",
    mi_perfil: "My Profile",
    deseados: "Wishlist",
    solicitudes: "Applications",
    panel_admin: "Admin Panel",
    panel_protectora: "Shelter Panel",
    cerrar_sesion: "Logout",

    // Forms
    email: "Email",
    contraseña: "Password",
    confirmar_contraseña: "Confirm Password",
    nombre: "Name",
    apellidos: "Surname",
    entrar: "Log in",
    campos_obligatorios: "All fields are required",
    contraseñas_no_coinciden: "Passwords do not match",
    contraseña_invalida: "Password must be at least 7 characters long, including uppercase, lowercase, numbers and a symbol.",
    error_registro: "Error registering user",
    registro_exitoso: "Registration successful. Redirecting...",
    error_inicio_sesion: "Incorrect email or password",
    inicio_sesion_exitoso: "Login successful. Redirecting...",
    error_inesperado: "An unexpected error has occurred",

    // Profile
    cambiar_contraseña: "Change Password",
    nueva_contraseña: "New password",
    repetir_contraseña: "Repeat password",
    actualizar: "Update",
    contraseña_actualizada: "Password successfully updated",
    error_actualizar_contraseña: "Error changing password",

    // Cats
    edad: "Age",
    años: "years old",
    sexo: "Sex",
    macho: "Male",
    hembra: "Female",
    raza: "Breed",
    esterilizado: "Neutered",
    descripcion: "Description",
    añadir_deseados: "Add to Wishlist",
    eliminar_deseados: "Remove from Wishlist",
    volver_gatos: "Back to cats",
    contactar_protectora: "Contact Shelter",
    adoptar: "Adopt",
    no_gatos_filtro: "We don't have any cats that meet these conditions yet.",

    // Shelters
    direccion: "Address",
    correo: "Email",
    telefono: "Phone number",

    // Footer
    desarrollado_por: "Developed with ❤️ by",
    derechos_reservados: "All rights reserved.",
    preguntas_frecuentes: "FAQ",
    footer_info: "This platform brings together all the shelters in Zaragoza to facilitate responsible animal adoption.",
    hola: "Hello",
    conoceme: "Hi! I'm {nombre}! Meet me! 🐾",
    cargando: "Loading...",
    gato_no_encontrado: "Cat not found.",
    login_adoptar: "To request the adoption of {nombre}, you need to log in.",
    solicitudes_adopcion: "Adoption applications for {nombre}",
    no_solicitudes: "There are no adoption applications for this cat.",
    solicitante: "Applicant",
    fecha: "Date",
    acciones: "Actions",
    ver_detalles: "View details",
    ya_solicitado: "You have already applied to adopt {nombre}",
    estado_solicitud: "Application status",
    pendiente: "Pending",
    aceptada: "Accepted",
    rechazada: "Rejected",
    ver_solicitudes: "View all my applications",
    rellenar_solicitud: "Fill adoption application",
    protectora: "Shelter",
    no_disponible: "Not available"
  }
}

export function useI18n() {
  const t = (clave: string, params?: TranslationParams): string => {
    let translation = traducciones[idioma.value][clave] || clave;
    
    if (params) {
      Object.keys(params).forEach(key => {
        translation = translation.replace(`{${key}}`, String(params[key]));
      });
    }
    
    return translation;
  }

  const cambiarIdioma = () => {
    idioma.value = idioma.value === 'es' ? 'en' : 'es'
    localStorage.setItem('idioma', idioma.value)
  }

  return {
    t,
    cambiarIdioma,
    idioma
  }
}
