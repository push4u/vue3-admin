<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import type { UploadUserFile } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import type { UploadProps } from "element-plus"
import { formatDateTime } from "@/utils/index"

import { File, List, Delete, apiPrefix } from "@/api/system/file"

defineOptions({
  // 命名当前组件
  name: "file"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增 上传文件
const token = getToken()
const path = import.meta.env.VITE_BASE_API
const fileList = ref<UploadUserFile[]>([])
//#endregion

//#region 删
const handleDelete = (row: File) => {
  ElMessageBox.confirm(`确定要删除吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    Delete({ id: [row.id] }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 查
const tableData = ref<File[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  created_by: undefined,
  hash: undefined,
  key: undefined,
  name: undefined,
  tag: undefined,
  url: undefined
})
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    created_by: searchData.created_by || undefined,
    hash: searchData.hash || undefined,
    key: searchData.key || undefined,
    name: searchData.name || undefined,
    tag: searchData.tag || undefined,
    url: searchData.url || undefined
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

const handleFileSuccess: UploadProps["onSuccess"] = () => {
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
const timeHandle = computed(() => (time: string) => {
  return formatDateTime(time)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="createdBy" label="创建人">
          <el-input v-model="searchData.created_by" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="hash" label="文件hash">
          <el-input v-model="searchData.hash" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="key" label="编号">
          <el-input v-model="searchData.key" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="文件名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="tag" label="文件标签">
          <el-input v-model="searchData.tag" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="url" label="文件地址">
          <el-input v-model="searchData.url" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :action="`${path}` + `${apiPrefix}`"
            :show-file-list="false"
            :headers="{ Authorization: 'Bearer ' + token }"
            :on-success="handleFileSuccess"
          >
            <el-button type="primary" v-permission="apiPrefix + '_POST'">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="hash" label="hash" min-width="110" />
          <el-table-column prop="key" label="编号" min-width="110" />
          <el-table-column prop="name" label="文件名" min-width="160" />
          <el-table-column prop="tag" label="文件标签" min-width="110" />
          <el-table-column prop="url" label="文件地址" min-width="110" />
          <el-table-column prop="created_at" label="时间" min-width="110">
            <template #default="scope">
              {{ timeHandle(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button
                type="danger"
                v-permission="apiPrefix + '_DELETE'"
                text
                bg
                size="small"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
@/api/system/file-manage@/api/system/file-manage/types/table
