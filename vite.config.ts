// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/gift-kiosk-app/', // GitHub 저장소 이름으로 설정
  plugins: [react()],
});
