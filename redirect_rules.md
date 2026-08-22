# Domain Consolidation Redirect Rules (Cloudflare)

To safely merge `fr.carecalculus.com` and `es.carecalculus.com` into subdirectories (`carecalculus.com/fr` and `carecalculus.com/es`) while preserving SEO equity, configure the following Page Rules or Redirect Rules in Cloudflare.

## Cloudflare Page Rules (Legacy)

**Rule 1: French Subdomain Redirect**
- **URL Pattern:** `fr.carecalculus.com/*`
- **Setting:** Forwarding URL (Status Code: 301 - Permanent Redirect)
- **Destination URL:** `https://carecalculus.com/fr/$1`

**Rule 2: Spanish Subdomain Redirect**
- **URL Pattern:** `es.carecalculus.com/*`
- **Setting:** Forwarding URL (Status Code: 301 - Permanent Redirect)
- **Destination URL:** `https://carecalculus.com/es/$1`

## Cloudflare Redirect Rules (Modern)

Create a single dynamic redirect rule:
- **Expression:** `(http.host eq "fr.carecalculus.com") or (http.host eq "es.carecalculus.com")`
- **Action:** Dynamic Redirect
- **Type:** 301
- **Target URL Expression:** 
  `concat("https://carecalculus.com/", substring(http.host, 0, 2), http.request.uri.path)`

## Nginx Equivalent (If self-hosting)

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name fr.carecalculus.com;
    
    return 301 https://carecalculus.com/fr$request_uri;
}

server {
    listen 80;
    listen 443 ssl;
    server_name es.carecalculus.com;
    
    return 301 https://carecalculus.com/es$request_uri;
}
```
