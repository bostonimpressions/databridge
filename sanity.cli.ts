import { defineCliConfig } from 'sanity/cli';

// If these aren't picking up locally, ensure you are running
// the command in a shell where these are exported.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /**
   * This is the fix for the 500 error in the Sanity Dashboard.
   * It tells the Sanity manifest that your studio is located at /studio.
   */
  project: {
    basePath: '/studio',
  },
});
