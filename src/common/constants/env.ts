import * as dotenv from 'dotenv';
dotenv.config();

export const ENV_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const ENV_AWS_ACCESS_SECRET = process.env.AWS_ACCESS_SECRET;
export const ENV_AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
export const ENV_AWS_S3_REGION = process.env.AWS_S3_REGION;
