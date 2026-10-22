// Asset paths are handled by Lovable's image host, not by external hosts such as Vercel.
const assetOrigin = "https://assetz-sublime.lovable.app";

export function hostedAsset<T extends { url: string }>(asset: T): T {
  return {
    ...asset,
    url: asset.url.startsWith("/__l5e/assets-v1/")
      ? new URL(asset.url, assetOrigin).href
      : asset.url,
  };
}