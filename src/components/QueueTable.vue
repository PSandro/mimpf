<template>
  <div>
    <p>{{ totalRows }} Einträge in der Warteschlange</p>
  </div>
  <el-table
    v-loading="loading"
    :data="queueEntries"
    style="width: 100%"
    empty-text="keine Einträge geladen"
    :lazy="lazyLoad"
    :row-key="rowKey"
  >
    <el-table-column
      fixed
      prop="pager"
      label="Pager"
      width="100"
    />
    <el-table-column
      fixed
      label="Impfling(e)"
      min-width="100"
    >
      <template #default="scope">
        <template
          v-for="person in scope.row.persons"
          :key="person._id"
        >
          <el-tag size="medium">
            {{ person.firstName }} {{ person.lastName }}
          </el-tag>
        </template>
      </template>
    </el-table-column>
    <el-table-column
      prop="issue"
      label="Anliegen"
      width="100"
      align="center"
    />
    <el-table-column
      fixed="right"
      width="120"
      label="Aktion"
    >
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          @click="handleCall(scope.row)"
        >
          Aufrufen
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'

export default {
  name: 'QueueTable',
  components: {
  },
  setup() {
    const store = useStore();

    const callQueueEntry = (queueEntry) => {
      console.log(`calling ${queueEntry._id}`);
      store.dispatch('queue/editQueueEntryStatus', {
        queueEntry: queueEntry,
        status: 'called'
      });
    }

    const fetchQueueEntries = () => {
      store.dispatch('queue/updatePage');
    };


    onMounted(fetchQueueEntries);

    return {
      queueEntries: computed(() => { return store.getters['queue/getQueueEntries'] }),
      handleCall: callQueueEntry,
      loading: computed(() => { return store.getters['queue/isLoading'] }),
      rowKey: "_id",
      lazyLoad: true,
      totalRows: computed(() => { return store.getters['queue/getTotalRows'] }),

    }
  }
}
</script>
