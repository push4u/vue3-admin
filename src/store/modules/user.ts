import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { resetRouter, constantRoutes } from "@/router"
import { type RouteRecordRaw } from "vue-router"
import { transformBackendRoutes } from "@/router/helper"
import { Form, Login } from "@/api/login"
import { List as MenuList } from "@/api/system/menu"
import { User } from "@/api/system/user"
import { GetMy } from "@/api/system/my"
import { usePermissionStoreHook } from "./permission"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const user = ref<User>()

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async ({ username, password, captcha, captcha_id }: Form) => {
    const { data } = await Login({ username, password, captcha, captcha_id })
    setToken(data.token)
    token.value = data.token
  }
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const backendRoutes = ref<RouteRecordRaw[]>([])

  /** 获取路由详情 */
  const getRoleMenu = async () => {
    const { data } = await MenuList({ page: 1, page_size: 1000 })
    // 将后端返回的数据处理成前端能用的路由格式

    backendRoutes.value = transformBackendRoutes(data.list?.length ? data.list : [])
    routes.value = constantRoutes.concat(backendRoutes.value)
    dynamicRoutes.value = backendRoutes.value
    // flatMultiLevelRoutes
  }

  // 获取自己的信息
  const getMy = async () => {
    const { data } = await GetMy()
    user.value = data
  }
  if (!user.value && token.value) {
    getMy()
  }

  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    user.value = undefined
    resetRouter()
    _resetTagsView()
    usePermissionStoreHook().clearApiPermissionMap()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, user, routes, dynamicRoutes, login, getRoleMenu, getMy, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
