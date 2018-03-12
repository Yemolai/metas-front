import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Painel from '@/views/Painel'
import PainelResultados from '@/views/Resultados'
import PainelDesempenho from '@/views/Desempenho'
import Meta from '@/views/Meta'
import Setor from '@/views/Setor'
import Coordenadoria from '@/views/Coordenadoria'
import AddSetor from '@/views/AddSetor'
import AddCoordenadoria from '@/views/AddCoordenadoria'
import AddMeta from '@/views/AddMeta'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/painel/',
      name: 'Painel',
      component: Painel
    },
    {
      // path: '/painel/:setor(\\w+)?/:page(\\d+)?',
      path: '/painel/resultados/:setor?',
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
      path: '/view/:setorId',
      name: 'Setor',
      component: Setor,
      props: true
    }, {
      path: '/view/:setorId/:coordId',
      name: 'Coordenadoria',
      component: Coordenadoria,
      props: true
    }, {
      path: '/add',
      name: 'AddSetor',
      component: AddSetor,
      props: true
    }, {
      path: '/add/:setorId',
      name: 'AddCoordenadoria',
      component: AddCoordenadoria,
      props: true
    }, {
      path: '/:setor/:coordenadoria/add',
      name: 'AddMeta',
      component: AddMeta,
      props: true
    }
  ]
})
