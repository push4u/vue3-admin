<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"
import { Refresh, Search } from "@element-plus/icons-vue"

import { ListLoginLog } from "@/api/system/log-record"
import { LoginLog } from "@/api/system/log-record/types/login"

defineOptions({
  // 命名当前组件
  name: "logRecordLogin"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 查
const tableData = ref<LoginLog[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  page: undefined,
  pageSize: undefined,
  username: undefined,
  status: undefined,
  ip: undefined,
  keyword: undefined
})
const getTableData = () => {
  loading.value = true
  ListLoginLog({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    username: searchData.username || undefined,
    status: searchData.status || undefined,
    ip: searchData.ip || undefined,
    keyword: searchData.keyword || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
const timeHandle = computed(() => (time: any) => {
  return formatDateTime(time)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="登录状态">
          <el-select clearable placeholder="请选择" v-model="searchData.status">
            <el-option key="true" label="成功" value="true" />
            <el-option key="false" label="失败" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item prop="ip" label="ip地址">
          <el-input v-model="searchData.ip" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="keyword" label="关键字">
          <el-input v-model="searchData.keyword" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="username" label="用户名" min-width="110" />
          <el-table-column prop="status" label="状态" min-width="110">
            <template #default="scope">
              {{ scope.row.status ? "成功" : "失败" }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="ip地址" min-width="160" />
          <el-table-column prop="browser" label="浏览器" min-width="110" />
          <el-table-column prop="os" label="操作系统" min-width="110" />
          <el-table-column prop="platform" label="固件" min-width="110" />
          <el-table-column prop="remark" label="备注" min-width="160" />
          <el-table-column prop="msg" label="信息" min-width="110" />
          <el-table-column prop="created_at" label="时间" min-width="110">
            <template #default="scope">
              {{ timeHandle(scope.row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
