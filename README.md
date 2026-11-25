This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## cPanel static deployment

The static export uses `public/api/contact.php` as the contact form endpoint. The cPanel host must support PHP with cURL enabled. The deploy workflow builds the frontend to use `/api/contact.php`, while local development continues to use the Next.js API route. For a manual build, set `NEXT_PUBLIC_CONTACT_API_URL=/api/contact.php` before running `npm run build`.

Configure `GHL_API_TOKEN` and `GHL_LOCATION_ID` as PHP runtime environment variables in the cPanel hosting environment. These are server-only secrets; do not add them to GitHub Actions build variables, the static build, or frontend environment variables. If your cPanel account cannot provide PHP environment variables, ask the hosting provider for a secure server-side configuration method. After deployment, verify that `https://your-domain.example/api/contact.php` responds with JSON (a GET request should return HTTP 405).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
