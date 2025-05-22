import { ref } from 'vue'

type Idioma = 'es' | 'en'
type Traducciones = {
  [key in Idioma]: {
    [clave: string]: string
  }
}

const idioma = ref<Idioma>((localStorage.getItem('idioma') as Idioma) || 'es')

const traducciones: Traducciones = {
  es: {
    quienes_1: "Nosotros somos AdoptAragón, un espacio dedicado a conectar a los gatos en adopción de Zaragoza con personas que desean darles un hogar. Nuestro propósito es servir como un punto de encuentro entre las protectoras locales y quienes buscan adoptar, facilitando así el proceso de adopción responsable y brindando mayor visibilidad a los felinos que esperan una segunda oportunidad.",
    quienes_2: "Colaboramos con distintas protectoras de Zaragoza, recopilando y mostrando en un solo lugar información sobre los gatos en adopción. Aquí encontrarás fotos, descripciones y datos de contacto para que puedas conocer a cada uno de ellos y ponerte en contacto con la protectora correspondiente de manera sencilla.",
    quienes_3: "Nuestra misión es no solo facilitar las adopciones, sino también dar voz a las protectoras, apoyando su labor y concienciando sobre la importancia de la adopción responsable. Cada gato que aparece aquí tiene una historia, un pasado que muchas veces ha sido difícil, pero lo más importante: un futuro lleno de cariño que puede comenzar contigo.",
    quienes_4: "Si estás pensando en adoptar o simplemente quieres conocer más sobre la labor de las protectoras, te invitamos a explorar nuestra web y ayudar a estos pequeños a encontrar un hogar.",
    ver_gatos: "Ver gatos en adopción"
  },
  en: {
    quienes_1: "We are AdoptAragón, a space dedicated to connecting adoptable cats in Zaragoza with people who want to give them a home. Our purpose is to serve as a meeting point between local shelters and those looking to adopt, facilitating responsible adoptions and giving greater visibility to the felines waiting for a second chance.",
    quienes_2: "We collaborate with various shelters in Zaragoza, gathering and displaying in one place information about adoptable cats. Here you’ll find photos, descriptions, and contact details so you can get to know each one and easily reach the corresponding shelter.",
    quienes_3: "Our mission is not only to facilitate adoptions, but also to give voice to the shelters, supporting their work and raising awareness about the importance of responsible adoption. Every cat that appears here has a story, often a difficult past, but most importantly: a future full of love that can begin with you.",
    quienes_4: "If you're thinking of adopting or simply want to learn more about the work of the shelters, we invite you to explore our website and help these little ones find a home.",
    ver_gatos: "See cats for adoption"
  }
}

export function useI18n() {
  const t = (clave: string): string => {
    return traducciones[idioma.value][clave] || clave
  }

  const cambiarIdioma = () => {
    idioma.value = idioma.value === 'es' ? 'en' : 'es'
    localStorage.setItem('idioma', idioma.value)
  }

  return { idioma, t, cambiarIdioma }
}
