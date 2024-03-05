<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/store/modules/settings"

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const settingsStore = useSettingsStore()
const { layoutMode } = storeToRefs(settingsStore)
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse: props.collapse, 'layout-mode-top': layoutMode === 'top' }">
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <!-- <img :src="logo" class="layout-logo" /> -->
      </router-link>
      <router-link v-else key="expand" to="/">
        <!-- <img :src="layoutMode !== 'left' ? logoText2 : logoText1" class="layout-logo-text" /> -->
        <h2 :class="['site-logo ', layoutMode !== 'left' ? 'black' : 'write']">Admin</h2>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  background-color: transparent;
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
  }
  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--v3-navigationbar-height);
  line-height: var(--v3-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
.site-logo {
  display: inline-block;
  font-weight: 600;
  font-size: 30px;
  vertical-align: middle;
  padding-left: 10px;
  margin: 0;
}
.write {
  color: #fff;
}
.black {
  color: #000;
}
</style>
