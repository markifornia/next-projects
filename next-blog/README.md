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

## Database (Prisma)

This project uses [Prisma](https://www.prisma.io/) as the ORM for talking to the database.

Start a local Prisma-managed dev database:

```bash
npx prisma dev
```

Open Prisma Studio to view and edit data in the database directly:

```bash
npx prisma studio
```

Prisma Studio runs at [http://localhost:5555](http://localhost:5555) by default.

If you change `prisma/schema.prisma`, remember to generate the client and apply migrations as needed (e.g. `npx prisma generate`, `npx prisma migrate dev`) before running the app.

## Authentication (Kinde)

This project uses [Kinde](https://www.kinde.com/) for authentication.

- Sign up / configure your application at the [Kinde dashboard](https://www.kinde.com/).
- Set the required Kinde environment variables (client ID/secret, issuer URL, redirect URLs, etc.) in your `.env` file.
- Refer to the [Kinde Next.js SDK docs](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/) for setup details, auth helpers, and protecting routes/pages.

## Learn More

To learn more about Next.js, take a look