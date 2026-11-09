# Sarowar Hussain — Portfolio

Minimal dark portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, `next/image` and Lucide icons.
No 3D, WebGL or animation libraries. No runtime dependencies beyond Next, React and Lucide.

## Run locally

```bash
cp .env.example .env.local   # then fill in values (see below)
npm install
npm run dev                  # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start   # production build
```

## Current status and what to replace before launch

| Item | Status now | Before launch |
|---|---|---|
| Resume PDF | **Sample CV** at `public/resume/Sarowar-Hussain-Resume.pdf` | Replace with your final CV (same filename) |
| Public email | **Dummy** `sarowar.portfolio@example.com` in `src/data/social.ts` (example.com never receives mail) | Replace with your real address |
| Projects | **3 concept projects** with original mockup images, labelled "Concept Project", no links | Replace or add real projects in `src/data/projects.ts` |
| LinkedIn / GitHub URLs | Not set — hidden | Add to `socialLinks` in `src/data/social.ts` |
| **Contact form email delivery** | **Not configured** — form shows "isn't available right now" and sends nothing | Set the Resend variables below |

| Setting | Where | Effect until set |
|---|---|---|
| Production domain | `NEXT_PUBLIC_SITE_URL` env var | Defaults to `https://sarowarhussain.com` |
| Email delivery | `RESEND_API_KEY`, `CONTACT_EMAIL`, `EMAIL_FROM` | Form shows "isn't available right now" and sends nothing |
| Shared rate limit (production) | `UPSTASH_REDIS_REST_URL` + `_TOKEN` (or Vercel `KV_REST_API_URL` + `_TOKEN`) | Falls back to per-instance memory limits and logs a warning |
| Analytics (optional) | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No analytics script is loaded |

The resume check runs at build time, so **rebuild/redeploy after adding the PDF**.

## Environment variables

See `.env.example`.

- `NEXT_PUBLIC_SITE_URL` — canonical domain, e.g. `https://sarowarhussain.com` (no trailing slash).
- `RESEND_API_KEY` — server-only. Never prefix with `NEXT_PUBLIC_`.
- `CONTACT_EMAIL` — your inbox for enquiries.
- `EMAIL_FROM` — sender on a domain verified in Resend, e.g. `Portfolio Contact <contact@yourdomain.com>`.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — shared rate-limit store (or `KV_REST_API_URL` / `KV_REST_API_TOKEN` from a Vercel Marketplace Redis store).
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_PLAUSIBLE_SRC` — optional analytics.

## Resume

Save your PDF as `public/resume/Sarowar-Hussain-Resume.pdf` (exact name, case-sensitive) and redeploy.
- **Download Resume** — `<a download>`; downloads the file.
- **View Resume** — opens the same file in a new tab (served as `application/pdf`, `Content-Disposition: inline`, set in `next.config.ts`).
- Until the file exists, both buttons are hidden, so visitors never see a 404.

## Contact form email (Resend)

1. Create a Resend account and an API key with "Sending access".
2. Add your domain in Resend → Domains and create the DNS records it shows (SPF/DKIM). Wait until it says **Verified**.
3. Set `RESEND_API_KEY`, `CONTACT_EMAIL` and `EMAIL_FROM` in your host's environment settings and redeploy.
4. Create a free Upstash Redis database (or a Redis store from the Vercel Marketplace) and add its REST URL + token.
5. Submit the form on the live site and confirm the email arrives with the subject `New Portfolio Enquiry: …`, and that **Reply** goes to the visitor's address.

How it's protected (`src/app/api/contact/route.ts`):
- Same validation rules in the browser and on the server (`src/lib/contact-schema.ts`).
- Line breaks / control characters rejected in name and email (header injection); subject built only from validated values; HTML body escaped.
- Honeypot field + minimum fill time; bots get a silent "ok" and nothing is sent.
- Rate limit: 5 submissions per IP per 10 minutes, stored in Redis (Upstash or Vercel KV) over its REST API so it holds across serverless instances. Without Redis it falls back to in-memory counting (fine locally, not reliable on serverless).
- Same-origin check, JSON-only, 20 KB body limit, `Idempotency-Key` per submission so retries can't send duplicates.
- Errors are logged with status codes only — never the visitor's details — and the visitor sees a friendly message.

## Analytics (optional, Plausible)

Cookieless and doesn't collect personal data, so it typically doesn't need a cookie banner under UK/EU rules (check your own obligations — this isn't legal advice). Mention it in a short privacy note if you enable it.

Events sent: `Resume Download` / `Resume View` (location only), `Project Link Click` (project name + link type), `Contact Form Submitted` (no properties). **No names, emails or message text are ever sent.** In Plausible, add these as custom-event goals.

Vercel Web Analytics is a similar alternative if you host on Vercel (it requires adding the `@vercel/analytics` package).

## Deploying to Vercel

Requirements: Node.js 20.9 or newer (Vercel's default is fine). No `vercel.json` is needed.

1. **Check it builds locally**
   ```bash
   npm install            # creates package-lock.json — commit it
   npm run typecheck && npm run lint && npm run build
   ```
2. **Push to GitHub** (a private repo is fine). `.env*` files are git-ignored — never commit real keys.
3. **Import** at vercel.com → Add New → Project → pick the repo. Framework preset: **Next.js**; leave build/output settings at their defaults.
4. **Environment variables** (Project → Settings → Environment Variables; tick Production and Preview):
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://sarowarhussain.com`
   - `RESEND_API_KEY`, `CONTACT_EMAIL`, `EMAIL_FROM` — **required for the contact form to send**; without them it safely shows "isn't available right now"
   - Redis for rate limiting: Storage → add an Upstash Redis store from the Marketplace (sets `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically), or add `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` yourself
   - Optional: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
5. **Deploy**, then open the preview URL and check: navbar links, mobile menu, Download/View Resume, project images, and a test contact submission.
6. **Custom domain**: Project → Settings → Domains → add your domain and follow the DNS instructions. Make sure `NEXT_PUBLIC_SITE_URL` matches, then redeploy.
7. **Search Console**: add the domain and submit `https://yourdomain.com/sitemap.xml`.

Static assets in `public/` (avatar, project images, CV, share image, icons) are deployed automatically. Changing `NEXT_PUBLIC_*` variables or the resume file requires a redeploy.

Any Node host that runs `npm run build && npm start` works too (the contact form needs a server, so a purely static export won't send email).

## Where to edit

- `src/data/profile.ts` — name, roles, intro, About text and expertise, site URL
- `src/data/experience.ts` — My Journey (verified roles)
- `src/data/projects.ts` — Selected Work (`concept: true` shows the "Concept Project" label; live, GitHub and case-study URLs — empty = hidden)
- `public/images/projects/` — project images (16:10, e.g. 1600×1000 WebP)
- `src/data/social.ts` — email, LinkedIn, GitHub (empty = hidden)
- `src/data/navigation.ts` — navbar links (ids must match section ids)
- `src/data/resume.ts` — resume file path/name
- `public/og-image.jpg` — social share image (1200×630)
- `src/app/icon.png`, `apple-icon.png`, `favicon.ico` — site icons
