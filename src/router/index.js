import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import plaintes from '../views/pages/plaintes/plaintes.vue'
import pvs from '../views/pages/pvs/pvs.vue'
import traiter from '../views/pages/Gestion_dossiers/affecter_dossier.vue'
import suivi from '../views/pages/Gestion_dossiers/suivi_traitement.vue'
import consulter_mes_dossiers from '../views/pages/Gestion_dossiers/consulter_mes_dossiers.vue'
import statistique_dossiers from '../views/pages/Gestion_dossiers/statistique_dossiers.vue'
import Admin_dossiers from '../views/pages/Gestion_dossiers/Admin_dossiers.vue'
import Gestion_user from '../views/pages/Gestion_dossiers/Gestion_user.vue'
import archive from '../views/pages/Gestion_dossiers/archive.vue'
import Middlewares from '../middlewares/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      middleware: [Middlewares.auth]
    },
    children: [
      {
        path: 'plaintes',
        name: 'plaintes',
        component: plaintes,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'pvs',
        name: 'pvs',
        component: pvs,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'traiter',
        name: 'traiter',
        component: traiter,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'suivi',
        name: 'suivi',
        component: suivi,
        meta: {
          middleware: [Middlewares.auth]
        }
      },

      {
        path: 'mes_dossiers',
        name: 'mes_dossiers',
        component: consulter_mes_dossiers,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'statistique',
        name: 'statistique',
        component: statistique_dossiers,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'adminDossiers',
        name: 'adminDossiers',
        component:Admin_dossiers,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'GesyionUser',
        name: 'GesyionUser',
        component:Gestion_user,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
      {
        path: 'archive',
        name: 'archive',
        component:archive,
        meta: {
          middleware: [Middlewares.auth]
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "rogin" */ '../views/auth/Login.vue'),
    meta: {
      middleware: [Middlewares.guest]
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function nextCheck(context, middleware, index) {
  const nextMiddleware = middleware[index];

  if(!nextMiddleware) return context.next;

  return (...parameters) => {
    context.next(...parameters);
    const nextMidd = nextCheck(context, middleware, index +1);
    nextMiddleware({context, nextMidd})
  }
}

router.beforeEach( (to, from, next) => {
  if(to.meta.middleware) {
      const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware :
      [to.meta.middleware];

      const ctx = {
        from, 
        next,
        router,
        to
      };

      const nextMiddleware = nextCheck(ctx, middleware, 1);
      return middleware[0]({...ctx, nextMiddleware})
  }
  return next();
});

export default router
