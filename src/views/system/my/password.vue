<script lang="ts" setup>
import { ref } from "vue"
import { type FormInstance, ElMessage } from "element-plus"

import { MyPasswordForm, UpdateMyPassword } from "@/api/system/my"

defineOptions({
  // 命名当前组件
  name: "myPassword"
})

const passwordForm = ref<MyPasswordForm>({
  old_password: "",
  new_password: ""
})

const rules = {
  old_password: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" }
  ],
  new_password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" }
  ]
}

const formRef = ref<FormInstance | null>(null)

const save = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      UpdateMyPassword({
        old_password: passwordForm.value.old_password,
        new_password: passwordForm.value.new_password
      }).then(() => {
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
</script>

<template>
  <div>
    <el-form :model="passwordForm" :rules="rules" label-width="80px" ref="formRef">
      <el-form-item :minlength="6" label="原密码" prop="oldPassword">
        <el-col :span="12">
          <el-input show-password v-model="passwordForm.old_password" placeholder="原密码" />
        </el-col>
      </el-form-item>
      <el-form-item :minlength="6" label="新密码" prop="newPassword">
        <el-col :span="12">
          <el-input show-password v-model="passwordForm.new_password" placeholder="新密码" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="clean">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
