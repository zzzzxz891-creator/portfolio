export function createSitePaths(base = '/') {
  const basePath = `/${base.split('/').filter(Boolean).join('/')}${base === '/' ? '' : '/'}`;
  const normalized = basePath === '' ? '/' : basePath;
  const sitePath = path => `${normalized}${path.replace(/^\//, '')}`;
  const assetPath = path => path.replace(/(^|,\s*)\/assets\//g, `$1${normalized}assets/`);
  const assetData = value => {
    if (typeof value === 'string') return assetPath(value);
    if (Array.isArray(value)) return value.map(assetData);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, assetData(item)]));
    return value;
  };
  const appRoute = (pathname, hash = '') => {
    const path = pathname.startsWith(normalized) ? `/${pathname.slice(normalized.length)}` : pathname;
    return path + hash;
  };
  return { sitePath, assetPath, assetData, appRoute };
}

export const { sitePath, assetPath, assetData, appRoute } = createSitePaths(import.meta.env?.BASE_URL || '/');
