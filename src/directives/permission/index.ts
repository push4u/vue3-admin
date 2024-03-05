import { type Directive, nextTick } from "vue"
import { usePermissionStoreHook } from "@/store/modules/permission"

/** 权限指令 */
export const permission: Directive = {
  async mounted(el, binding) {
    const permissionStore = usePermissionStoreHook()
    const permissions = permissionStore.apiPermissionMap
    // 判断map是否为空
    if (Object.keys(permissions).length === 0) {
      await permissionStore.fetchPermissions()
    }
    await nextTick() // 等待 DOM 更新完成
    if (!permissions[binding.value]) {
      el.style.display = "none"
      // el.parentNode?.removeChild(el)
    }
  }
}
