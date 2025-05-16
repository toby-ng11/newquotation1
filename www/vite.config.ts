import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],
    root: 'resources/js', // Your source code directory
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: {
        outDir: '../../public/build', // Where to output compiled files
        sourcemap: true,
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'resources/js/p2q.ts'),
                vueapp: path.resolve(__dirname, 'resources/js/app.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].css',
                manualChunks: {
                    vue: ['vue'],
                    chart: ['chart.js'],
                    datatable: ['datatables.net-dt', 'datatables.net-fixedcolumns-dt', 'datatables.net-responsive-dt'],
                    reka: ['reka-ui'],
                    motion: ['motion-v'],
                    clsx: ['clsx'],
                    tailwind: ['tailwind-merge'],
                    lucide: ['lucide-vue-next'],
                },
                //chunkFileNames: '[name].js',
            },
        },
    },
});
