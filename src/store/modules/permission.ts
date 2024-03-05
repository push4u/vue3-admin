import { reactive } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { List as ApiList } from "@/api/system/api"

export const usePermissionStore = defineStore("permission", () => {
  const apiPermissionMap: { [key: string]: boolean } = reactive(
    JSON.parse(localStorage.getItem("apiPermissionMap") || "{}")
  )

  const fetchPermissions = async () => {
    const res = await ApiList({ page: 1, page_size: 999 })
    if (res.code === 0) {
      res.data.list.forEach((permission) => {
        const api = `${permission.path}_${permission.method}`
        apiPermissionMap[api] = true
      })
      // 将权限信息存储到 localStorage
      localStorage.setItem("apiPermissionMap", JSON.stringify(apiPermissionMap))
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
