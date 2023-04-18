import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      // the proper extensions will be added
      fileName: 'main',
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: [],
      output: {
        dir: 'lib',
        globals: {},
      },
      plugins: [
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "lib",
          exclude: ["**/__tests__", "**/*.spec.ts"],
        }),
        visualizer(),
      ]
    },
  },
})