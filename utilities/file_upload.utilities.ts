import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import Env from '#start/env';
import type { MultipartFile } from '@adonisjs/core/bodyparser';

AWS.config.update({
  region: Env.get('AWS_REGION')!,
  accessKeyId: Env.get('AWS_ACCESS_KEY_ID')!,
  secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY')!,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: MultipartFile): Promise<string> => {
  try {
    // Validate environment variables
    const bucket = Env.get('S3_BUCKET');
    const region = Env.get('AWS_REGION');
    const accessKeyId = Env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Env.get('AWS_SECRET_ACCESS_KEY');

    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS S3 configuration is missing. Please set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET in your .env file'
      );
    }

    // For AdonisJS MultipartFile, read from tmpPath
    if (!file.tmpPath) {
      throw new Error('File upload failed: temporary file path not found');
    }
    const buffer = readFileSync(file.tmpPath);
    const extension = file.extname || 'bin';
    const fileName = `${uuidv4()}.${extension}`;
    const contentType =
      file.headers['content-type'] || 'application/octet-stream';

    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: fileName,
      Body: buffer,
      //ACL: 'public-read',
      ContentType: contentType,
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};
