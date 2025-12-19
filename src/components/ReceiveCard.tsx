import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatBytes } from '../lib/fileUtils';

export default function ReceiveCard() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Waiting for code...');
  const [files, setFiles] = useState<Array<{ name: string; url: string; size: number }>>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode) {
      setCode(urlCode);
      handleReceive(urlCode);
    }
  }, []);

  const handleReceive = async (codeToUse?: string) => {
    const transferCode = codeToUse || code;

    if (transferCode.length !== 6) {
      setStatus('Error: Code must be 6 digits.');
      setFiles([]);
      return;
    }

    setStatus('Searching for files...');
    setFiles([]);

    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('transfer_code', transferCode)
        .maybeSingle();

      if (error || !data) {
        setStatus('No session found for that code.');
        return;
      }

      const now = Date.now();
      const expiresAt = new Date(data.expires_at).getTime();

      if (now > expiresAt || data.is_expired) {
        setStatus('This code has expired.');
        return;
      }

      await supabase
        .from('transfers')
        .update({ download_count: data.download_count + 1 })
        .eq('id', data.id);

      setFiles(data.file_urls);
      setStatus('Files ready for download:');
    } catch (err) {
      console.error('Error fetching files:', err);
      setStatus('Error fetching files.');
    }
  };

  return (
    <div className="bg-[#1c1c1c] border border-[#333] rounded-3xl p-8 w-full max-w-[450px] min-h-[400px] flex flex-col relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Receive</h2>
        <p className="text-[#a1a1a1] text-sm">Enter the 6-digit code to download.</p>
      </div>

      <div className="mt-10 mb-auto">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000 000"
          maxLength={6}
          className="w-full bg-black border border-[#333] text-white text-[32px] text-center p-5 rounded-2xl outline-none tracking-[4px] font-mono transition-colors duration-300 focus:border-[#6366f1]"
        />
      </div>

      <div className="text-center mt-4 text-sm text-[#a1a1a1] min-h-[20px]">
        {status}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 items-center mt-3">
            {files.map((file, i) => (
              <a
                key={i}
                href={file.url}
                download={file.name}
                className="text-[#9dff50] no-underline bg-[#111] px-3 py-2 rounded-lg"
              >
                Download {file.name} ({formatBytes(file.size)})
              </a>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handleReceive()}
        className="bg-[#9dff50] text-black border-none w-full py-4 rounded-xl font-bold text-base cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] mt-5"
      >
        <span className="flex items-center justify-center gap-2">
          <Download size={18} />
          Download
        </span>
      </button>
    </div>
  );
}
