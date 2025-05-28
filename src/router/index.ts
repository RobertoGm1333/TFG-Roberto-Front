import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GatoView from '@/views/GatoView.vue'
import DetallesGatoView from '@/views/DetallesGatoView.vue'
import FAQ from '@/views/FAQView.vue'
import PerfilView from '@/views/PerfilView.vue'
import DeseadosView from '@/views/DeseadosView.vue'
import SolicitudesView from '@/views/SolicitudesView.vue'
import Iniciar_sesionView from '@/views/Iniciar_sesionView.vue'
import RegistrarseView from '@/views/RegistrarseView.vue'
import AdminView from '../views/AdminView.vue'
import GestionGatosView from '@/views/GestionGatosView.vue'
import GestionProtectorasView from '../views/GestionProtectorasView.vue'
import ConsejosExpertos from '@/views/ConsejosExpertosView.vue'
import GestionUsuariosView from '../views/GestionUsuariosView.vue'
import { useAutenticacion } from '@/stores/Autentificacion'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/protectoras',
      name: 'protectoras',
      component: () => import('@/views/ProtectorasView.vue')
    },
    {
      path: '/protectora/:id',
      name: 'protectora-details',
      component: () => import('@/views/DetallesProtectoraView.vue')
    },
    {
      path: '/detalles-gato/:id',
      name: 'DetallesGato',
      component: DetallesGatoView,
      props: true
    },
    {
      path: '/gato',
      name: 'gato',
      component: GatoView,
    },
    {
      path: "/faq",
      name: "FAQ",
      component: FAQ,
    },
    {
      path: "/Consejos-Expertos",
      name: "Consejos-Expertos",
      component: ConsejosExpertos,
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: PerfilView,
    },
    {
      path: '/deseados',
      name: 'deseados',
      component: DeseadosView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/solicitudes',
      name: 'solicitudes',
      component: SolicitudesView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/iniciar-sesion',
      name: 'iniciar-sesion',
      component: Iniciar_sesionView,
    },
    {
      path: '/registrarse',
      name: 'registrarse',
      component: RegistrarseView,
    },
    {
      path: '/protectora-admin',
      name: 'protectora-admin',
      component: () => import('@/views/ProtectoraAdminView.vue'),
      meta: { requiereProtectora: true }
    },
    {
      path: '/admin',
      name: 'administrador',
      component: AdminView,
      meta: { requiereAdmin: true },
      children: [
        {
          path: 'gestion-gatos',
          component: GestionGatosView
        },
        {
          path: 'gestion-protectoras',
          component: GestionProtectorasView
        },
        {
          path: 'gestion-usuarios',
          component: GestionUsuariosView
        }
      ]
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const autenticacionStore = useAutenticacion()

  // Redirección si necesita login
  if (to.meta.requiresAuth && !autenticacionStore.esAutenticado) {
    return next('/iniciar-sesion')
  }

  // Redirección si requiere rol admin y no lo es
  if (to.meta.requiereAdmin && (!autenticacionStore.usuario || autenticacionStore.usuario.rol !== 'admin')) {
    return next('/')
  }

  if (to.meta.requiereProtectora && (!autenticacionStore.usuario || autenticacionStore.usuario.rol !== 'protectora')) {
    return next('/')
  }

  next()
})

export default router
