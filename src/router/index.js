import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Painel from '@/views/Painel'
import Meta from '@/views/Meta'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/painel',
      name: 'Painel',
      component: Painel
    },
    {
      path: '/:iddiretoria/:idcoordenadoria/:year/:idmeta',
      name: 'meta',
      component: Meta,
      props: true
    }
  ]
})
