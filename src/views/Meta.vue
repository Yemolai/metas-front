<script>
import Coordenadorias from '@/coordenadorias.json'

export default {
  props: ['iddiretoria', 'idcoordenadoria', 'year', 'idmeta'],
  methods: {
    decimal (value) {
      if (isNaN(Number(value))) {
        return value
      }
      let numero = Number(value).toFixed(2).split('.')
      numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
      return numero.join(',')
    },
    progress (meta) {
      if (meta.realized && meta.predicted) {
        return this.decimal((meta.realized / meta.predicted) * 100) + '%'
      }
      return ''
    }
  },
  computed: {
    diretoria: function () {
      return {text: 'DIMAC', value: 'Social'}
    },
    coordenadoria: function () {
      let self = this
      return Coordenadorias.data
        .filter(d => d.text === self.iddiretoria)
        .map(d => d.coordenadorias)
        .reduce((p, a) => a, [])
        .filter(c => c.text === self.idcoordenadoria)
        .reduce((p, a) => a, {})
    },
    meta: function () {
      let metas = this.coordenadoria.milestones || []
      let meta = metas.filter(m => m.key === this.idmeta).reduce((p, a) => a, {})
      meta.id = [this.diretoria.text, this.coordenadoria.text, this.year, meta.key].join('/')
      return meta
    }
  },
  render () {
    return (
      <b-container>
        <b-card>
          <h3>
            {this.coordenadoria.text} - {this.coordenadoria.value}
          </h3>
          <b-row>
            <b-col>
              <h4>
                <small>Meta:&nbsp;</small>
                {this.meta.title}
              </h4>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3">
              <b>ID:&nbsp;</b>
              {this.meta.id}
            </b-col>
            <b-col>
              <b>Responsável:&nbsp;</b>
              {this.meta.assigned}
            </b-col>
            <b-col cols="3">
              <b>Atualizado:&nbsp;</b>
              {this.meta.lastUpdateDate}
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>Prazo:&nbsp;</b><br/>
              <b-row>
                <b-col cols='3'>&nbsp;</b-col>
                <b-col>Início</b-col>
                <b-col>Final</b-col>
              </b-row>
              <b-row>
                <b-col cols='3' class="text-right">Real</b-col>
                <b-col>{this.meta.deadline.realized.start}</b-col>
                <b-col>{this.meta.deadline.realized.end}</b-col>
              </b-row>
              <b-row>
                <b-col cols='3' class="text-right">Plano</b-col>
                <b-col><small>({this.meta.deadline.predicted.start})</small></b-col>
                <b-col><small>({this.meta.deadline.predicted.end})</small></b-col>
              </b-row>
            </b-col>
            <b-col>
              <b>Escopo:&nbsp;</b><br/>
              <b-row>
                <b-col>Realizado</b-col>
                <b-col>Previsto</b-col>
                <b-col>Progresso</b-col>
              </b-row>
              <b-row>
                <b-col>{this.meta.scopeQuality.realized}</b-col>
                <b-col>{this.meta.scopeQuality.predicted}</b-col>
                <b-col>{this.progress(this.meta.scopeQuality)}</b-col>
              </b-row>
            </b-col>
            <b-col>
              <b>Custo:&nbsp;</b><br/>
              <b-row>
                <b-col>Utilizado</b-col>
                <b-col>Previsto</b-col>
              </b-row>
              {
                this.meta.cost
                  ? <b-row>
                    <b-col>R$&nbsp;
                      {
                        this.meta.cost && this.meta.cost.realized
                          ? this.decimal(this.meta.cost.realized) : '0,00'
                      }
                    </b-col>
                    <b-col>R$&nbsp;
                      {
                        this.meta.cost && this.meta.cost.predicted
                          ? this.decimal(this.meta.cost.predicted) : '0,00'
                      }
                    </b-col>
                  </b-row>
                  : <b-row>
                    <b-col>-</b-col>
                    <b-col>-</b-col>
                  </b-row>
              }
            </b-col>
          </b-row>
        </b-card>
        <b-row>
          <b-col></b-col>
          <b-col></b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
    )
  }
}
</script>
