<template>
  <div>
    <p>Blub!</p>
  </div>
  <grid :cols="cols" :rows="rows"/>
</template>

<script>
import Grid from '@/components/lib/gridjs-vue.vue'

export default {
  name: 'Reception',
  components: {
    Grid
  },
  data() {
    return {
        cols: ['id', 'time', 'firstName', 'lastName', 'stage', 'vaccine'],
        rows: [
          ['1', '8:30 Uhr', 'Max', 'Musterimpfling', '1', 'Comirnaty (BioNTech/Pfizer)'],
          ['2', '8:30 Uhr', 'Dieter', 'Musterimpfling', '2', 'Comirnaty (BioNTech/Pfizer)'],
          ['3', '8:45 Uhr', 'Hilde', 'Gard', '1', 'Comirnaty (BioNTech/Pfizer)'],
          ['4', '8:30 Uhr', 'Hans-Peter', 'Hanspeter', '1', 'Comirnaty (BioNTech/Pfizer)'],
        ]
    }
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
