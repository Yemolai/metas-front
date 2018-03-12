<template lang="pug">
  footer(:class="['footer', sticky]")
    small.text-muted
      span.fa.far.fa-copyright &nbsp;
      span {{ actualYear }} - COTI/SEDOP-PA
</template>
<script>
export default {
  name: 'Footer',
  computed: {
    actualYear: () => (new Date()).getFullYear(),
    sticky: () => document.body.clientHeight > window.innerHeight ? '' : 'sticky-footer'
  }
}
</script>
<style scoped>
  .sticky-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .footer {
    /* Set the fixed height of the footer here */
    height: 2rem;
    line-height: 2rem; /* Vertically center the text there */
    background-color: rgba(245, 245, 245, 0.4);
  }
</style>
