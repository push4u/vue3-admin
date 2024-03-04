<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"
import { getDict } from "@/utils/dict"
import { ElMessageBox } from "element-plus"

import { ListOperationLog } from "@/api/system/log-record"
import { OperationLog } from "@/api/system/log-record/types/operation"

defineOptions({
  // 命名当前组件
  name: "logRecordOperation"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 查
const tableData = ref<OperationLog[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  page: undefined,
  pageSize: undefined,
  method: undefined,
  remark: undefined,
  ip: undefined
})
const getTableData = () => {
  loading.value = true
  ListOperationLog({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    method: searchData.method || undefined,
    remark: searchData.remark || undefined,
    ip: searchData.ip || undefined
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

//查看详情
const bodyDetail = (content: string) => {
  // 将字符串转换为 JSON 对象
  const json = JSON.parse(content)

  // 将 JSON 对象转换为美化后的字符串
  const prettyJson = JSON.stringify(json, null, 2)
  ElMessageBox.alert("<pre>" + prettyJson + "</pre>", "详情", {
    dangerouslyUseHTMLString: true,
    customStyle: { maxWidth: "40%", overflow: "auto" }
  })
}

const methodOptions = getDict("method")
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
        <el-form-item prop="method" label="请求方法">
          <el-select v-model="searchData.method">
            <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="操作内容">
          <el-input v-model="searchData.remark" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="ip" label="IP地址">
          <el-input v-model="searchData.ip" placeholder="请输入" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="ID" min-width="110" />
          <el-table-column prop="username" label="操作人" min-width="110" />

          <el-table-column prop="created_at" label="日期" min-width="160">
            <template #default="scope">
              {{ timeHandle(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="请求IP" min-width="110" />
          <el-table-column prop="status" label="状态" min-width="110" />

          <el-table-column prop="method" label="请求方法" min-width="160" />
          <el-table-column prop="remark" label="操作内容" min-width="110" />
          <el-table-column label="请求" prop="path" width="80">
            <template v-slot="scope">
              <el-icon v-if="scope.row.req"><View @click="bodyDetail(scope.row.req)" /></el-icon>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="响应" prop="path" width="80">
            <template v-slot="scope">
              <el-icon v-if="scope.row.resp"><View @click="bodyDetail(scope.row.resp)" /></el-icon>
              <span v-else>无</span>
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
