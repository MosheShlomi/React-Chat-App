import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  console.log(command)
  return {
    plugins: [react()],
    base: command === 'build' ? '/React-Chat-App/' : '/',
  };
});

