import Vue from 'vue'
import Router from 'vue-router'
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
import Setor from '@/views/Setor'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
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
      component: AddUser
    }, {
      // path: '/painel/:setor(\\w+)?/:page(\\d+)?',
      path: '/painel/resultados/:setor?/:page?',
      name: 'PainelResultados',
      component: PainelResultados,
      props: true
    },
    {
      // path: '/painel/:setor(\\w+)?/:coordenadoria(\\w+)?/:page(\\d+)?',
      path: '/painel/desempenho/:coordenadoria?',
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
      props: true
    }, {
      path: '/:setorId(\\d+)/add',
      name: 'AddCoordenadoria',
      component: AddCoordenadoria,
      props: true
    }, {
      path: '/:setor(\\w+)/:coordenadoria(\\w+)/add',
      name: 'AddMeta',
      component: AddMeta,
      props: true
    }
  ]
})

router.beforeEach(function (to, from, next) {
  // Utilizar este método para definir quais rotas são privadas
  // console.log('to:', to)
  // console.log('from:', from)
  switch (to) {
    default:
      return next()
  }
})

export default router
