<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getDict } from "@/utils/dict"
import { Api, Form, Create, Delete, Get, List, Update, apiPrefix } from "@/api/system/api"

defineOptions({
  // 命名当前组件
  name: "api"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const currentUpdateId = ref<undefined | number>(undefined)

const formData = ref<Form>({})

const formRules: FormRules = reactive({
  path: [{ required: true, trigger: "blur", message: "请输入api路径" }],
  description: [{ required: true, trigger: "blur", message: "请输入api简介" }],
  api_group: [{ required: true, trigger: "blur", message: "请输入api分组" }],
  is_write_log: [{ required: true, trigger: "change", message: "请选择是否记录日志" }],
  is_need_login: [{ required: true, trigger: "change", message: "请选择是否需要登陆才能访问此接口" }],
  is_need_permission: [{ required: true, trigger: "change", message: "请选择是否需要权限才能访问此接口" }],
  method: [{ required: true, trigger: "change", message: "请选择请求方式" }]
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
        Update(currentUpdateId.value, { ...formData.value })
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
const handleDelete = (row: Api) => {
  ElMessageBox.confirm(`此操作将永久删除所有角色下该api，是否继续？`, "提示", {
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
const handleUpdate = (row: Api) => {
  Get(row.id).then((res) => {
    currentUpdateId.value = row.id
    Object.assign(formData.value, res.data || {})
    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<Api[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  path: "",
  description: "",
  apiGroup: "",
  writeLog: undefined,
  method: ""
})
const methodOptions = getDict("method")
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    path: searchData.path || undefined,
    description: searchData.description || undefined,
    api_group: searchData.apiGroup || undefined,
    is_write_log: searchData.writeLog || undefined,
    method: searchData.method || undefined
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
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="path" label="Api路径">
          <el-input v-model="searchData.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="description" label="Api描述">
          <el-input v-model="searchData.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="apiGroup" label="Api组">
          <el-input v-model="searchData.apiGroup" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="writeLog" label="记录日志">
          <el-select v-model="searchData.writeLog" clearable placeholder="是否记录日志">
            <el-option key="true" label="是" value="true" />
            <el-option key="false" label="否" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item prop="method" label="请求方式">
          <el-select clearable placeholder="请选择请求方式" v-model="searchData.method">
            <el-option
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
              v-for="item in methodOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" v-permission="apiPrefix + '_POST'" :icon="CirclePlus" @click="dialogVisible = true"
            >新增Api</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="ID" min-width="110" />
          <el-table-column prop="api_group" label="Api分组" min-width="110" />
          <el-table-column prop="path" label="Api路径" min-width="160" sortable />
          <el-table-column prop="description" label="Api简介" min-width="110" />
          <el-table-column prop="is_write_log" label="记录日志" min-width="110">
            <template #default="scope">
              {{ scope.row.is_write_log ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column prop="is_need_login" label="需要登陆" min-width="110">
            <template #default="scope">
              {{ scope.row.is_need_login ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column prop="is_need_permission" label="需要权限" min-width="110">
            <template #default="scope">
              {{ scope.row.is_need_permission ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column prop="method" label="请求" min-width="110" />
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
        <el-form-item prop="path" label="Api路径">
          <el-input v-model="formData.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="method" label="请求方式">
          <el-select placeholder="请选择" filterable v-model="formData.method">
            <el-option
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
              v-for="item in methodOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="apiGroup" label="Api分组">
          <el-input v-model="formData.api_group" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="description" label="Api简介">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="writeLog" label="记录日志">
          <el-radio-group v-model="formData.is_write_log">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="needLogin" label="需要登陆">
          <el-radio-group v-model="formData.is_need_login">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="needPermission" label="需要权限">
          <el-radio-group v-model="formData.is_need_permission">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
@/api/system-manage/api
