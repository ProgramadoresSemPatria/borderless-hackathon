import { clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'

/**
 * Runs once before the suite. Fetches a Clerk testing token from the
 * Clerk Backend API and exposes it via env so the rest of the tests can
 * call setupClerkTestingToken({ page }) to bypass bot protection.
 *
 * Requires:
 *   CLERK_PUBLISHABLE_KEY (or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
 *   CLERK_SECRET_KEY
 */
setup('clerk setup', async () => {
  await clerkSetup()
})
