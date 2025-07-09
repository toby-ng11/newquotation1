import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
        //visualizer({ open: true })
    ],
    root: 'resources/js', // Your source code directory
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        outDir: '../../public/build', // Where to output compiled files
        sourcemap: true,
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'resources/js/p2q.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].css',
                manualChunks: {
                    chart: ['chart.js'],
                    datatable: ['datatables.net-dt', 'datatables.net-fixedcolumns-dt', 'datatables.net-responsive-dt'],
                    flatpickr: ['flatpickr'],
                },
            },
        },
    },
});
