'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@/types';
import Header from '@/components/Header';
import SessionCard from '@/components/SessionCard';

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<(Session & { marker_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      loadSessions();
    };
    checkAuth();
  }, [router]);

  const loadSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('*')
      .eq('therapist_id', user.id)
      .order('created_at', { ascending: false });

    if (sessionsData) {
      // Get marker counts
      const sessionsWithCounts = await Promise.all(
        sessionsData.map(async (session) => {
          const { count } = await supabase
            .from('markers')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);
          return { ...session, marker_count: count || 0 };
        })
      );
      setSessions(sessionsWithCounts);
    }
    setLoading(false);
  };

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        therapist_id: user.id,
        client_name: clientName || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      setCreating(false);
      return;
    }

    router.push(`/session/${data.id}`);
  };

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="min-h-screen flex flex-col">
      <Header showLogout />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-5 py-2.5 bg-[#00F0FF] text-[#0a0a0a] rounded-xl font-semibold hover:bg-[#00F0FF]/90 transition-all min-h-[48px]"
          >
            New Session
          </button>
        </div>

        {/* New session form */}
        {showCreate && (
          <form
            onSubmit={createSession}
            className="mb-8 p-5 rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/[0.03]"
          >
            <h2 className="text-sm font-medium text-[#00F0FF] mb-3">Start a new session</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name (optional)"
                className="flex-1"
              />
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 bg-[#00F0FF] text-[#0a0a0a] rounded-xl font-semibold whitespace-nowrap hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 min-h-[48px]"
              >
                {creating ? 'Creating...' : 'Start'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center text-neutral-500 py-20">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-neutral-500 mb-2">No sessions yet</p>
            <p className="text-sm text-neutral-600">Create your first session to get started</p>
          </div>
        ) : (
          <>
            {/* Active sessions */}
            {activeSessions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] pulse-dot" />
                  Active
                </h2>
                <div className="space-y-2">
                  {activeSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      markerCount={session.marker_count}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed sessions */}
            {completedSessions.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  History
                </h2>
                <div className="space-y-2">
                  {completedSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      markerCount={session.marker_count}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
