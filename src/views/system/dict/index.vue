<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"

import dictDetail from "./detail.vue"
import { Dict, Form, Create, Delete, Get, List, Update, apiPrefix } from "@/api/system/dict"

defineOptions({
  // 命名当前组件
  name: "dict"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<Form>({})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入中文字典名" }],
  description: [{ required: true, trigger: "blur", message: "请输入描述" }],
  type: [{ required: true, trigger: "blur", message: "请输入中文字典名" }],
  status: [{ required: true, trigger: "change", message: "请选择字典状态" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        Create(formData.value)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        Update(currentUpdateId.value, {
          ...formData.value
        })
          .then(() => {
            ElMessage.success("修改成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formRef.value?.resetFields()
  formData.value = {}
}
//#endregion

//#region 删
const handleDelete = (row: Dict) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
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

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: Dict) => {
  Get(row.id).then((res) => {
    currentUpdateId.value = row.id
    Object.assign(formData.value, res.data || {})
    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<Dict[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  keyword: "",
  status: undefined
})
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    keyword: searchData.keyword || undefined,
    status: searchData.status || undefined
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
        <el-form-item prop="keyword" label="关键字">
          <el-input v-model="searchData.keyword" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select clearable placeholder="请选择" v-model="searchData.status">
            <el-option key="true" label="正常" value="true" />
            <el-option key="false" label="禁用" value="false" />
          </el-select>
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
          <el-button type="primary" v-permission="apiPrefix + '_POST'" :icon="CirclePlus" @click="dialogVisible = true"
            >新增字典</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="expand">
            <template #default="scope">
              <dictDetail :dictId="scope.row.id" />
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" min-width="110" />
          <el-table-column prop="name" label="字典名(中)" min-width="110" />
          <el-table-column prop="type" label="字典名(英)" min-width="160" sortable />
          <el-table-column prop="status" label="状态" min-width="110">
            <template #default="scope">
              {{ scope.row.status ? "正常" : "禁用" }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="110" />
          <el-table-column prop="updated_at" label="最后更新" min-width="110">
            <template #default="scope">
              {{ timeHandle(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                v-permission="apiPrefix + '/:id_PUT'"
                text
                bg
                size="small"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
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
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增' : '修改'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item prop="name" label="字典名(中)">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="type" label="字典名(英)">
          <el-input v-model="formData.type" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
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
@/api/system/dict-manage@/api/system/dict-manage/types/table
