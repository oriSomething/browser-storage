import { defineConfig } from "rolldown";
import dts from "vite-plugin-dts";

export default defineConfig({
  input: "lib/index.ts",

  platform: "neutral",

  treeshake: {
    annotations: true,
    commonjs: false,
    moduleSideEffects: false,
    unknownGlobalSideEffects: false,
  },

  output: {
    dir: "dist",
    format: "esm",
    externalLiveBindings: false,
    sourcemap: "hidden",
  },

  plugins: [dts({ rollupTypes: true })],
});
