import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        preserveSymlinks: true,
    },
    server: {
        watch: {
            usePolling: true,
        },
    },
    test: {
        environment: 'node',
        setupFiles: ['dotenv/config'],
        include: ['src/pathfinding/tests/bfs.test.ts'],
    },
});
