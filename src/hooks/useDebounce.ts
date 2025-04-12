import { debounce } from "lodash"


export const useDebounce = (func: (...args: any[]) => void, delay: number) => {
    return debounce(func, delay)
}

