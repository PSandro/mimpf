<template>
  <button
    class="btn btn-info"
    @click="onPickFile"
  >
    Termine als .csv Datei hochladen
  </button>
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
import Papa from 'papaparse';

export default {
  name: 'EnqueueForm',
  components: {
  },
  setup() {
    
    let fileInput = ref();

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
            return "date";
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
        step: function(results) {
          console.log("Row:", results.data);
        },
        complete: function() {
          //TODO: format results and push to db
          console.log("All done!");
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
