<template>
  <Suspense>
    <template #default>
      <QueueTable />
    </template>
    <template #fallback>
      <div>Lade Warteschlange...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';


export default {
  name: 'Queue',
  components: {
    QueueTable: defineAsyncComponent(() => import('@/components/QueueTable')),
  },
  setup() {
  }
}
</script>
