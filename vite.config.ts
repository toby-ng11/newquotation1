import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react(),
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
                app: path.resolve(__dirname, 'resources/js/app.tsx'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].css',
                manualChunks: {
                    chart: ['chart.js'],
                    datatable: ['datatables.net-dt', 'datatables.net-fixedcolumns-dt', 'datatables.net-responsive-dt'],
                    flatpickr: ['flatpickr'],
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
});
