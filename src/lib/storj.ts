import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: import.meta.env.VITE_STORJ_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_STORJ_SECRET_KEY,
  endpoint: import.meta.env.VITE_STORJ_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  httpOptions: {
    timeout: 0,
  },
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
  return new Promise((resolve, reject) => {
    let startTime = Date.now();
    let lastLoaded = 0;

    const params = {
      Bucket: bucketName,
      Key: path,
      Body: file,
      ContentType: file.type,
    };

    const upload = s3.upload(params);

    upload.on('httpUploadProgress', (progress) => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000;
      const bytesUploaded = progress.loaded - lastLoaded;
      const speed = timeElapsed > 0 ? bytesUploaded / timeElapsed : 0;

      if (onProgress) {
        onProgress({
          loaded: progress.loaded,
          total: progress.total || file.size,
          percentage: Math.round((progress.loaded / (progress.total || file.size)) * 100),
          speed,
        });
      }

      lastLoaded = progress.loaded;
      startTime = currentTime;
    });

    upload.send((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

export const generatePublicUrl = (key: string): string => {
  return `${import.meta.env.VITE_STORJ_ENDPOINT}/${bucketName}/${key}`;
};
