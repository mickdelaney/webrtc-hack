import { S3Client } from '@aws-sdk/client-s3';

const REGION = 'eu-west-1';

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    accessKeyId: process.env.AWS_ACCESS_KEY!,
  },
});

export { s3Client };
