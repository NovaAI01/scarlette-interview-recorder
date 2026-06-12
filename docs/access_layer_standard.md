# Access Layer Standard

This document defines how Scarlette Interview Recorder should be accessed by normal users and by developers.

Related documents:

- [Product Brief](product_brief.md)
- [Data Privacy](data_privacy.md)
- [Roadmap](roadmap.md)
- [Manual Test Plan](manual_test_plan.md)
- [README](../README.md)

## Standard User Access

Normal users should access the app through a hosted HTTPS Progressive Web App.

They should not need:

- terminal access
- a localhost URL
- a port number
- a package manager
- a build command
- Docker
- a database
- an API server
- a long-running local background process

The root hosted URL should open the application directly. The direct app path `/src/` may also be used where needed.

## PWA-First Approach

Scarlette Interview Recorder is intended to behave like a lightweight installed application while remaining a static web app.

The PWA approach provides:

- desktop installation on supported browsers
- mobile Home Screen installation where supported
- cached app shell after first hosted load
- a simple deployment model using static files
- no server-side runtime dependency

## Desktop And Mobile Install Target

Desktop target:

- Chrome
- Edge
- Brave
- other browsers with PWA installation support

Mobile target:

- iPhone Safari with Add to Home Screen
- Android Chrome or Edge install flow

Browser feature support still varies. PWA installation does not guarantee Web Speech API support, MediaRecorder support, or microphone permission.

## Development Access

Local server access is for development and manual verification only.

Recommended local command:

```bash
python3 -m http.server 8000
```

Development URL:

```text
http://127.0.0.1:8000/
```

If port 8000 is unavailable, use another port, for example:

```bash
python3 -m http.server 8001
```

No package manager or build step is required for this project.

## Deployment Standard

Deploy the repository as static files over HTTPS using a host such as GitHub Pages or Cloudflare Pages.

The deployed application must preserve:

- root URL redirect into the app
- service worker access
- manifest access
- icon access
- `/src/` app path

Changes to app shell files should bump the service worker cache name so installed copies can receive the updated application shell.
