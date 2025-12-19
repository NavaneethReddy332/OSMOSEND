import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { uploadFileToStorj, UploadProgress } from '../lib/storj';
import { zipFiles, formatBytes, formatSpeed } from '../lib/fileUtils';
import { generateTransferCode, getUserCode, getUserId } from '../lib/userTracking';
import { supabase } from '../lib/supabase';

export default function SendCard() {
  const [files, setFiles] = useState<File[]>([]);
  const [view, setView] = useState<'upload' | 'code'>('upload');
  const [transferCode, setTransferCode] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    try {
      setUploading(true);
      const code = generateTransferCode();
      setTransferCode(code);
      setView('code');

      const userCode = await getUserCode();
      const userId = await getUserId(userCode);

      let fileToUpload: File;
      let filesToStore: Array<{ name: string; url: string; size: number; path: string }> = [];

      if (files.length > 1) {
        fileToUpload = await zipFiles(files);
        const path = `uploads/${code}/${Date.now()}_${fileToUpload.name}`;

        const url = await uploadFileToStorj(fileToUpload, path, (prog: UploadProgress) => {
          setProgress(prog.percentage);
          setSpeed(prog.speed);
        });

        filesToStore.push({
          name: fileToUpload.name,
          url,
          size: fileToUpload.size,
          path,
        });
      } else {
        const file = files[0];
        const path = `uploads/${code}/${Date.now()}_${file.name}`;

        const url = await uploadFileToStorj(file, path, (prog: UploadProgress) => {
          setProgress(prog.percentage);
          setSpeed(prog.speed);
        });

        filesToStore.push({
          name: file.name,
          url,
          size: file.size,
          path,
        });
      }

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase.from('transfers').insert([
        {
          user_id: userId,
          transfer_code: code,
          file_urls: filesToStore,
          expires_at: expiresAt,
        },
      ]);

      const base = window.location.origin;
      const link = `${base}?code=${code}`;
      setShareLink(link);
      setUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
      setView('upload');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setView('upload');
    setTransferCode('');
    setShareLink('');
    setProgress(0);
    setSpeed(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-[#1c1c1c] border border-[#333] rounded-3xl p-8 w-full max-w-[450px] min-h-[400px] flex flex-col relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Send Files</h2>
        <p className="text-[#a1a1a1] text-sm">Upload files to generate a unique code.</p>
      </div>

      {view === 'upload' ? (
        <>
          <div
            className="flex-grow border-2 border-dashed border-[#333] rounded-2xl flex flex-col items-center justify-center bg-[rgba(255,255,255,0.02)] transition-all duration-300 cursor-pointer mb-5 p-5 text-center hover:border-[#9dff50] hover:bg-[rgba(157,255,80,0.05)]"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload size={48} className="text-[#a1a1a1] mb-4" />
            <p className="text-sm text-[#a1a1a1]">
              <strong className="text-white">Click to browse</strong> or drag files here
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <div className="w-full mb-4 max-h-[100px] overflow-y-auto">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="bg-[#2a2a2a] px-3 py-2 rounded-lg mb-1 text-xs flex justify-between items-center"
                >
                  <span>{file.name}</span>
                  <span className="text-[#666]">{formatBytes(file.size)}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            className="bg-white text-black border-none w-full py-4 rounded-xl font-bold text-base cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Generate Code
          </button>
        </>
      ) : (
        <div className="text-center mt-auto">
          <p className="text-[#a1a1a1]">Share this code with the recipient:</p>
          <div className="text-[42px] font-black tracking-[5px] text-[#9dff50] my-5 font-mono">
            {transferCode}
          </div>
          <p className="text-xs text-[#666]">Code expires in 10 minutes</p>

          <div className="flex gap-2 items-center justify-center mt-2">
            <input
              value={shareLink}
              readOnly
              className="bg-black border border-[#333] text-[#9dff50] px-3 py-2 rounded-lg w-[60%]"
            />
            <button
              onClick={copyLink}
              className="bg-white text-black border-none py-2.5 px-4 rounded-xl font-bold text-base cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Copy
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <QRCodeSVG value={shareLink} size={140} />
          </div>

          {uploading && (
            <div className="mt-3">
              <div className="h-2.5 bg-[#222] rounded-lg overflow-hidden">
                <div
                  className="h-full bg-[#9dff50] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[#a1a1a1] mt-2">
                {progress}% - {formatSpeed(speed)}
              </p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="bg-[#333] text-white border-none w-full py-4 rounded-xl font-bold text-base cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] mt-5"
          >
            Send More
          </button>
        </div>
      )}
    </div>
  );
}
