<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"
import { getDict } from "@/utils/dict"
import { ListUserLog } from "@/api/system/log-record"
import { UserLog } from "@/api/system/log-record/types/user"

defineOptions({
  // 命名当前组件
  name: "logRecordUser"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 查
const tableData = ref<UserLog[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  page: undefined,
  pageSize: undefined,
  action: undefined,
  operator_name: undefined,
  data_id: undefined,
  data_name: undefined,
  ip: undefined,
  content: undefined,
  data_type: undefined
})

// 获取字典
const actionOptions = getDict("action")

const getTableData = () => {
  loading.value = true
  ListUserLog({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    action: searchData.action || undefined,
    operator_name: searchData.operator_name || undefined,
    data_id: searchData.data_id || undefined,
    data_name: searchData.data_name || undefined,
    ip: searchData.ip || undefined,
    content: searchData.content || undefined,
    data_type: searchData.data_type || undefined
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
        <el-form-item prop="action" label="请求动作">
          <el-select v-model="searchData.action" placeholder="请求动作" clearable>
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="operator_name" label="操作人">
          <el-input v-model="searchData.operator_name" placeholder="请输入" />
        </el-form-item>

        <el-form-item prop="data_id" label="数据ID">
          <el-input v-model="searchData.data_id" placeholder="请输入" />
        </el-form-item>

        <el-form-item prop="data_name" label="数据名称">
          <el-input v-model="searchData.data_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="ip" label="ip地址">
          <el-input v-model="searchData.ip" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="content" label="日志内容">
          <el-input v-model="searchData.content" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="data_type" label="数据类型">
          <el-input v-model="searchData.data_type" placeholder="请输入" />
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
          <el-table-column prop="content" label="日志内容" min-width="110" />
          <el-table-column label="数据变动" prop="diff" sortable="custom" width="160">
            <template v-slot="scope">
              <div>
                <el-popover placement="left" trigger="hover" width="550" v-if="scope.row.diff">
                  <el-table :data="JSON.parse(scope.row.diff)" size="small" class="special-diff-getRowClass">
                    <el-table-column width="100" property="name" label="名称" />
                    <el-table-column width="250" property="old" label="旧值" />
                    <el-table-column width="250" property="new" label="新值" />
                  </el-table>
                  <template #reference>
                    <el-icon><View /></el-icon>
                  </template>
                </el-popover>
                <span v-else>无</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operator_name" label="操作人" min-width="160" />
          <el-table-column prop="ip" label="操作IP" min-width="110" />
          <el-table-column prop="data_type" label="数据类型" min-width="160" />
          <el-table-column prop="created_at" label="操作时间" min-width="110">
            <template #default="scope">
              {{ timeHandle(scope.row.updated_at) }}
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
@/api/system/log-record@/api/system/log-record/types/user
