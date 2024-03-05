import { reactive } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { List as ApiList } from "@/api/system/api"
// 操作权限的数据存储，后端会将该用户的api权限返回，api数据包含路由和请求方式，路由对应前端的路由，请求方式对应前端的按钮权限，这里需要将后端返回的数据处理成前端能用的路由格式，并且数据存储在vuex中，这样前端就可以根据路由和按钮权限来控制页面的显示和操作。

export const usePermissionStore = defineStore("permission", () => {
  const apiPermissionMap: { [key: string]: boolean } = reactive({})
  const fetchPermissions = async () => {
    const res = await ApiList({ page: 1, page_size: 999 })
    if (res.code === 0) {
      res.data.list.forEach((permission) => {
        const api = `${permission.path}_${permission.method}`
        apiPermissionMap[api] = true
      })
    }
  }

  if (Object.keys(apiPermissionMap).length === 0) {
    fetchPermissions()
  }

  return {
    apiPermissionMap,
    fetchPermissions
  }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
