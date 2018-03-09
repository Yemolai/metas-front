<template lang="pug">
  #meta-update.container.text-left
    h4(v-if='loading') Carregando...
    h3 M
      small ETA -
        span {{meta.coordenadoria.setor.sigla}}/
        span {{meta.coordenadoria.sigla}}/
        span {{new Date(meta.createdAt).getFullYear()}} -
        span {{ meta.titulo }}
    b-form(@submit='submit' @reset='reset' v-else).text-left
      b-row
        b-col(sm='12')
          b-form-group(
            label='Título'
            label-for='form-input-titulo'
            description='Breve descrição do objetivo'
          )#form-group-titulo
            b-form-input(
              type='text'
              v-model='form.titulo'
              required
              placeholder='Realizar um passo de uma caminhada'
            )#form-input-titulo
      b-row
        b-col(sm='12' md='3')
          b-form-group(
            label='Escopo previsto'
            label-for='form-input-escopo-previsto'
            description='Uma previsão de contador de progresso de execução'
          )#form-group-escopo-previsto
            b-form-input(
              type='number'
              v-model='form.escopo_previsto'
              required
              min='0'
              step='0.01'
              placeholder='99,9'
            )#form-input-escopo-previsto
        b-col(sm='12' md='3')
          b-form-group(
            label='Escopo realizado'
            label-for='form-input-escopo-realizado'
            description='valor quantitativo de progresso de execução'
          )#form-group-escopo-realizado
            b-form-input(
              type='number'
              v-model='form.escopo_realizado'
              required
              min='0'
              step='0.01'
              placeholder='99,9'
            )#form-input-escopo-realizado
        b-col(sm='12' md='3')
          b-form-group(
            label='Início previsto'
            label-for='form-input-inicio-previsto'
            description='Data prevista para o início da execução'
          )
            b-form-input(
              type='date'
              v-model='form.inicio_previsto'
              required
            )#form-input-inicio-previsto
        b-col(sm='12' md='3')
          b-form-group(
            label='Início realizado'
            label-for='form-input-inicio-realizado'
            description='Data do início da execução'
          )
            b-form-input(
              type='date'
              v-model='form.inicio_realizado'
              required
            )#form-input-inicio-realizado
        b-col(sm='12' md='3')
          b-form-group(
            label='Fim previsto'
            label-for='form-input-fim-previsto'
            description='Data prevista para o fim da execução'
          )
            b-form-input(
              type='date'
              v-model='form.fim_previsto'
              required
            )#form-input-fim-previsto
        b-col(sm='12' md='3')
          b-form-group(
            label='Fim realizado'
            label-for='form-input-fim-realizado'
            description='Data do fim da execução'
          )
            b-form-input(
              type='date'
              v-model='form.fim_realizado'
              required
            )#form-input-fim-realizado
        b-col(sm='12' md='3')
          b-form-group(
            label='Custo previsto'
            label-for='form-input-custo-previsto'
            description='Custo inicialmente previsto para a execução'
          )
            b-form-input(
              type='number'
              v-model='form.custo_previsto'
              required
              min='0'
              step='0.01'
              placeholder='10.00'
            )#form-input-custo-previsto
        b-col(sm='12' md='3')
          b-form-group(
            label='Custo realizado'
            label-for='form-input-custo-realizado'
            description='Custo efetivo usado para a execução'
          )
            b-form-input(
              type='number'
              v-model='form.custo_realizado'
              required
              min='0'
              step='0.01'
              placeholder='10.00'
            )#form-input-custo-realizado
      b-row
        b-col(sm='12' md='6')
          b-form-group(
            label='Responsável'
            label-for='form-input-responsavel'
            description='Usuário responsável pela meta'
          )
            b-select(
              :options='listaUsuarios'
              v-model='form.responsavel'
              value-field='id'
            )#form-input-responsavel
      b-row
        b-col.text-right
          b-btn(
            variant='secondary'
            @click='cancelAndGoBack'
          ).ml-2.mb-2 Cancelar e voltar
          b-btn(
            variant='warning'
            type='reset'
          ).ml-2.mb-2 Redefinir formulário
          b-btn(
            variant='primary'
            type='submit'
          ).ml-2.mb-2 Salvar nova meta
</template>
<script>
import GET_META from '@/constants/get-meta'
export default {
  data () {
    return {
      loading: 0,
      meta: {}
    }
  },
  apollo: {
    meta: {
      query: GET_META,
      variables: function () {
        let metaIdParam = Number(this.$route.params.meta)
        let metaId = isNaN(metaIdParam) ? 0 : metaIdParam
        return { metaId }
      }
    }
  }
}
</script>
