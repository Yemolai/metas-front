<template lang="pug">
  footer
    .container
      .text-muted
        span.fa.far.fa-copyright &nbsp;
        span {{ actualYear }} - COTI/SEDOP-PA
</template>
<script>
export default {
  name: 'Footer',
  computed: {
    actualYear: () => (new Date()).getFullYear()
  }
}
</script>
