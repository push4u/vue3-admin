<script lang="ts" setup>
import { ref } from "vue"
import { type FormInstance, ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import type { UploadProps } from "element-plus"

import { List as MenuList } from "@/api/system/menu"
import * as Menu from "@/api/system/menu"
import * as File from "@/api/system/file"
import { UpdateMy, GetMy } from "@/api/system/my"
import { FormMy } from "@/api/system/user"

defineOptions({
  // 命名当前组件
  name: "mySetting"
})

const myForm = ref<FormMy>({})

const rules = {
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  avatar: [{ required: true, message: "请选择头像", trigger: " blur" }]
}

const formRef = ref<FormInstance | null>(null)
const displayValue = ref<string[]>()
const token = getToken()
const path = import.meta.env.VITE_BASE_API

// 获取我的信息
GetMy().then((res) => {
  Object.assign(myForm.value, res.data || {})

  // 分割字符串并处理每个层级
  if (res.data.option) {
    const parts = res.data.option.default_router.split("/").filter(Boolean)
    displayValue.value = parts.map((part, index) => {
      if (index === 0) {
        return `/${part}`
      } else {
        return part
      }
    })
  }
})

const cascaderProps = {
  label: "title",
  value: "path"
}

const handleChange = (value: any) => {
  // 数组字符串拼接为字符串
  if (myForm.value.option) {
    myForm.value.option.default_router = value.join("/")
  }
}

interface GetMenuForTree {
  title: string
  path: string
  children: GetMenuForTree[]
}
const menuList = ref<GetMenuForTree[]>([])

const convertToMenuData = (data: Menu.Menu[]): GetMenuForTree[] => {
  return data.map((item) => {
    return {
      title: item.meta.title,
      path: item.path,
      children: item.children ? convertToMenuData(item.children) : []
    }
  })
}

const getMenuList = () => {
  MenuList({ page: 1, page_size: 999 }).then((res: Menu.ListRes) => {
    menuList.value = convertToMenuData(res.data.list)
  })
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

const handleAvatarSuccess: UploadProps["onSuccess"] = (response: File.Detail) => {
  myForm.value.avatar = response.data.id
  myForm.value.avatar_file = response.data
}

const uploadError: UploadProps["onError"] = (err) => {
  ElMessage.error(`头像上传失败: ${err}`)
}

const save = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      UpdateMy(myForm.value).then((res) => {
        myForm.value = res.data
        ElMessage.success("修改成功")
        clean()
      })
    } else {
      return false
    }
  })
}

const clean = () => {
  formRef.value?.resetFields()
}

getMenuList()
</script>

<template>
  <div>
    <el-form :model="myForm" :rules="rules" label-width="80px" ref="formRef">
      <el-form-item label="姓名" label-width="80px" prop="nickName">
        <el-col :span="12">
          <el-input v-model="myForm.nickname" />
        </el-col>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px" prop="phone">
        <el-col :span="12">
          <el-input v-model="myForm.phone" />
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="email">
        <el-col :span="12">
          <el-input v-model="myForm.email" />
        </el-col>
      </el-form-item>
      <el-form-item label="头像" label-width="80px">
        <el-upload
          class="avatar-uploader"
          :action="`${path + File.apiPrefix}`"
          :headers="{ Authorization: 'Bearer ' + token }"
          :show-file-list="false"
          :on-error="uploadError"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          v-model="myForm.avatar"
        >
          <img
            v-if="myForm.avatar_file && myForm.avatar_file.url.length > 0"
            :src="myForm.avatar_file && myForm.avatar_file.url"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item prop="default_router" label="默认首页">
        <el-cascader
          v-model="displayValue"
          :options="menuList"
          :props="cascaderProps"
          placeholder="默认首页"
          :show-all-levels="true"
          @change="handleChange"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="clean">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

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
