<template>
  <b-container class="mx-0 px-0">
    <!-- User Interface controls -->
    <b-row v-if="!loading && metas.length > 0">
      <b-col md="6" class="my-1">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Escreva para pesquisar"></b-form-input>
          <b-input-group-append>
            <b-button variant="secondary" :disabled="!filter" @click="filter = ''">
              Clear
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col md="3" class="my-1">
        <b-input-group>
          <b-form-select v-model="sortBy" :options="sortOptions">
            <option slot="first" disabled :value="null">Ordenar por...</option>
          </b-form-select>
          <b-btn :disabled="!sortBy" @click="sortDesc = !sortDesc" slot="append">
            {{ sortDesc ? 'A&#8674;Z' : 'Z&#8674;A' }}
          </b-btn>
        </b-input-group>
      </b-col>
      <b-col md="3" class="my-1">
        <b-form-select v-model="perPage" :options="pageOptions">
          <option slot="first" disabled :value="null">Itens por página (total: {{metas.length}})</option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-container>
        <b-table :sort-compare="sort"
          @row-clicked="goToMeta"
          :items="metas"
          :fields="campos"
          :filter="filter"
          :current-page="currentPage"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :empty-text="empty.list"
          :empty-filtered-text="empty.filtered"
          stacked="md"
          @filtered="onFiltered"
          striped
          show-empty
        >
          <!-- Estes span com slot são necessários pra renderizar html nas colunas especificadas -->
          <span slot="escopo" slot-scope="data" v-html="data.value"></span>
          <span slot="prazo" slot-scope="data" v-html="data.value"></span>
          <span slot="custo" slot-scope="data" v-html="data.value"></span>
        </b-table>
      </b-container>
    </b-row>
    <b-row class='sticky-footer' v-if="!loading && metas.length > 0">
      <b-col cols="12" class="my-1 h-100 mx-0">
        <b-pagination
          class="my-0"
          :limit="5"
          align='center'
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Formatters from '@/components/Formatters'
import sortMetas from '@/components/sort'

const upperFirst = str => typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str
const sortMap = h => (h.key && typeof h === 'object' ? {text: h.label || upperFirst(h.key), value: h.key} : upperFirst(h))

// descrição dos campos da tabela
const defaultFields = [
  {
    key: 'setor',
    formatter: (v, k, i) => i ? `${i.coordenadoria.setor.sigla} / ${i.coordenadoria.sigla}` : '',
    sortable: true
  },
  {
    key: 'titulo',
    label: 'Meta',
    sortable: true
  },
  {
    key: 'resumo',
    label: 'Ação/Análise',
    sortable: true
  },
  {
    key: 'responsavel',
    label: 'Responsável',
    formatter: v => v && v !== null ? v.nome : '',
    sortable: true
  },
  {
    key: 'escopo',
    formatter: Formatters.escopo,
    sortable: true
  },
  {
    key: 'prazo',
    formatter: Formatters.deadline,
    sortable: true
  },
  {
    key: 'custo',
    formatter: (v, k, i) => Formatters.cost(i),
    sortable: true
  }
]
const empty = {
  list: 'Nenhum registro para ser exibido',
  filtered: 'Sua pesquisa não encontrou resultados'
}
export default {
  name: 'metas-table',
  props: ['items', 'cols', 'rowClicked', 'sortCompare'],
  computed: {
    campos: function () {
      return this.cols ? this.cols : defaultFields
    },
    metas: function () {
      return this.items ? this.items : []
    }
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    sort: function () {
      let a = arguments
      return this.sortCompare
        ? this.sortCompare(...a)
        : sortMetas(...a)
    },
    goToMeta: function (item) {
      if (this.rowClicked) {
        this.rowClicked(...arguments)
      } else {
        this.$router.push({
          name: 'Meta',
          params: {
            setor: item.coordenadoria.setor.sigla,
            coordenadoria: item.coordenadoria.sigla,
            year: (new Date()).getFullYear(),
            meta: item.id
          }
        })
      }
    }
  },
  data () {
    let sortOptions = this.cols instanceof Array
      ? this.cols.map(sortMap)
      : defaultFields.map(sortMap)
    let pageOptions = ([5, 10, 15, 25, 50, 100]).map(v => ({value: v, text: v + ' itens por página'}))
    // basically User interface parameters
    return {
      loading: 0,
      empty,
      filter: null,
      sortBy: null,
      sortDesc: false,
      sortOptions,
      totalRows: this.items.length,
      perPage: 5,
      currentPage: 1,
      pageOptions
    }
  }
}
</script>
<style scoped>
  .sticky-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(240, 240, 240, 0.8);
    color: white;
    text-align: center;
  }
</style>
