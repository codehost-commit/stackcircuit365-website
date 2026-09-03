import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stackcircuit.dev";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/for-developers/`, priority: 0.8 },
    { url: `${base}/for-beginners/`, priority: 0.8 },
    { url: `${base}/about/`, priority: 0.7 },
    { url: `${base}/legal/`, priority: 0.3 }
  ];
}
