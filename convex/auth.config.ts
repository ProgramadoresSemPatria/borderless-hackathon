const issuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN
if (!issuerDomain) {
  throw new Error(
    'Missing CLERK_JWT_ISSUER_DOMAIN. Set it via `npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev`',
  )
}

const authConfig = {
  providers: [
    {
      domain: issuerDomain,
      applicationID: 'convex',
    },
  ],
}

export default authConfig
