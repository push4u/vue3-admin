import { ref, onMounted } from "vue"
import { useDictStore } from "@/store/modules/dict"
import { type Dict } from "@/store/modules/dict"

export function getDict(type: string) {
  const dictOptions = ref<Dict[]>([])

  const getDictOptions = async () => {
    await useDictStore().getDictOfType(type)
    dictOptions.value = useDictStore().dictMap[type] || []
  }

  onMounted(getDictOptions)

  return dictOptions
}
