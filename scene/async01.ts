/**
 * 控制并发请求
 * @param tasks 请求数组
 * @param count 最大并发数
 * @returns 
 */
function concurRequest(tasks, count) {
  return new Promise((resolve) => {
    const n = tasks.length;
    if (n === 0) {
      resolve([]);
      return;
    }
    let finishCount = 0;
    let index = 0;
    const results: any[] = [];
    const queue: Promise<void>[] = [];

    async function _request() {
      if (index >= n) {
        return;
      }
      const i = index;
      const task = tasks[index++];
      try {
        const resp = await task();
        results[i] = resp;
      } catch (error) {
        results[i] = error;
      }
      finishCount++;
      if (finishCount === n) {
        resolve(results);
      } else {
        queue.push(_request());
      }
    }

    for (let i = 0; i < Math.min(count, n); i++) {
      queue.push(_request());
    }

    Promise.all(queue).then(() => {
      if (finishCount === n) {
        resolve(results);
      }
    });
  });
}