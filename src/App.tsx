import { useEffect } from 'react';
import Header from './components/Header';
import SendCard from './components/SendCard';
import ReceiveCard from './components/ReceiveCard';
import { getUserCode } from './lib/userTracking';

function App() {
  useEffect(() => {
    getUserCode().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-5 overflow-x-hidden">
      <Header />

      <main className="mt-[140px] flex justify-center items-start gap-5 px-5 flex-wrap">
        <SendCard />
        <ReceiveCard />
      </main>
    </div>
  );
}

export default App;
