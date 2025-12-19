import JSZip from 'jszip';

export const zipFiles = async (files: File[]): Promise<File> => {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file);
  });

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return new File([blob], `files_${Date.now()}.zip`, { type: 'application/zip' });
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const formatSpeed = (bytesPerSecond: number): string => {
  return `${formatBytes(bytesPerSecond)}/s`;
};
