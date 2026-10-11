# OCI Tools

Static, GitHub Pages-ready tools for direct browser-to-OCI Object Storage uploads.

## Pages

- `/` — opens the unified OCI Tools application at File Upload
- `/file-uploads/` — upload either Oracle Data Pump `.dmp` files only or any file type
- `/par-download/` — download files with a bucket-level read PAR
- `/dump-upload/` — redirects older bookmarks to File Upload in dump-only mode
- `/script-generator/` — categorized PowerShell, Oracle DB, and PostgreSQL DB script generators

## Publish

1. Create a public GitHub repository named `oci-tools` under `kumaravelmanimc`.
2. Commit the **contents** of this folder to the repository root (not the containing `oci-tools` folder).
3. Go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, `main`, `/ (root)`, then Save.
5. Expected URLs after deployment:
   - `https://kumaravelmanimc.github.io/oci-tools/`
   - `https://kumaravelmanimc.github.io/oci-tools/dump-upload/`
   - `https://kumaravelmanimc.github.io/oci-tools/file-uploads/`

## OCI configuration

- Enter a **bucket-level** PAR URL ending in `/o/`. No PAR tokens are embedded in the repository.
- Use short-lived, least-privilege PARs, ideally write-only. A browser-side `.dmp` filter **does not restrict file types at the OCI service level**.
- Configure OCI Object Storage **CORS** to allow the website's exact origin (e.g. `https://kumaravelmanimc.github.io`, not its full page path), method `PUT`, and upload request headers such as `Content-Type`. Check browser developer tools if the upload fails due to preflight/CORS.
- Uploads use single HTTP PUT, **not multipart**. The maximum is 50 GiB **per file**, and failed uploads cannot be resumed. Use a multipart-capable uploader for larger individual files, or produce smaller Data Pump export pieces.
- Files go directly from the browser to OCI; GitHub Pages does not store them.
- The PAR URL is a bearer secret: do not include it in code, issues, screenshots, logs or commits. Never commit dumps, wallets or API credentials.
- For production use, consider implementing multipart upload, resumability, checksum verification, access control, and testing CORS across browsers.

## Extend

Each tool is an independent static HTML page. Add new folders containing `index.html` and link them from the homepage.
