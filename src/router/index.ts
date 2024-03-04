import { type RouteRecordRaw, createRouter } from "vue-router"
import { history } from "./helper"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    redirect: "/welcome"
  },
  {
    path: "/welcome",
    component: Layouts,
    redirect: "/welcome/index",
    name: "welcome",
    meta: {
      title: "welcome",
      hidden: true
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/welcome/index.vue"),
        name: "welcomedetail",
        meta: {
          title: "welcome",
          hidden: true
        }
      }
    ]
  },
  {
    path: "/setting",
    component: Layouts,
    redirect: "/setting/index",
    name: "setting",
    meta: {
      title: "设置",
      hidden: true
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/system/my/index.vue"),
        name: "setting",
        meta: {
          title: "设置",
          hidden: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  // routes: flatMultiLevelRoutes(constantRoutes)
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
