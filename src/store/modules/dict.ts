import { reactive } from "vue"
import { defineStore } from "pinia"
import { List as DetailList } from "@/api/system/dict-detail"
import { GetByType } from "@/api/system/dict"

export interface Dict {
  label: string
  value: string
}
interface DictMap {
  [type: string]: Dict[]
}
export const useDictStore = defineStore("dict", () => {
  /** 获取字典 */
  const dictMap: DictMap = reactive({})
  const getDictOfType = async (type: string) => {
    if (dictMap[type] as Dict[]) {
      return dictMap[type]
    } else {
      const res = await GetByType(type)
      if (res.code === 0) {
        const dict: Dict[] = []
        const detail = await DetailList({
          dict_id: Number(res.data.id),
          page: 1,
          page_size: 999
        })
        detail.data.list &&
          detail.data.list.map((item) => {
            dict.push({
              label: item.label,
              value: item.value
            })
          })
        dictMap[type] = dict
      }
    }
  }
  return { dictMap, getDictOfType }
})
