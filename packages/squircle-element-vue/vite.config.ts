import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            tsconfigPath: 'tsconfig.build.json',
            cleanVueFileName: true,
            rollupTypes: true
        })
    ],
    resolve: {
        dedupe: ['vue', '@vue/runtime-core']
    },
    build: {
        minify: true,
        target: 'esnext',
        sourcemap: true,
        lib: {
            name: 'squircle-js',
            fileName: (format, entryName) => {
                return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
            },
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
            }
        },
        rollupOptions: {
            external: [
                ...Object.keys(pkg.dependencies || {}),
                ...Object.keys(pkg.peerDependencies || {})
            ]
        }
    }
});
