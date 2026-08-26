# Visitor location analytics

The GitHub Pages frontend already sends each visit to the configured analytics Worker. Country/city data must be added at the Worker layer because GitHub Pages does not expose visitor IP/geolocation to page JavaScript.

Required Worker behavior:
- Read Cloudflare request geolocation fields when available (for example country, region, city, timezone, continent).
- Store country and city with each tracked visit.
- Return aggregated location data from `/api/admin/stats`, for example `locations: [{country, city, visitors, visits}]`.
- Do not store raw IP addresses in the analytics database.
- Admin dashboard should display country and city totals only after authentication.

The current repository frontend visitor tracker posts visits to the analytics Worker; see `visitor-tracker.js`.
