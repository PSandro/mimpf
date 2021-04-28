<template>
  <div>
    <p>{{ totalRows }} ausstehende Termine</p>
  </div>
  <el-button-group>
    <el-button
      type="primary"
      icon="el-icon-arrow-left el-icon-left"
      @click="handlePrev"
    >
      vorherige Seite
    </el-button>
    <el-button
      type="primary"
      :disabled="nextDisabled"
      @click="handleNext"
    >
      nächste Seite
      <i class="el-icon-arrow-right el-icon-right" />
    </el-button>
  </el-button-group>
  <el-table
    v-loading="loading"
    :data="appointments"
    style="width: 100%"
    empty-text="keine Termine geladen"
    :lazy="lazyLoad"
    :row-key="rowKey"
  >
    <el-table-column
      fixed
      prop="date"
      label="Uhrzeit"
      width="130"
      :formatter="formatDate"
    />
    <el-table-column
      fixed
      prop="firstName"
      label="Vorname"
      min-width="100"
    />
    <el-table-column
      fixed
      prop="lastName"
      label="Nachname"
      min-width="120"
    />
    <el-table-column
      prop="stage"
      label="Erst-/Zweitimpfung"
      width="100"
      align="center"
    />
    <el-table-column
      prop="vaccine"
      label="Impfstoff"
      width="200"
    />
    <el-table-column
      fixed="right"
      width="200"
      label="Aktion"
    >
      <template #default="scope">
        <template v-if="isSelected(scope.row)">
          <el-button
            size="small"
            type="warning"
            @click="handleEnqueue(scope.row)"
          >
            ({{ selectionCount }}) Einreihen
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleUnselect(scope.row)"
          />
        </template>
        <template v-else>
          <el-button
            size="small"
            type="primary"
            @click="handleSelect(scope.row)"
          >
            Auswählen
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import dayjs from 'dayjs'

export default {
  name: 'AppointmentTable',
  components: {
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const handleEnqueue = () => {
      router.push({name: 'enqueue'});
    }

    const handleNext = () => {
      store.dispatch('appointment/updatePage', { previous: false });
    };
    const handlePrev = () => {
      store.dispatch('appointment/updatePage', { previous: true });
    };

    const fetchAppointments = () => {
      store.dispatch('appointment/updatePage', {key: {} });
    };

    onMounted(fetchAppointments);
    


    const formatDate = (row, column, cellValue) => {
      let timestamp = new Number(cellValue);
      return dayjs(timestamp)
        .format('HH:mm') + ' Uhr';
    };


    const isSelected = (row) => {
      let selected = store.getters['enqueue/isSelectedID'](row._id);
      return selected;
    }
    const handleSelect = (appointment) => {
      store.commit('enqueue/selectAppointment', appointment);
    }
    const handleUnselect = (appointment) => {
      store.commit('enqueue/unselectAppointment', appointment);
    }


    return {
      appointments: computed(() => store.getters['appointment/getAppointmentSelection']),
      handleEnqueue,
      handleNext,
      handlePrev,
      loading: computed(() => store.getters['appointment/isLoading']),
      rowKey: "_id",
      lazyLoad: true,
      nextDisabled: computed(() => store.getters['appointment/isNextDisabled']),
      totalRows: computed(() => store.getters['appointment/getTotalRows']),
      handleSelect,
      handleUnselect,
      isSelected,
      selectionCount: computed(() => store.getters['enqueue/getSelectionCount']),
      formatDate,

    }
  }
}
</script>
