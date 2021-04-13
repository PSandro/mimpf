<template>
  <div>
    <p>Blub!</p>
  </div>
  <button @click="addAppointment">add an empty appointment</button>
  <grid :cols="cols" :rows="rows"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Grid from '@/components/lib/gridjs-vue.vue'

export default {
  name: 'Reception',
  components: {
    Grid
  },
  data() {
    return {
        cols: ['date', 'firstName', 'lastName', 'stage', 'vaccine'],
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
    ...mapActions('appointment', [
      'addAppointment',
    ]),
  }
}
</script>
