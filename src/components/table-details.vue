<template lang="pug">
  b-container
    b-container.table
    b-form-select(:options='options' v-model='selection')
      template(slot='first' selected)
        option(:value='null' disabled) -- Escolha --
    b-container.table
      b-table(small striped hover stacked='sm' :items='items' :fields='fields')
        template(slot="show_details" slot-scope="row")
          b-button.mr-2(size="sm" @click.stop="row.toggleDetails") {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          b-form-checkbox(@click.native.stop='' @change="row.toggleDetails" v-model="row.detailsShowing") Details via check
        template(slot="row-details" slot-scope="row")
          b-card
            b-row.mb-2
              b-col.text-sm-right(sm="3")
                b Age:
              b-col {{ row.item.age }}
            b-row.mb-2
              b-col.text-sm-right(sm="3")
                b Is Active:
              b-col {{ row.item.isActive }}
            b-button(size="sm" @click="row.toggleDetails") Hide Details
</template>

<script>
import Data from '@/test-data.json'
export default {
  watch: {
    'selection': function (v) {
      if (v === 'one') {
        this.items = Data.filter(p => p.age < 40).map(p => {p._showDetails=false; return p})
      } else if (v === 'two') {
        this.items = Data.filter(p => p.age >= 40).map(p => {p._showDetails=false; return p})
      } else {
        this.items = []
      }
    }
  },
  data () {
    return {
      options: [{text: 1, value: 'one'}, {text: 2, value: 'two'}, {text: 3, value: 'three'}],
      selection: null,
      fields: [ 'first_name', 'last_name', 'show_details' ],
      items: []
    }
  }
}
</script>
