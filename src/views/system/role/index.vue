<script lang="ts" setup>
import { reactive, ref, watch, computed } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElTree } from "element-plus"
import { CirclePlus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatDateTime } from "@/utils/index"

import { Role, Create, Update, Get, Delete, List, apiPrefix } from "@/api/system/role"
import * as Group from "@/api/system/group"
import * as Api from "@/api/system/api"

defineOptions({
  // 命名当前组件
  name: "role"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
type FormData = {
  name: string
  groups: number[]
  apis: number[]
}
const formData: FormData = reactive({
  name: "",
  groups: [],
  apis: []
})
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入名称" }]
})
const apiTreeProps = {
  label: "description",
  children: "children"
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      // 去掉formData.apis中string的项保留number的项
      formData.apis = treeRef
        .value!.getCheckedKeys(false)
        .filter((ele) => typeof ele === "number")
        .map(Number)

      if (currentUpdateId.value === undefined) {
        Create({
          name: formData.name,
          group_id: formData.groups,
          api_id: formData.apis
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
          name: formData.name,
          group_id: formData.groups,
          api_id: formData.apis
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
const treeRef = ref<InstanceType<typeof ElTree>>()
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.apis = []
  formData.groups = []
  formData.name = ""
  resetChecked()
}
//#endregion

//#region 删
const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`此操作将永久删除该角色，是否继续？`, "提示", {
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
const handleUpdate = (row: Role) => {
  Get(row.id).then((res) => {
    const element = res.data
    if (element.groups != null && element.groups?.length > 0) {
      const tmp: number[] = []
      element.groups.forEach((ele) => {
        tmp.push(ele.id)
      })
      formData.groups = tmp
    }
    if (element.apis != null && element.apis?.length > 0) {
      const tmp: number[] = []
      element.apis.forEach((ele) => {
        tmp.push(ele.id)
      })
      formData.apis = tmp
    }
    currentUpdateId.value = res.data.id
    formData.name = res.data.name
    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<Role[]>([])
const getTableData = () => {
  loading.value = true
  List({ page: 1, page_size: 20 })
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

//#region 部门下拉内容获取 用于新增/修改
const groupCascaderPropsMultiple = {
  checkStrictly: true,
  emitPath: false,
  multiple: true
}

const groupSelect = ref<Select[]>([])
const getGroupSelect = () => {
  Group.Select().then((res) => {
    groupSelect.value = res.data
  })
}
getGroupSelect()

//#endregion

// #region api下拉内容获取 用于新增/修改
interface apiTree {
  description: string
  id: string | number
  children: Api.Api[]
}
const apiList = ref<apiTree[]>([])

const getApiList = () => {
  Api.List({ page: 1, page_size: 999 }).then((res: Api.ListRes) => {
    let tmp: Api.Api[] = []
    tmp = res.data.list
    // 处理数据 取出api_group相同的数据为一组 组成children 使其符合el-tree的数据格式
    const apiGroup = [...new Set(tmp.map((ele: Api.Api) => ele.api_group))]
    apiGroup.forEach((ele) => {
      // TODO 不需要验证权限的接口remove掉，用户体验更好，不然用户会疑惑为什么有些接口没有权限也能访问
      // TODO 想办法将左侧菜单改成，点击也可以重新获取数据，用户体验更好，能兼容更多的用户习惯，用户体验的本质就是兼容更多的用户习惯
      apiList.value.push({
        description: ele,
        id: ele,
        children: []
      })
    })

    tmp.forEach((ele: Api.Api) => {
      apiList.value.forEach((item: apiTree) => {
        if (item.description === ele.api_group) {
          item.children.push(ele)
        }
      })
    })
  })
}
getApiList()
// #endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
const timeHandle = computed(() => (time: string) => {
  return formatDateTime(time)
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" v-permission="apiPrefix + '_POST'" :icon="CirclePlus" @click="dialogVisible = true"
            >新增角色</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="name" label="角色名称" min-width="110" />
          <el-table-column prop="nickname" label="创建人" min-width="110">
            <template #default="scope">
              {{ scope.row.user?.username }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" min-width="160" sortable>
            <template #default="scope">
              {{ timeHandle(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="最后更新时间" min-width="160" sortable>
            <template #default="scope">
              {{ timeHandle(scope.row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
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
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="groups" label="数据权限">
          <el-cascader
            v-model="formData.groups"
            :options="groupSelect"
            :props="groupCascaderPropsMultiple"
            placeholder="请选择"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>
        <el-form-item prop="apis" label="操作权限">
          <!-- :default-expand-all="true"  -->
          <el-tree
            ref="treeRef"
            :data="apiList"
            show-checkbox
            node-key="id"
            highlight-current
            :default-checked-keys="formData.apis"
            :props="apiTreeProps"
          />
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
@/api/system-manage/group-manage@/api/system-manage/group-manage/types/table@/api/system-manage/api@/api/system/role-manage@/api/system/role-manage/types/table@/api/system/group-manage@/api/system/group-manage/types/table
