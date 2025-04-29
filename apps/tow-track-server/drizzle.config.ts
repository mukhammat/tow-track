import type { Config } from 'drizzle-kit';

export default {
  schema: './src/common/db/schema',
  out: './migrations',
  dialect: 'sqlite'
} satisfies Config;