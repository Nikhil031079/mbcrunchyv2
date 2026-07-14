// MB Crunchy — Premium SEO Component
// Handles dynamic meta tags, Open Graph, Twitter Cards, and structured data.
import { useEffect } from "react";
import { useAppSettings } from "@/hooks/useAppSettings";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  keywords?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  keywords,
  noIndex,
}: SEOProps) {
  const settings = useAppSettings();

  const siteName = settings?.branding?.storeName ?? settings?.business?.name ?? "MB Crunchy";
  const tagline = settings?.business?.tagline ?? "Fresh • Homemade • Premium";
  const defaultTitle = settings?.seo?.defaultTitle ?? `${siteName} — ${tagline}`;
  const defaultDescription = settings?.seo?.defaultDescription ?? "Your destination for premium frozen foods, homemade snacks, cold-pressed oils, natural honey, and organic products.";
  const defaultImage = settings?.seo?.ogImage ?? "";
  const twitterHandle = settings?.seo?.twitterHandle ?? "@mbcrunchy";
  const primaryColor = settings?.branding?.primaryColor ?? "#C62828";

  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description ?? defaultDescription;
  const pageImage = image ?? defaultImage;
  const pageUrl = url ?? (typeof window !== "undefined" ? window.location.href : "/");
  const pageKeywords = keywords ?? settings?.seo?.metaKeywords ?? "frozen foods, homemade snacks, cold pressed oils, honey, organic food, Mumbai";

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Helper to set or update meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const removeMeta = (name: string, property = false) => {
      const attr = property ? "property" : "name";
      const el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) el.remove();
    };

    // Standard meta
    setMeta("description", pageDescription);
    setMeta("keywords", pageKeywords);

    // Theme color
    setMeta("theme-color", primaryColor);

    // Open Graph
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", pageDescription, true);
    setMeta("og:type", type, true);
    setMeta("og:url", pageUrl, true);
    setMeta("og:site_name", siteName, true);
    if (pageImage) setMeta("og:image", pageImage, true);
    if (publishedTime) setMeta("article:published_time", publishedTime, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", twitterHandle);
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", pageDescription);
    if (pageImage) setMeta("twitter:image", pageImage);

    // Robots
    if (noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      removeMeta("robots");
    }

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    // JSON-LD Structured Data
    let script = document.querySelector("#structured-data");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === "product" ? "Product" : type === "article" ? "Article" : "WebSite",
      name: pageTitle,
      description: pageDescription,
      url: pageUrl,
      ...(pageImage ? { image: pageImage } : {}),
      ...(type === "website"
        ? {
            "@type": "WebSite",
            name: siteName,
            url: pageUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${pageUrl}search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }
        : {}),
    };
    script.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup is optional — next SEO call will overwrite
    };
  }, [pageTitle, pageDescription, pageImage, pageUrl, type, pageKeywords, primaryColor, siteName, twitterHandle, publishedTime, noIndex]);

  return null; // This is a head-only component
}
