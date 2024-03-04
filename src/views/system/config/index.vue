<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getDict } from "@/utils/dict"
import { Config, Form, Create, Update, Get, Delete, List, apiPrefix } from "@/api/system/config"

defineOptions({
  // 命名当前组件
  name: "config"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const formData = ref<Form>({})
const formRules: FormRules = reactive({
  path: [{ required: true, trigger: "blur", message: "请输入api路径" }],
  description: [{ required: true, trigger: "blur", message: "请输入api简介" }],
  apiGroup: [{ required: true, trigger: "blur", message: "请输入api分组" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateKey.value === undefined) {
        Create(formData.value)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        Update(currentUpdateKey.value, {
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
  currentUpdateKey.value = undefined
  formRef.value?.resetFields()
  formData.value = {}
}
//#endregion

//#region 删
const handleDelete = (row: Config) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    Delete({ key: [row.key] }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateKey = ref<undefined | string>(undefined)
const handleUpdate = (row: Config) => {
  Get(row.key).then((res) => {
    currentUpdateKey.value = row.key
    Object.assign(formData.value, res.data || {})
    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<Config[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  label: "",
  key: "",
  value: "",
  type: "",
  remark: ""
})
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    label: searchData.label || undefined,
    key: searchData.key || undefined,
    value: searchData.value || undefined,
    type: searchData.type || undefined,
    remark: searchData.remark || undefined
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
// 获取字典

const typeOptions = getDict("system_setting_type")
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="label" label="Label">
          <el-input v-model="searchData.label" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="key" label="Key">
          <el-input v-model="searchData.key" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="value" label="Value">
          <el-input v-model="searchData.value" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="searchData.type">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="searchData.remark" placeholder="请输入" />
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
            >新增系统配置</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="label" label="Label" min-width="110" />
          <el-table-column prop="key" label="Key" min-width="110" />
          <el-table-column prop="type" label="类型" min-width="160" />
          <el-table-column prop="remark" label="备注" min-width="110" />
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
      :title="currentUpdateKey === undefined ? '新增' : '修改'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item prop="key" label="Key">
          <el-input v-model="formData.key" :disabled="currentUpdateKey !== undefined" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="formData.type" placeholder="请选择展示方式" clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Value:" prop="value">
          <el-input type="textarea" v-model="formData.value" placeholder="请填写值选项，格式：label=value，一行一个" />
        </el-form-item>
        <el-form-item prop="label" label="中文名称:">
          <el-input v-model="formData.label" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input type="textarea" v-model="formData.remark" placeholder="请输入" />
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
