<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Refresh, Search } from "@element-plus/icons-vue"
import { Plus } from "@element-plus/icons-vue"
import type { UploadProps } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { getToken } from "@/utils/cache/cookies"
import { User, Form, Create, Update, Get, Delete, List, apiPrefix } from "@/api/system/user"
import * as Role from "@/api/system/role"
import * as Group from "@/api/system/group"
import * as File from "@/api/system/file"

defineOptions({
  // 命名当前组件
  name: "user"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<Form>({})
const formRulesCreate: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  confirm_password: [{ required: true, trigger: "blur", message: "请确认密码" }],
  nickname: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  phone: [{ required: true, trigger: "blur", message: "请输入手机号" }],
  email: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
  group_id: [{ required: true, trigger: "change", message: "请选择部门" }],
  roles: [{ required: true, trigger: "change", message: "请选择角色" }]
})
const formRulesUpdate: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  nickname: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  phone: [{ required: true, trigger: "blur", message: "请输入手机号" }],
  email: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
  group_id: [{ required: true, trigger: "change", message: "请选择部门" }],
  roles: [{ required: true, trigger: "change", message: "请选择角色" }]
})
//上传头像
const token = getToken()
const path = import.meta.env.VITE_BASE_API

const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  formData.value.avatar = response.data.id
  formData.value.avatar_file = response.data
}

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/jpg" && rawFile.type !== "image/png") {
    ElMessage.error("头像图片只能是 JPG 或 PNG 格式!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("头像图片大小不能超过 2MB!")
    return false
  }
  return true
}

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
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除该用户吗？`, "提示", {
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
const handleUpdate = (row: User) => {
  Get(row.id).then((res) => {
    currentUpdateId.value = res.data.id
    Object.assign(formData.value, res.data || {})
    // 特殊处理角色
    const element = res.data
    if ((element.roles?.length ?? 0) > 0) {
      const tmp: number[] = []
      element.roles?.forEach((ele) => {
        tmp.push(ele.id)
      })
      formData.value.roles = tmp
    }

    dialogVisible.value = true
  })
}
//#endregion

//#region 查
const tableData = ref<User[]>([])
const searchFormRef = ref<FormInstance | null>(null)
type SearchData = {
  group_id: number
  role_id: number
  keyword: string
}
const searchData: SearchData = reactive({
  group_id: 0,
  role_id: 0,
  keyword: ""
})
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize,
    group_id: searchData.group_id,
    role_id: searchData.role_id,
    keyword: searchData.keyword
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
      tableData.value.forEach((element) => {
        if ((element.roles?.length ?? 0) > 0) {
          let tmp: string = ""
          element.roles?.forEach((ele) => {
            tmp = tmp + ele.name + ","
          })
          element.roleDataForDisplay = tmp.slice(0, -1)
        }
      })
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

//#region 查 -查询时下拉内容获取

// 角色下拉内容获取  部门下拉内容获取
const cascaderProps = {
  checkStrictly: true,
  emitPath: false
}
const roleCascaderPropsMultiple = {
  ...cascaderProps,
  multiple: true
}

const roleSelect = ref<Select[]>([])
const getRoleSelect = () => {
  Role.Select().then((res) => {
    roleSelect.value = res.data
  })
}
getRoleSelect()

const groupSelect = ref<Select[]>([])
const getGroupSelect = () => {
  Group.Select().then((res) => {
    groupSelect.value = res.data
  })
}
getGroupSelect()

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="group_id" label="部门">
          <el-cascader
            v-model="searchData.group_id"
            :options="groupSelect"
            :props="cascaderProps"
            placeholder="请选择"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-cascader
            v-model="searchData.role_id"
            :options="roleSelect"
            :props="cascaderProps"
            placeholder="请选择"
            :show-all-levels="false"
            clearable
          />
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
      <div class="toolbar-wrapper">
        <div>
          <el-button v-permission="apiPrefix + '_POST'" type="primary" :icon="CirclePlus" @click="dialogVisible = true"
            >新增用户</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="ID" min-width="110" />
          <el-table-column prop="username" label="用户名" min-width="110" />
          <el-table-column prop="nickname" label="姓名" min-width="160" sortable />
          <el-table-column prop="phone" label="手机号" min-width="110" />
          <el-table-column prop="email" label="邮箱" min-width="110" />
          <el-table-column prop="group" label="部门" min-width="110">
            <template #default="scope">
              <span>{{ scope.row.group.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roleDataForDisplay" label="角色" min-width="110" />
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button
                v-permission="apiPrefix + '/:id_PUT'"
                type="primary"
                text
                bg
                size="small"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-permission="apiPrefix + '_DELETE'"
                type="danger"
                text
                bg
                size="small"
                :disabled="scope.row.id == 1 ? true : false"
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
      <el-form
        ref="formRef"
        :model="formData"
        :rules="currentUpdateId === undefined ? formRulesCreate : formRulesUpdate"
        :validate-on-rule-change="false"
        label-width="100px"
        label-position="right"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" :disabled="currentUpdateId !== undefined" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId === undefined" prop="confirm_password" label="确认密码">
          <el-input v-model="formData.confirm_password" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="nickname" label="姓名">
          <el-input v-model="formData.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="group_id" label="部门">
          <el-cascader
            v-model="formData.group_id"
            :options="groupSelect"
            :props="cascaderProps"
            placeholder="请选择"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>
        <el-form-item prop="roles" label="角色">
          <el-cascader
            v-model="formData.roles"
            :options="roleSelect"
            :props="roleCascaderPropsMultiple"
            :disabled="currentUpdateId == 1"
            placeholder="请选择"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>
        <el-form-item label="头像" label-width="80px">
          <el-upload
            class="avatar-uploader"
            :action="`${path + File.apiPrefix}`"
            :show-file-list="false"
            :headers="{ Authorization: 'Bearer ' + token }"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formData.avatar_file && formData.avatar_file.url.length > 0"
              :src="formData.avatar_file && formData.avatar_file.url"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
