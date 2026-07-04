import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'sms_jwt_secret_token_12345_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'sms_jwt_refresh_token_abcde_key',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
