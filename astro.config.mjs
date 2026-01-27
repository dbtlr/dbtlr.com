import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    icon({
      include: {
        lucide: ['*']
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:async_hooks'],
    },
  },
});
