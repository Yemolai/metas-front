import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Painel from '@/views/Painel'
import Meta from '@/views/Meta'
import Diretoria from '@/views/Diretoria'
import Coordenadoria from '@/views/Coordenadoria'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/painel',
      name: 'Painel',
      component: Painel
    },
    { // por enquanto o :year está sendo ignorado
      path: '/:setor/:coordenadoria/:year/:meta',
      name: 'Meta',
      component: Meta,
      props: true
    }, {
      path: '/:setorId',
      name: 'Diretoria',
      component: Diretoria,
      props: true
    }, {
      path: '/:setorId/:coordId',
      name: 'Coordenadoria',
      component: Coordenadoria,
      props: true
    }
  ]
})
