# CDN | Content Delivery Network

- Distributed network of servers to reduce the geographical distance between the user and the server

```
without CDN

client (Tokyo) <---> server (NY) [around 300ms]

with CDN

client (Tokey) <---> edge server (Tokyo) [around 40ms]
```

## Type of content

- Initially, CDNs were thought to deal with static content, but nowadays they have dynamic optmizations

### Static: core use case

- Media files: images, video, audio
- Frontend assets: JS bundles, CSS, HTML
- Web fonts
- File downloads: app installers, PDF, game update patches

### Dynamic: modern use case

Modern CDNs (cloudflare, fastly, aws cloudfront) don't just cache files anymore, they can execute code using edge computing

- A/B testing: routing users to different versions of a site right a the edge server
- Geolocation optimizatoin: modifying content based on the user's physical country before serving HTML (e.g. changing the default language)
- API shieding / Gateways: caching semi-dynamic API responses (e.g. product catalogs) for a few seconds
