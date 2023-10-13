export function useDebounce(fn: (x?: unknown) => void, delay: number) {
  let timer: null | number = null
  return (...args: Array<unknown>) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
