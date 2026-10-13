import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: 'release.spec.mjs',
  timeout: 30000,
  workers: 1,
  reporter: [['list']],
  webServer: {
    command: 'python -m http.server 4199 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4199',
    reuseExistingServer: false,
    timeout: 20000
  },
  use: {
    baseURL: 'http://127.0.0.1:4199',
    locale: 'ar-SA',
    serviceWorkers: 'block',
    trace: 'retain-on-failure'
  }
});
