import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: import.meta.env.VITE_STORJ_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_STORJ_SECRET_KEY,
  },
  endpoint: import.meta.env.VITE_STORJ_ENDPOINT,
  region: 'us-east-1',
  forcePathStyle: true,
});

const bucketName = import.meta.env.VITE_STORJ_BUCKET;

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
}

export const uploadFileToStorj = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const startTime = Date.now();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: path,
    Body: file,
    ContentType: file.type,
  });

  try {
    if (onProgress) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const estimatedProgress = Math.min((elapsed / 10) * 100, 95);

        onProgress({
          loaded: (file.size * estimatedProgress) / 100,
          total: file.size,
          percentage: Math.round(estimatedProgress),
          speed: (file.size * estimatedProgress) / 100 / elapsed,
        });
      }, 500);

      await s3Client.send(command);
      clearInterval(interval);

      onProgress({
        loaded: file.size,
        total: file.size,
        percentage: 100,
        speed: file.size / ((Date.now() - startTime) / 1000),
      });
    } else {
      await s3Client.send(command);
    }

    return generatePublicUrl(path);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const generatePublicUrl = (key: string): string => {
  return `${import.meta.env.VITE_STORJ_ENDPOINT}/${bucketName}/${key}`;
};
