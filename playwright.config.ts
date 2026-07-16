import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3100' },
  },
});
