<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="appointments">
      Termine
    </el-menu-item>
    <el-menu-item index="queue">
      Warteschlange
    </el-menu-item>
  </el-menu>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';


export default {
  name: 'Reception',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const handleSelect = (key) => {
      router.push({name: key});
    };

    let activeIndex = route.name;
    
    return {
      activeIndex,
      handleSelect
    }
  }
}
</script>
