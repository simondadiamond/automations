import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.AIRTABLE_TOKEN': JSON.stringify(process.env.AIRTABLE_TOKEN),
    'process.env.AIRTABLE_BASE_ID': JSON.stringify(process.env.AIRTABLE_BASE_ID),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
