<template>
  <el-button
    @click="onPickFile"
  >
    Termine als .csv Datei hochladen
  </el-button>
  <input
    ref="fileInput"
    type="file"
    style="display: none"
    accept=".csv"
    @change="onFilePicked"
  >
</template>

<script>

import { ref } from 'vue';
import { useStore } from 'vuex';
import Papa from 'papaparse';

export default {
  name: 'EnqueueForm',
  components: {
  },
  setup() {
    
    let fileInput = ref();

    const store = useStore();

    const onFilePicked = (event) => {
      const file = event.target.files[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => {
          switch(header) {
          case "Impfort":
            return "place";
          case "Datum":
            return "day";
          case "Uhrzeit":
            return "time";
          case "Vorname":
            return "firstName";
          case "Nachname":
            return "lastName";
          case "Erst-/Zweitimpfung":
            return "stage";
          case "Impfstoff":
            return "vaccine";
          default:
            return header;
          }
        },
        complete: function(results) {
          store.dispatch('appointment/addAppointments', results.data)
        },
        error: error => {
          console.log(error);
        }
      });

    }
    
    return {
      onFilePicked,
      fileInput,
      onPickFile () {
        fileInput.value.click()
      },
    }
  }
}
</script>
