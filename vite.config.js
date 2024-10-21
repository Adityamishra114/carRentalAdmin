import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); 

const isProduction = import.meta.env.VITE_APP_PROD_ENV === 'production';

export default defineConfig({
  base: isProduction ? '/carRentalAdmin/' : '/',
  plugins: [react()],
});