import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   "import.meta.env.VITE_REACT_APP_GOOGLE_MAP_API_KEY":
  //     process.env.VITE_REACT_APP_GOOGLE_MAP_API_KEY,
  // },
});
