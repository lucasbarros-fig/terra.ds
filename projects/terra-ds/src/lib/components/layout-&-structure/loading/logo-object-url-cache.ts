const resolvedByUrl = new Map<string, string>();
const promisesByUrl = new Map<string, Promise<void>>();

async function ensureLogoPreloaded(url: string): Promise<void> {
  if (resolvedByUrl.has(url)) {
    return;
  }
  let pending = promisesByUrl.get(url);
  if (!pending) {
    pending = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const blob = await res.blob();
        resolvedByUrl.set(url, URL.createObjectURL(blob));
      } catch {
        resolvedByUrl.set(url, url);
      }
    })().finally(() => {
      promisesByUrl.delete(url);
    });
    promisesByUrl.set(url, pending);
  }
  await pending;
}

export async function preloadLogoUrls(urls: string[]): Promise<void> {
  const uniqueUrls = [...new Set(urls)];
  await Promise.all(uniqueUrls.map((url) => ensureLogoPreloaded(url)));
}

export function getResolvedLogoSrc(url: string): string {
  return resolvedByUrl.get(url) ?? url;
}
