# SEO Guide — MB Crunchy V2

## Overview

MB Crunchy uses a dynamic SEO system that automatically generates meta tags, Open Graph data, Twitter Cards, and structured data for every page.

## Core SEO Component

**`src/components/SEO.tsx`** — The reusable SEO component handles:
- Document title updates
- Meta description tags
- Open Graph (og:) tags
- Twitter Card meta tags
- Canonical URLs
- JSON-LD structured data (Schema.org)
- Theme color tag
- Robots meta tag

## Usage

```tsx
import SEO from "@/components/SEO";

// Basic usage
<SEO />

// Page-specific
<SEO 
  title="Kitchen Menu"
  description="Browse our fresh homemade kitchen menu"
  image="/images/kitchen-og.jpg"
  url="/kitchen"
  type="website"
/>

// Product page
<SEO 
  title="Classic Margherita Pizza"
  description="Fresh handmade pizza with mozzarella cheese"
  image="/products/pizza.jpg"
  url="/product/pizza-001"
  type="product"
/>

// Blog article
<SEO 
  title="5 Tips for Perfect Homemade Pizza"
  description="Learn how to make restaurant-quality pizza at home"
  image="/blog/pizza-tips.jpg"
  type="article"
  publishedTime="2024-01-15T10:00:00Z"
/>
```

## Automatic Features

### Structured Data
The SEO component automatically generates JSON-LD structured data:
- **WebSite** — with SearchAction for site-wide search
- **Product** — for product pages (when `type="product"`)
- **Article** — for blog articles (when `type="article"`)

### Social Sharing
Generated meta tags ensure proper rendering on:
- Facebook / LinkedIn (Open Graph)
- Twitter / X (Twitter Cards)
- WhatsApp / Telegram (OG fallback)
- Google Search (Structured Data)

## Configuration

SEO defaults are configured in the database. Admin can update:
- Default title template
- Default description
- OG image
- Twitter handle
- Meta keywords

## Best Practices

1. Every page should include `<SEO />`
2. Provide unique titles for each page (50-60 chars)
3. Write compelling descriptions (150-160 chars)
4. Use high-quality OG images (1200x630px)
5. Set `type` appropriately (`website`, `product`, `article`)
6. Add `publishedTime` for time-sensitive content

## Robots.txt

The application includes a `robots.txt` configuration accessible at `/robots.txt`.

## Sitemap

A sitemap can be generated dynamically. The SEO infrastructure supports sitemap generation through the Convex backend.
