<template>
  <div>
    <p>Blub!</p>
  </div>
  <grid :cols="cols" :rows="rows"/>
</template>

<script>
import { mapState } from 'vuex'
import Grid from '@/components/lib/gridjs-vue.vue'

export default {
  name: 'Reception',
  components: {
    Grid
  },
  data() {
    return {
        cols: ['id', 'time', 'firstName', 'lastName', 'stage', 'vaccine'],
    }
  },
  computed: {
    ...mapState('appointment', {
      rows: 'appointments',
    }),
  },
  created() {
  },
  async mounted() {
  },
  unmounted() {
  },
  methods: {
  }
}
</script>
