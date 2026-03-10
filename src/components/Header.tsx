'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  showAuth?: boolean;
  showLogout?: boolean;
}

export default function Header({ showAuth = false, showLogout = false }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#00F0FF]/60 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white group-hover:text-[#00F0FF] transition-colors">
            Trigger Point Pro
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {showAuth && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm bg-[#00F0FF] text-[#0a0a0a] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
