<template>
  <div>
    <p>Blub!</p>
  </div>
  <button @click="addAppointment">
    add an empty appointment
  </button>
  <grid
    :cols="cols"
    :rows="rows"
    :sort="sort"
    :search="search"
    :pagination="pagination"
    :language="language"
  />
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
      cols: [
        {
          id: 'date',
          name: 'Uhrzeit',
          formatter: (cell) => {
            //TODO: make prettier
            let date = new Date(cell);
            let hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
            let minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
            return `${hours}:${minutes}`;
          }
        },
        {
          id: 'firstName',
          name: 'Vorname',
        },
        {
          id: 'lastName',
          name: 'Nachname',
        },
        {
          id: 'stage',
          name: 'Erst-/Zweitimpfung',
        },
        {
          id: 'vaccine',
          name: 'Impfstoff',
        },
      ],
      sort: true,
      search: {
        enabled: true
      },
      pagination: {
        enabled: true,
        limit: 25
      },
      language: {
        'search': {
          'placeholder': '🔍 Suchen...'
        },
        'pagination': {
          'previous': '⬅️',
          'next': '➡️',
          'navigate': (page, pages) => `Seite ${page} von ${pages}`,
          'page': (page) => `Seite ${page}`,
          'showing': 'Zeige',
          'of': 'von',
          'to': 'bis',
          'results': 'Ergebnissen'
        }
      }
    }
  },
  computed: {
    ...mapState('appointment', {
      rows: 'appointmentSelection',
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
