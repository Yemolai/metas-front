import Vue from 'vue'
import Router from 'vue-router'
/* Views: */
import AddCoordenadoria from '@/views/AddCoordenadoria'
import AddMeta from '@/views/AddMeta'
import AddSetor from '@/views/AddSetor'
import AddUser from '@/views/AddUser'
import Coordenadoria from '@/views/Coordenadoria'
import Home from '@/views/Home'
import ListaDiretorias from '@/views/Diretorias'
import Login from '@/views/Login'
import Meta from '@/views/Meta'
import Painel from '@/views/Painel'
import PainelDesempenho from '@/views/Desempenho'
import PainelResultados from '@/views/Resultados'
import Perfil from '@/views/Perfil'
import Setor from '@/views/Setor'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { // meta-fields
        requireAuth: true // flag de rota protegida
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user/:userId(\\d+)',
      name: 'Perfil',
      component: Perfil,
      props: true
    },
    {
      path: '/diretorias',
      name: 'Diretorias',
      component: ListaDiretorias
    },
    {
      path: '/painel/',
      name: 'Painel',
      component: Painel
    }, {
      path: '/user/add',
      name: 'AddUser',
      component: AddUser,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/painel/resultados/:setor?/:page?',
      name: 'PainelResultados',
      component: PainelResultados,
      props: true
    },
    {
      // path: '/painel/:setor(\\w+)?/:coordenadoria(\\w+)?/:page(\\d+)?',
      path: '/painel/desempenho/:setor?/:coordenadoria?/:page?',
      name: 'PainelDesempenho',
      component: PainelDesempenho,
      props: true
    },
    { // por enquanto o :year está sendo ignorado
      path: '/:setor(\\w+)/:coordenadoria(\\w+)/:year(\\d+)/:meta(\\d+)',
      name: 'Meta',
      component: Meta,
      props: true
    }, {
      path: '/view/:setorId(\\d+)',
      name: 'Setor',
      component: Setor,
      props: true
    }, {
      path: '/view/:setorId(\\d+)/:coordId(\\d+)',
      name: 'Coordenadoria',
      component: Coordenadoria,
      props: true
    }, {
      path: '/add',
      name: 'AddSetor',
      component: AddSetor,
      props: true,
      meta: {
        requireAuth: true, // flag de rota protegida
        permission: 'setor_create' // permissao especifica
      }
    }, {
      path: '/:setorId(\\d+)/add',
      name: 'AddCoordenadoria',
      component: AddCoordenadoria,
      props: true,
      meta: {
        requireAuth: true,
        permission: 'coord_create'
      }
    }, {
      path: '/:setor(\\w+)/:coordenadoria(\\w+)/add',
      name: 'AddMeta',
      component: AddMeta,
      props: true,
      meta: {
        requireAuth: true,
        permission: 'meta_create'
      }
    }
  ]
})

// vue-router beforeEach navigation guard hook (have no "this" vue-component)
router.beforeEach((to, from, next) => {
  let app = router.app.$children[0]
  // se estiver indo para Login e estiver autenticado, redirecione
  if (to.name === 'Login' && app && app.usuario) {
    next(to.query.redirect || { name: 'Home' })
  }
  // se estiver tentando entrar em rota protegida
  if (to.matched.some(record => record.meta.requireAuth)) {
    // se não estiver autenticado redirecione para Login
    if (!(app && app.token)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else { // se estiver autenticado
      // verifique se a rota exige permissoes especificas
      if (to.matched.some(record => record.meta.permission)) {
        // se o usuario tiver permissao, continue
        if (app.usuario.permissoes[to.meta.permission]) {
          next()
        } else { // caso contrario, alerte e cancele
          alert('Você não tem autorização para isso')
          next(false)
        }
      } else {
        // se a rota não exige permissoes especificas, continue
        next()
      }
    }
  } else {
    // se a rota não for protegida, continue
    next()
  }
})

export default router
