import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // set this in .env.local
  dataset: 'production',
  apiVersion: '2025-11-01',
  useCdn: true, // faster for public content
})
