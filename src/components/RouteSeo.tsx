import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { getPostBySlug } from "@/data/blogPosts";

const SITE_NAME = "PSXL";
const SITE_URL = "https://psxl.live";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type SeoPayload = {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
  keywords?: string[];
  jsonLd?: Record<string, unknown>;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, rel: string, href: string) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  element.setAttribute("rel", rel);
  element.setAttribute("href", href);
}

function upsertJsonLd(id: string, data?: Record<string, unknown>) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement("script");
  script.id = id;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(data);
  if (!existing) {
    document.head.appendChild(script);
  }
}

function buildSeo(pathname: string): SeoPayload {
  const blogMatch = matchPath("/blog/:slug", pathname);
  if (blogMatch?.params.slug) {
    const post = getPostBySlug(blogMatch.params.slug);
    if (post) {
      return {
        title: `${post.title} | ${SITE_NAME}`,
        description: post.metaDescription ?? post.excerpt,
        canonicalPath: `/blog/${post.slug}`,
        type: "article",
        keywords: post.keywords,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription ?? post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        },
      };
    }
  }

  const routes: Record<string, SeoPayload> = {
    "/": {
      title: "PSXL | Pakistan Stock Exchange Trading Ledger & Portfolio Tracker",
      description:
        "Track PSX trades, portfolio performance, taxes, and investing habits with a dedicated ledger built for Pakistan Stock Exchange investors.",
      canonicalPath: "/",
      keywords: ["PSX ledger", "Pakistan stock exchange tracker", "portfolio tracker Pakistan", "trading journal PSX"],
    },
    "/about": {
      title: `About ${SITE_NAME} | Built for PSX Traders`,
      description:
        "Learn about PSXL, the trading ledger built for Pakistan Stock Exchange investors with portfolio tracking, analytics, and compliance-focused reporting.",
      canonicalPath: "/about",
    },
    "/contact": {
      title: `Contact ${SITE_NAME}`,
      description:
        "Contact PSXL for product questions, support, and feedback about our Pakistan Stock Exchange ledger and portfolio tracking platform.",
      canonicalPath: "/contact",
    },
    "/blog": {
      title: `${SITE_NAME} Blog | PSX Investing Guides and Analysis`,
      description:
        "Read PSX investing guides, tax explainers, portfolio strategy articles, and market analysis written for Pakistan Stock Exchange investors.",
      canonicalPath: "/blog",
      keywords: ["PSX blog", "Pakistan stock market guides", "PSX investing articles"],
    },
    "/privacy": {
      title: `Privacy Policy | ${SITE_NAME}`,
      description: "Read how PSXL collects, uses, stores, and protects your data.",
      canonicalPath: "/privacy",
    },
    "/terms": {
      title: `Terms of Service | ${SITE_NAME}`,
      description: "Review the terms governing your use of the PSXL trading ledger platform.",
      canonicalPath: "/terms",
    },
    "/disclaimer": {
      title: `Financial Disclaimer | ${SITE_NAME}`,
      description:
        "Review PSXL's financial and tax disclaimer, including limitations around market data, analytics, and investment information.",
      canonicalPath: "/disclaimer",
    },
    "/features": {
      title: `${SITE_NAME} Features | PSX Ledger, Analytics, and Tax Tracking`,
      description:
        "Explore PSXL features for trade logging, portfolio analytics, dividend tracking, and tax-ready reporting for PSX investors.",
      canonicalPath: "/features",
    },
    "/security": {
      title: `${SITE_NAME} Security | Data Protection for Your Trading Ledger`,
      description:
        "Learn how PSXL protects your data with encryption, backups, and secure account practices.",
      canonicalPath: "/security",
    },
    "/careers": {
      title: `Careers | ${SITE_NAME}`,
      description: "Explore career opportunities at PSXL.",
      canonicalPath: "/careers",
    },
    "/analytics-info": {
      title: `${SITE_NAME} Analytics | Performance and Behavior Tracking`,
      description:
        "Understand how PSXL analytics help investors review trading performance, mistakes, and portfolio behavior.",
      canonicalPath: "/analytics-info",
    },
  };

  return (
    routes[pathname] ?? {
      title: `${SITE_NAME} | Pakistan Stock Exchange Trading Ledger`,
      description:
        "PSXL helps Pakistan Stock Exchange investors track trades, analyze performance, and maintain a reliable portfolio ledger.",
      canonicalPath: pathname,
    }
  );
}

export function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    const seo = buildSeo(location.pathname);
    const canonicalUrl = `${SITE_URL}${seo.canonicalPath}`;

    document.title = seo.title;

    upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: (seo.keywords ?? []).join(", ") });
    upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" });

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: seo.type ?? "website" });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_OG_IMAGE });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });

    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_OG_IMAGE });

    upsertLink('link[rel="canonical"]', "canonical", canonicalUrl);
    upsertJsonLd("route-jsonld", seo.jsonLd);
  }, [location.pathname]);

  return null;
}

export default RouteSeo;
