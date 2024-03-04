<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

import { Menu, Form, Create, Delete, Get, List, Update, apiPrefix } from "@/api/system/menu"
import * as Api from "@/api/system/api"

defineOptions({
  // 命名当前组件，因为不能用menu。
  // 在 Vue.js 组件中使用 "menu" 这个名称，但是 "menu" 是 HTML 中的保留字，不能用作组件名。
  //在 HTML 中，"menu" 是一个已经被废弃的元素，用于创建一个菜单列表。虽然这个元素已经不再推荐使用，但是它的名称仍然是保留的。
  name: "menus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const drawerVisible = ref<boolean>(false)
const ID = ref<number>(0)
const checkFlag = ref<boolean>(false)

let drawerTitle = "新增菜单"
const formRef = ref<FormInstance | null>(null)

const formData = reactive<Form>({
  name: "",
  path: "",
  hidden: false,
  parent_id: 0,
  component: "",
  meta: {
    title: "",
    icon: "",
    keep_alive: false,
    layout: "",
    api_id: 0,
    default_menu: false,
    close_tab: false,
    new_window_open: false
  },
  sort: 0,
  parameters: []
})

const rules: FormRules = reactive({
  // name: [{ required: true, trigger: "blur", message: "请输入名称" }],
  // sort: [{ required: true, trigger: "blur", message: "请输入名称" }],
  // leader: [{ required: true, trigger: "blur", message: "请输入名称" }],
  // status: [{ required: true, trigger: "blur", message: "请输入名称" }]
})
// 获取图标 取出对象的key组成数组
const options = Object.keys(ElementPlusIconsVue)
// 关闭抽屉
const handleClose = (done: () => void) => {
  initForm()
  done()
}
const initForm = () => {
  checkFlag.value = false
  formRef.value?.resetFields()
}

// 每次点新增和修改，都重置一下menuOption，否则会导致父级菜单的禁用项（不能选自己和自己的子菜单作为父级菜单）一直不变
const resetMenuOption = () => {
  menuOption.splice(0, menuOption.length, { id: 0, title: "根目录" })
}

// 添加菜单方法，id为 0则为添加根菜单

const addMenu = (id: number) => {
  resetMenuOption()
  drawerVisible.value = true
  drawerTitle = "新增菜单"
  formData.parent_id = id
  ID.value = 0
  setMenuOptions(tableData.value, menuOption, false)
}

interface MenuOption {
  id: number
  title: string
}

const menuOption = reactive<MenuOption[]>([
  {
    id: 0,
    title: "根目录"
  }
])

const setMenuOptions = (menuData: Menu[], optionsData: MenuOption[], disabled: boolean) => {
  menuData &&
    menuData.map((item) => {
      if (item.children && item.children.length) {
        const option = {
          title: item.meta.title,
          id: item.id,
          disabled: disabled || item.id === ID.value,
          children: []
        }
        setMenuOptions(item.children, option.children, disabled || option.id === ID.value)
        optionsData.push(option)
      } else {
        const option = {
          title: item.meta.title,
          id: item.id,
          disabled: disabled || item.id === ID.value
        }
        optionsData.push(option)
      }
    })
}
// 添加menu
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      let res
      if (ID.value > 0) {
        res = await Update(ID.value, formData)
      } else {
        res = await Create(formData)
      }
      if (res.code === 0) {
        ElMessage({
          type: "success",
          message: ID.value > 0 ? "编辑成功" : "添加成功!"
        })
        getTableData()
      }
      initForm()
      drawerVisible.value = false
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
//#endregion

//#region 删
const deleteMenu = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const res = await Delete({ id: [id] })
      if (res.code === 0) {
        ElMessage.success("删除成功")
        getTableData()
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除")
    })
}
//#endregion

//#region 改
// 修改菜单方法
const handleUpdate = async (row: Menu) => {
  resetMenuOption()
  drawerVisible.value = true
  drawerTitle = "编辑菜单"
  const res = await Get(row.id)
  Object.assign(formData, res.data || {})
  ID.value = row.id
  setMenuOptions(tableData.value, menuOption, false)
}
//#endregion

//#region 查
const tableData = ref<Menu[]>([])
const getTableData = () => {
  loading.value = true
  List({
    page: paginationData.currentPage,
    page_size: paginationData.pageSize
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

// #region api下拉内容获取 用于新增/修改
const cascaderProps = {
  emitPath: false,
  label: "description",
  value: "id"
}

interface ApiTreeData {
  description: string
  id: string | number
  children: Api.Api[]
}
const apiList = ref<ApiTreeData[]>([])

const getApiTableData = () => {
  Api.List({ page: 1, page_size: 999 }).then((res) => {
    let tmp: Api.Api[] = []
    tmp = res.data.list
    // 处理数据 取出api_group相同的数据为一组 组成children 使其符合el-tree的数据格式
    const apiGroup = [...new Set(tmp.map((ele: Api.Api) => ele.api_group))]
    apiGroup.forEach((ele) => {
      apiList.value.push({
        description: ele,
        id: ele,
        children: []
      })
    })

    tmp.forEach((ele: Api.Api) => {
      apiList.value.forEach((item: ApiTreeData) => {
        if (item.description === ele.api_group) {
          item.children.push(ele)
        }
      })
    })
  })
}
getApiTableData()
// #endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" v-permission="apiPrefix + '_POST'" :icon="CirclePlus" @click="addMenu(0)"
            >新增菜单</el-button
          >
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" row-key="id">
          <el-table-column prop="title" label="菜单" min-width="150">
            <template #default="scope">
              <span><i :class="`${scope.row.meta.icon}`" /> {{ scope.row.meta.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路由" min-width="110" />
          <el-table-column prop="layout" label="布局" min-width="110">
            <template #default="scope">
              {{ scope.row.meta.layout }}
            </template>
          </el-table-column>
          <el-table-column prop="newWindowOpen" label="新窗口打开" min-width="110">
            <template #default="scope">
              {{ scope.row.meta.newWindowOpen ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column prop="hidden" label="是否显示" min-width="110">
            <template #default="scope">
              {{ scope.row.hidden ? "隐藏" : "显示" }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" min-width="70" />
          <el-table-column prop="component" label="文件路径" min-width="160" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button
                v-permission="apiPrefix + '_POST'"
                @click="addMenu(scope.row.id)"
                type="primary"
                text
                bg
                size="small"
                >子菜单</el-button
              >
              <el-button
                v-permission="apiPrefix + '/:id_PUT'"
                @click="handleUpdate(scope.row)"
                type="primary"
                text
                bg
                size="small"
                >编辑</el-button
              >
              <el-button
                v-permission="apiPrefix + '_DELETE'"
                @click="deleteMenu(scope.row.id)"
                type="danger"
                text
                bg
                size="small"
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
    <el-drawer v-model="drawerVisible" :before-close="handleClose" size="600px" :title="drawerTitle">
      <div style="padding: 15px">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
          <el-form-item label="路由name" prop="name">
            <el-input v-model="formData.name" autocomplete="off" placeholder="唯一英文字符串" />
          </el-form-item>
          <el-form-item prop="path" label="路由path">
            <el-input v-model="formData.path" autocomplete="off" placeholder="建议只在后方拼接参数" />
          </el-form-item>
          <el-form-item prop="hidden" label="是否隐藏">
            <el-select v-model="formData.hidden" placeholder="是否在列表隐藏">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
          <el-form-item label="父级菜单">
            <el-cascader
              v-model="formData.parent_id"
              :options="menuOption"
              :props="{
                checkStrictly: true,
                label: 'title',
                value: 'id',
                disabled: 'disabled',
                emitPath: false
              }"
              :show-all-levels="false"
              filterable
            />
          </el-form-item>
          <el-form-item label="文件路径" prop="component">
            <el-input v-model="formData.component" />
            <el-button @click="formData.component = 'layouts/index.vue'">是父级菜单</el-button>
          </el-form-item>
          <el-form-item label="展示名称" prop="title">
            <el-input v-model="formData.meta.title" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-select class="gva-select" style="width: 100%" v-model="formData.meta.icon" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item">
                <el-icon :size="20" style="vertical-align: middle">
                  <component :is="item" />
                </el-icon>
                <span style="margin-left: 5px">{{ item }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="sort" label="排序">
            <el-input-number v-model="formData.sort" autocomplete="off" />
          </el-form-item>
          <el-form-item label="keepAlive" prop="meta.keepAlive">
            <el-select v-model="formData.meta.keep_alive">
              <el-option :value="false" label="否" />
              <el-option :value="true" label="是" />
            </el-select>
          </el-form-item>
          <el-form-item prop="layout" label="布局">
            <el-input v-model="formData.meta.layout" autocomplete="off" placeholder="布局" />
          </el-form-item>
          <el-form-item prop="api_id" label="Api">
            <el-cascader
              v-model="formData.meta.api_id"
              :options="apiList"
              :props="cascaderProps"
              placeholder="请选择"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer el-table__fixed-footer-wrapper" style="padding: 10px; display: block">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </div>
    </el-drawer>
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
