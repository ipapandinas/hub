/* eslint-disable */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sleepError = async (ms: number) => {
  await sleep(ms);
  throw new Error("Operation timed out");
};

export const timeoutFunction = async (fn: any, ms: number) => {
  return Promise.race([fn(), sleepError(ms)]);
};

export const retry = async <T extends (...arg0: any[]) => any>(
  fn: T,
  params: Parameters<T>,
  attempt: number = 3,
  time: number = 3000,
): Promise<Awaited<ReturnType<T>>> => {
  try {
    const data = await fn(...params);
    return data;
  } catch (e) {
    if (attempt === 0) {
      throw e;
    }
    await new Promise((sleep) => setTimeout(sleep, time));
    return retry(fn, params, attempt - 1, time);
  }
};
