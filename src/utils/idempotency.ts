const cache: Record<string, any> = {};

export async function idempotentCall(key: string, fn: () => Promise<any>) {
  if (cache[key]) return cache[key];
  const result = await fn();
  cache[key] = result;
  return result;
}
