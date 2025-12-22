import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load env variables from .env.local or .env.server
dotenv.config()

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2025-11-12',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // always fresh data for scripts
})
