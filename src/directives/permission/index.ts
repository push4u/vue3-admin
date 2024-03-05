import { Directive, nextTick } from "vue"
import { usePermissionStoreHook } from "@/store/modules/permission"

/** 权限指令 */
export const permission: Directive = {
  async mounted(el, binding) {
    const permissionStore = usePermissionStoreHook()
    let permissions = permissionStore.apiPermissionMap

    // 如果没有权限信息，那么获取权限信息
    if (Object.keys(permissions).length === 0) {
      await permissionStore.fetchPermissions()
      permissions = permissionStore.apiPermissionMap
    }

    await nextTick() // 等待 DOM 更新完成
    if (!permissions[binding.value]) {
      el.style.display = "none"
      // el.parentNode?.removeChild(el)
    }
  }
}
