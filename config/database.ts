import env from '#start/env';
import { defineConfig } from '@adonisjs/lucid';

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      pool: {
        min: 2,
        max: 20, // Increased for production load
        acquireTimeoutMillis: 30000, // 30 seconds - increased timeout
        createTimeoutMillis: 30000, // 30 seconds
        idleTimeoutMillis: 60000, // 60 seconds - keep connections longer
        reapIntervalMillis: 1000, // 1 second
        createRetryIntervalMillis: 100, // 100ms - faster retry
        propagateCreateError: false,
      },
      debug: env.get('NODE_ENV') === 'development',
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
});

export default dbConfig;
