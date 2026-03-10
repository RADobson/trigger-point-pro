'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Session,
  Marker,
  PainIntensity,
  PressureSignal,
  BodyView,
  BodyType,
} from '@/types';
import BodyMap from '@/components/BodyMap';
import IntensityPicker from '@/components/IntensityPicker';
import PressureFeedback from '@/components/PressureFeedback';

export default function ClientSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [intensity, setIntensity] = useState<PainIntensity>('moderate');
  const [view, setView] = useState<BodyView>('back');
  const [bodyType, setBodyType] = useState<BodyType>('male');
  const [lastSignal, setLastSignal] = useState<PressureSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSession = useCallback(async () => {
    const { data: sessionData } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!sessionData) {
      setError('Session not found');
      setLoading(false);
      return;
    }

    if (sessionData.status === 'completed') {
      setError('This session has ended');
      setLoading(false);
      return;
    }

    setSession(sessionData);

    const { data: markersData } = await supabase
      .from('markers')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (markersData) setMarkers(markersData);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Listen for session status changes
  useEffect(() => {
    const channel = supabase
      .channel(`session-status-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as Session;
          setSession(updated);
          if (updated.status === 'completed') {
            setError('This session has ended');
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // Listen for marker deletions (clear all from therapist)
  useEffect(() => {
    const channel = supabase
      .channel(`markers-client-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'markers',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMarkers((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const handleTap = async (x: number, y: number) => {
    if (!session || session.status !== 'active') return;

    const { data, error } = await supabase
      .from('markers')
      .insert({
        session_id: sessionId,
        x,
        y,
        view,
        body_type: bodyType,
        intensity,
      })
      .select()
      .single();

    if (!error && data) {
      setMarkers((prev) => [...prev, data]);
    }
  };

  const handleSignal = async (signal: PressureSignal) => {
    if (!session || session.status !== 'active') return;

    setLastSignal(signal);

    await supabase.from('pressure_signals').insert({
      session_id: sessionId,
      signal,
    });

    // Clear after 3 seconds
    setTimeout(() => setLastSignal(null), 3000);
  };

  const handleUndo = async () => {
    if (markers.length === 0) return;
    const lastMarker = markers[markers.length - 1];
    await supabase.from('markers').delete().eq('id', lastMarker.id);
    setMarkers((prev) => prev.slice(0, -1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-neutral-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Minimal client header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          Trigger Point Pro
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#00F0FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] pulse-dot" />
          Connected
        </span>
      </div>

      <main className="flex-1 flex flex-col px-4 py-4 gap-4 max-w-lg mx-auto w-full">
        {/* View + body type toggle */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {(['front', 'back'] as BodyView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm rounded-md transition-colors min-h-[40px] ${
                  view === v
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                    : 'text-neutral-500'
                }`}
              >
                {v === 'front' ? 'Front' : 'Back'}
              </button>
            ))}
          </div>
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {(['male', 'female'] as BodyType[]).map((bt) => (
              <button
                key={bt}
                onClick={() => setBodyType(bt)}
                className={`px-3 py-2 text-sm rounded-md transition-colors min-h-[40px] ${
                  bodyType === bt
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                    : 'text-neutral-500'
                }`}
              >
                {bt === 'male' ? 'M' : 'F'}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity picker */}
        <IntensityPicker selected={intensity} onChange={setIntensity} />

        {/* Body map */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <BodyMap
            view={view}
            bodyType={bodyType}
            markers={markers}
            onTap={handleTap}
            selectedIntensity={intensity}
            interactive
          />
        </div>

        {/* Undo button */}
        {markers.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleUndo}
              className="px-4 py-2 text-sm text-neutral-400 border border-white/10 rounded-lg hover:text-white transition-colors min-h-[40px]"
            >
              Undo last point
            </button>
          </div>
        )}

        {/* Pressure feedback */}
        <div className="pb-4">
          <p className="text-xs text-neutral-500 text-center mb-3">Pressure Feedback</p>
          <PressureFeedback
            onSignal={handleSignal}
            lastSignal={lastSignal}
          />
        </div>
      </main>
    </div>
  );
}
