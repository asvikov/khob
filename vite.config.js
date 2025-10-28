import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/src/app.jsx', 'resources/scss/custom.scss'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'khob.test',
            protocol: 'ws',
        },
        watch: {
            usePolling: true,
        },
        cors: {
            origin: 'http://khob.test',
            credentials: true,
        },
    },
// Явно разрешите все origins (альтернативный вариант)
//headers: {
//    'Access-Control-Allow-Origin': '*',
//    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
//
});
