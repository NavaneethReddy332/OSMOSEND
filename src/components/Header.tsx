import { useState } from 'react';
import { Menu, X, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Header() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] transition-all duration-500 ${
        isExpanded ? 'max-w-[1000px]' : 'max-w-[600px]'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <nav
        className={`bg-black border border-[#333] flex items-center justify-between px-3 py-2 text-white relative z-[2] overflow-hidden transition-all duration-300 ${
          isExpanded ? 'rounded-t-[20px]' : 'rounded-[30px]'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="bg-transparent border-none text-white cursor-pointer flex items-center gap-2 px-4 py-1 text-sm"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
            <span>Menu</span>
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 font-black tracking-tighter text-xl">
          OSMO
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-white no-underline text-sm px-3 opacity-80">
            Login
          </a>
          <a
            href="#"
            className="bg-[#9dff50] text-black no-underline px-5 py-2 rounded-xl font-semibold text-sm"
          >
            Join
          </a>
        </div>
      </nav>

      {!isExpanded && (
        <div className="bg-[#9dff50] h-6 w-full overflow-hidden flex items-center text-[10px] font-bold uppercase rounded-b-xl">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="px-5 text-black">✦ SECURE FILE TRANSFER</span>
            <span className="px-5 text-black">✦ ANONYMOUS SHARING</span>
            <span className="px-5 text-black">✦ P2P ENCRYPTED</span>
            <span className="px-5 text-black">✦ NO LOGS KEPT</span>
            <span className="px-5 text-black">✦ SECURE FILE TRANSFER</span>
            <span className="px-5 text-black">✦ ANONYMOUS SHARING</span>
            <span className="px-5 text-black">✦ P2P ENCRYPTED</span>
            <span className="px-5 text-black">✦ NO LOGS KEPT</span>
          </div>
        </div>
      )}

      <div
        className={`bg-black border border-[#333] border-t-0 w-full overflow-hidden transition-all duration-500 rounded-b-[20px] grid grid-cols-[1.2fr_1fr_1.5fr] ${
          isExpanded ? 'max-h-[500px] px-10 py-10' : 'max-h-0 px-10 py-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div>
          <h4 className="text-[#a1a1a1] text-[10px] uppercase mb-6 tracking-wider">
            Our Products
          </h4>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            The Vault
          </a>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Transfer <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6366f1] align-middle ml-2">NEW</span>
          </a>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Icon Library
          </a>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Community
          </a>
        </div>

        <div>
          <h4 className="text-[#a1a1a1] text-[10px] uppercase mb-6 tracking-wider">
            Explore
          </h4>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Showcase
          </a>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Updates
          </a>
          <a href="#" className="block text-white no-underline text-2xl mb-5 font-medium hover:opacity-60 transition-opacity">
            Pricing
          </a>

          <div className="mt-auto flex gap-2.5">
            {[Linkedin, Instagram, Twitter].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,255,255,0.1)] transition-all duration-300"
                style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-[#1c1c1c] rounded-[20px] p-8 text-center flex flex-col justify-center items-center">
            <span className="text-[10px] text-[#6366f1] font-bold">FEATURED MILESTONE</span>
            <h2 className="text-[32px] my-4 leading-tight">We hit 1600 Members!</h2>
            <a
              href="#"
              className="bg-white text-black px-5 py-2.5 rounded-lg no-underline font-semibold mb-5"
            >
              Join them
            </a>
            <div className="flex justify-center">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?u=${i}`}
                  alt="user"
                  className="w-10 h-10 rounded-full border-2 border-[#1c1c1c] -ml-2.5 first:ml-0 bg-[#444]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
