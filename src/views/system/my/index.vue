<script lang="ts" setup>
import { ref } from "vue"
import mySetting from "./setting.vue"
import myPassword from "./password.vue"

defineOptions({
  // 命名当前组件
  name: "my"
})

const activeName = ref("mySetting")
</script>

<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="我的设置" name="mySetting"><mySetting /></el-tab-pane>
      <el-tab-pane label="修改密码" name="myPassword"><myPassword /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
