/**
 * 控制并发请求
 * @param tasks 请求数组
 * @param count 最大并发数
 * @returns 
 */
function concurRequest(tasks, count) {
  return new Promise((resolve) => {
    const n = tasks.length
    let finishCount = 0
    let index = 0
    const results: any[] = []
    async function _request() {
      if (index >= n) {
        return
      }
      const i = index
      const task = tasks[index++]
      const resp = await task()
      results[i] = resp
      finishCount++
      if (finishCount === n) {
        resolve(results)
      }
      _request()
    }
    for (let i = 0; i < Math.max(count, n); i++) {
      _request()
    }
  })
}