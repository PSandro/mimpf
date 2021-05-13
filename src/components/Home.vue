<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="view">
      Termine
    </el-menu-item>
    <el-menu-item index="queue">
      Warteschlange
    </el-menu-item>
    <el-menu-item index="settings">
      Einstellungen
    </el-menu-item>
  </el-menu>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive>
        <suspense>
          <component :is="Component" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';


export default {
  name: 'Home',
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
