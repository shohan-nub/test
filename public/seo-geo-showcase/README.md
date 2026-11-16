# SEO/GEO photographic showcase

Seven separate 1200 × 1200 WebPs use different physical subjects:

1. SEO Strategy — one laptop with search-performance analytics.
2. GEO Optimization — a smartphone with a portrait AI answer and citation interface.
3. Technical SEO — a desktop workstation display with a technical website audit.
4. AI Search Optimization — a landscape tablet on a rustic pedestal.
5. Content Strategy — printed editorial layouts, a planning notebook and pencil.
6. AI Automation — physical server racks and network infrastructure.
7. Analytics & Growth — a large business-intelligence presentation in a conference room.

All source material is genuine photography. Appropriate screens contain hand-authored interfaces with the exact uploaded SparkLab logo; the editorial and hardware images have no added logo. See [ASSET-SOURCES.md](ASSET-SOURCES.md) for photographer credits, source pages and licensing.

Existing image paths and HTML titles/descriptions are configured in src/app/components/seo-geo-services.json. Replace WebPs independently while preserving their square aspect ratio. Development and production builds verify that all seven assets exist and are distinct.

Rebuild images with node scripts/prepare-seo-geo-photos.mjs. Source photographs and the three new editable screen SVGs are in design/seo-geo-showcase/. The portrait phone, tablet and presentation interfaces are authored in scripts/create-seo-geo-screens.mjs. The original laptop and desktop interfaces use the existing local SVGs. There is no runtime compositing or new dependency.

The asset check also records a content hash for each image. Image URLs use that hash to refresh optimized/browser caches when a WebP is replaced. Restart development or rebuild after replacing an asset.
