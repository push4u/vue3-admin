<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"

import { DictDetail, Form, Create, Update, Get, Delete, List } from "@/api/system/dict-detail"

defineOptions({
  // 命名当前组件
  name: "dictDetail"
})

// 参数
const params = defineProps({
  dictId: {
    type: Number, //类型字符串
    required: true
  }
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<Form>({})
const formRules: FormRules = reactive({
  label: [{ required: true, trigger: "blur", message: "请输入展示值" }],
  value: [{ required: true, trigger: "blur", message: "请输入字典值" }],
  sort: [{ required: true, trigger: "blur", message: "请输入排序标记" }],
  status: [{ required: true, trigger: "change", message: "请选择状态" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        Create({
          dict_id: params.dictId,
          ...formData.value
        })
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
const handleDelete = (row: DictDetail) => {
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

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: DictDetail) => {
  Get(row.id).then((res) => {
    currentUpdateId.value = row.id
    Object.assign(formData.value, res.data || {})
    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<DictDetail[]>([])
const searchData = reactive({
  keyword: "",
  status: undefined
})
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    dict_id: params.dictId,
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

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
const timeHandle = computed(() => (time: any) => {
  return formatDateTime(time)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增字典项</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="展示名称" prop="label" />
          <el-table-column label="字典值" prop="value" />
          <el-table-column label="启用状态" prop="status" min-width="110">
            <template #default="scope">
              {{ scope.row.status ? "正常" : "禁用" }}
            </template>
          </el-table-column>
          <el-table-column label="排序标记" prop="sort" />
          <el-table-column prop="updated_at" label="更新于" min-width="110">
            <template #default="scope">
              {{ timeHandle(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-form-item prop="label" label="展示值">
          <el-input v-model="formData.label" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="value" label="字典值">
          <el-input v-model="formData.value" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="formData.sort" autocomplete="off" />
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
