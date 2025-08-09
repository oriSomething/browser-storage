import { defineConfig } from "rolldown";
import dts from "vite-plugin-dts";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    externalLiveBindings: false,
    sourcemap: "hidden",
  },

  plugins: [dts({ rollupTypes: true })],
});
