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

// Establecer el idioma por defecto como español si no hay ninguno guardado
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
    apellido: "Apellido",
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
    cerrar_sesion: "Cerrar Sesión",
    error_contraseñas_vacias: "Introduce y repite la nueva contraseña",
    error_contraseñas_no_coinciden: "Las contraseñas no coinciden",
    error_contraseña_invalida: "La contraseña debe tener al menos 7 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo.",
    error_cambiar_contraseña: "Error al cambiar la contraseña",
    contraseña_actualizada: "Contraseña actualizada con éxito",

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
    protectoras_titulo: "Protectoras que participan",
    protectora_direccion: "Dirección",
    protectora_correo: "Correo",
    protectora_telefono: "Teléfono",
    protectora_horario: "Horario",
    protectora_descripcion: "Descripción",
    protectora_requisitos: "Requisitos de adopción",
    protectora_proceso: "Proceso de adopción",
    protectora_necesidades: "Necesidades actuales",
    protectora_voluntariado: "Información sobre voluntariado",
    pagina_protectora: "Pagina web",
    protectora_donaciones: "Donaciones",
    protectora_ubicacion: "Ubicación",
    protectora_contactar: "Contactar",
    volver_protectoras: "Volver a protectoras",

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
    no_disponible: "No disponible",
    // FAQ
    faq_titulo: "Preguntas Frecuentes (FAQ)",
    faq_plataforma: "Sobre la plataforma",
    faq_adopcion: "Sobre el proceso de adopción",
    faq_gatos: "Sobre los gatos",
    faq_web: "Sobre la web y su uso",
    
    // FAQ - Sobre la plataforma
    faq_que_es: "¿Qué es esta página?",
    faq_que_es_respuesta: "Es una plataforma que reúne a todas las protectoras de Zaragoza para facilitar la adopción responsable de gatos.",
    faq_como_funciona: "¿Cómo funciona la web?",
    faq_como_funciona_respuesta: "Puedes ver los gatos en adopción, conocer más sobre ellos y contactar con la protectora responsable para iniciar el proceso de adopción.",
    faq_pertenece: "¿La web pertenece a una protectora específica?",
    faq_pertenece_respuesta: "No, la plataforma centraliza información de varias protectoras de Zaragoza para que sea más fácil encontrar gatos en adopción.",

    // FAQ - Sobre el proceso de adopción
    faq_como_adoptar: "¿Cómo puedo adoptar un gato?",
    faq_como_adoptar_respuesta: "Selecciona el gato que te interesa, contacta con la protectora correspondiente y sigue los pasos que ellos te indiquen.",
    faq_coste: "¿Cuánto cuesta adoptar un gato?",
    faq_coste_respuesta: "Depende de cada protectora. Algunas piden una donación para cubrir gastos veterinarios como vacunas, desparasitación y esterilización.",
    faq_requisitos: "¿Cuáles son los requisitos para adoptar?",
    faq_requisitos_respuesta: "Cada protectora tiene sus requisitos, pero generalmente incluyen ser mayor de edad, tener un entorno adecuado para el gato y comprometerse a su bienestar.",
    faq_fuera: "¿Puedo adoptar si vivo fuera de Zaragoza?",
    faq_fuera_respuesta: "Algunas protectoras permiten adopciones fuera de la ciudad, pero puede haber requisitos adicionales como una visita previa al hogar.",
    faq_otros_animales: "¿Puedo adoptar si ya tengo otros animales?",
    faq_otros_animales_respuesta: "Sí, pero la protectora evaluará si el gato es compatible con otros animales en el hogar.",

    // FAQ - Sobre los gatos
    faq_vacunados: "¿Los gatos están vacunados y esterilizados?",
    faq_vacunados_respuesta: "La mayoría de las protectoras entregan a los gatos vacunados, desparasitados y esterilizados (o con compromiso de esterilización si son muy jóvenes).",
    faq_conocer: "¿Puedo conocer al gato antes de adoptarlo?",
    faq_conocer_respuesta: "Sí, la protectora te indicará cómo y dónde conocer al gato en persona.",
    faq_adaptacion: "¿Qué pasa si el gato no se adapta a mi hogar?",
    faq_adaptacion_respuesta: "Las protectoras suelen ofrecer asesoramiento y un periodo de adaptación. En caso extremo, podrían aceptar la devolución del gato para buscarle otra familia.",
    faq_personalidad: "¿Hay gatos sociables y otros más independientes?",
    faq_personalidad_respuesta: "Sí, cada gato tiene una personalidad única. Puedes preguntar a la protectora por el temperamento del gato antes de adoptarlo.",

    // FAQ - Sobre la web y su uso
    faq_contacto: "¿Cómo puedo contactar con una protectora?",
    faq_contacto_respuesta: "En la ficha de cada gato encontrarás un botón para contactar con la protectora correspondiente.",
    faq_desaparecen: "¿Por qué algunos gatos desaparecen de la lista?",
    faq_desaparecen_respuesta: "Porque han sido adoptados o ya no están disponibles.",
    faq_voluntario: "¿Puedo hacerme voluntario en una protectora?",
    faq_voluntario_respuesta: "Sí, muchas protectoras buscan voluntarios. Contacta directamente con ellas para más información.",
    faq_donacion: "¿Puedo hacer una donación a la web o a las protectoras?",
    faq_donacion_respuesta: "La web no gestiona donaciones, pero cada protectora puede aceptar ayuda económica o en especie (alimento, arena, etc.).",
    faq_problema: "¿Cómo puedo reportar un problema en la web?",
    faq_problema_respuesta: "Si encuentras un error o tienes sugerencias, puedes enviarnos un email a info@adopcioneszaragoza.com.",

    // Filtros
    filtros_titulo: "¿Buscas algo concreto?",
    filtros_edad: "Filtrar por edad",
    filtros_años: "años",
    filtros_raza: "Filtrar por raza",
    filtros_raza_gato: "Raza del gato",
    filtros_seleccionar_raza: "Seleccionar raza",
    filtros_mostrar_todas: "Mostrar todas las razas",
    filtros_aplicar: "APLICAR FILTROS",
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
    apellido: "Last name",
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
    cerrar_sesion: "Log Out",
    error_contraseñas_vacias: "Enter and repeat the new password",
    error_contraseñas_no_coinciden: "Passwords do not match",
    error_contraseña_invalida: "Password must be at least 7 characters long, including uppercase, lowercase, numbers and a symbol.",
    error_cambiar_contraseña: "Error changing password",
    contraseña_actualizada: "Password successfully updated",

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
    no_disponible: "Not available",
    // FAQ
    faq_titulo: "Frequently Asked Questions (FAQ)",
    faq_plataforma: "About the platform",
    faq_adopcion: "About the adoption process",
    faq_gatos: "About the cats",
    faq_web: "About the website and its use",
    
    // FAQ - About the platform
    faq_que_es: "What is this website?",
    faq_que_es_respuesta: "It's a platform that brings together all the shelters in Zaragoza to facilitate responsible cat adoption.",
    faq_como_funciona: "How does the website work?",
    faq_como_funciona_respuesta: "You can view cats available for adoption, learn more about them, and contact the responsible shelter to start the adoption process.",
    faq_pertenece: "Does the website belong to a specific shelter?",
    faq_pertenece_respuesta: "No, the platform centralizes information from various shelters in Zaragoza to make it easier to find cats for adoption.",

    // FAQ - About the adoption process
    faq_como_adoptar: "How can I adopt a cat?",
    faq_como_adoptar_respuesta: "Select the cat you're interested in, contact the corresponding shelter, and follow their instructions.",
    faq_coste: "How much does it cost to adopt a cat?",
    faq_coste_respuesta: "It depends on each shelter. Some ask for a donation to cover veterinary expenses such as vaccines, deworming, and neutering.",
    faq_requisitos: "What are the requirements for adopting?",
    faq_requisitos_respuesta: "Each shelter has its requirements, but generally they include being of legal age, having a suitable environment for the cat, and committing to its well-being.",
    faq_fuera: "Can I adopt if I live outside Zaragoza?",
    faq_fuera_respuesta: "Some shelters allow adoptions outside the city, but there may be additional requirements such as a home visit.",
    faq_otros_animales: "Can I adopt if I already have other pets?",
    faq_otros_animales_respuesta: "Yes, but the shelter will evaluate if the cat is compatible with other pets in the home.",

    // FAQ - About the cats
    faq_vacunados: "Are the cats vaccinated and neutered?",
    faq_vacunados_respuesta: "Most shelters deliver cats vaccinated, dewormed, and neutered (or with a commitment to neutering if they're very young).",
    faq_conocer: "Can I meet the cat before adopting?",
    faq_conocer_respuesta: "Yes, the shelter will tell you how and where to meet the cat in person.",
    faq_adaptacion: "What if the cat doesn't adapt to my home?",
    faq_adaptacion_respuesta: "Shelters usually offer guidance and an adaptation period. In extreme cases, they might accept returning the cat to find it another family.",
    faq_personalidad: "Are there sociable cats and more independent ones?",
    faq_personalidad_respuesta: "Yes, each cat has a unique personality. You can ask the shelter about the cat's temperament before adopting.",

    // FAQ - About the website and its use
    faq_contacto: "How can I contact a shelter?",
    faq_contacto_respuesta: "On each cat's profile, you'll find a button to contact the corresponding shelter.",
    faq_desaparecen: "Why do some cats disappear from the list?",
    faq_desaparecen_respuesta: "Because they have been adopted or are no longer available.",
    faq_voluntario: "Can I become a volunteer at a shelter?",
    faq_voluntario_respuesta: "Yes, many shelters are looking for volunteers. Contact them directly for more information.",
    faq_donacion: "Can I make a donation to the website or shelters?",
    faq_donacion_respuesta: "The website doesn't handle donations, but each shelter can accept financial or in-kind help (food, litter, etc.).",
    faq_problema: "How can I report a problem on the website?",
    faq_problema_respuesta: "If you find an error or have suggestions, you can send us an email at info@adopcioneszaragoza.com.",

    // Protectoras
    protectoras_titulo: "Participating Shelters",
    protectora_direccion: "Address",
    protectora_correo: "Email",
    protectora_telefono: "Phone",
    protectora_horario: "Opening Hours",
    protectora_descripcion: "Description",
    protectora_requisitos: "Adoption Requirements",
    protectora_proceso: "Adoption Process",
    protectora_necesidades: "Current Needs",
    protectora_voluntariado: "Volunteering Information",
    pagina_protectora: "Website",
    protectora_donaciones: "Donations",
    protectora_ubicacion: "Location",
    protectora_contactar: "Contact",
    volver_protectoras: "Back to shelters",

    // Filters
    filtros_titulo: "Looking for something specific?",
    filtros_edad: "Filter by age",
    filtros_años: "years",
    filtros_raza: "Filter by breed",
    filtros_raza_gato: "Cat breed",
    filtros_seleccionar_raza: "Select breed",
    filtros_mostrar_todas: "Show all breeds",
    filtros_aplicar: "APPLY FILTERS",
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
