// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  signedUrl: string;
};

import { s3Client } from '../../lib/aws/s3client';

const api = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const key = req.query.fileName as string;
  const length = req.query.length as string;

  const bucketParams = {
    Bucket: `myn-media-public`,
    Key: key,
    Body: 'BODY',
    ContentType: 'video/webm' 
  };

  const command = new PutObjectCommand(bucketParams);

  console.log(`Creating PreSignedUrl For Put: ${JSON.stringify(command)}`)

  // Create the presigned URL.
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  console.log(`Created PreSignedUrl: ${signedUrl}`)

  res.status(200).json({ signedUrl });
};

export default api;
