import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showAuth />

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Hero icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#00F0FF]/50 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Trigger Point
            <span className="text-[#00F0FF]"> Pro</span>
          </h1>

          <p className="text-lg text-neutral-400 mb-10 max-w-lg mx-auto leading-relaxed">
            Real-time trigger point mapping. Clients mark pain points on their phone.
            You see them appear live on your screen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-[#00F0FF] text-[#0a0a0a] rounded-xl font-semibold text-lg hover:bg-[#00F0FF]/90 transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] min-h-[48px] flex items-center justify-center"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 transition-all min-h-[48px] flex items-center justify-center"
            >
              Log In
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-4 mt-20 text-left">
            {[
              {
                title: 'Body Mapping',
                desc: 'Interactive front & back body diagrams with precision marker placement',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="5" r="3" />
                    <path d="M12 8v8M8 12h8M6 21l2-8M18 21l-2-8" />
                  </svg>
                ),
              },
              {
                title: 'Real-Time Sync',
                desc: 'Client markers and pressure signals appear instantly on your screen',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ),
              },
              {
                title: 'Session History',
                desc: 'Every session saved with full trigger point maps for future reference',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6v6h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-[#00F0FF] mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-neutral-600">
        Trigger Point Pro
      </footer>
    </div>
  );
}
