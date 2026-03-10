'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import { Session, Marker, PressureSignalRecord, BodyView, BodyType, PRESSURE_CONFIG } from '@/types';
import { getClientUrl } from '@/lib/utils';
import BodyMap from '@/components/BodyMap';
import Header from '@/components/Header';

export default function TherapistSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [latestSignal, setLatestSignal] = useState<PressureSignalRecord | null>(null);
  const [view, setView] = useState<BodyView>('back');
  const [bodyType, setBodyType] = useState<BodyType>('male');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const clientUrl = getClientUrl(sessionId);

  const loadSession = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: sessionData } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!sessionData) {
      router.push('/dashboard');
      return;
    }

    setSession(sessionData);

    const { data: markersData } = await supabase
      .from('markers')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (markersData) setMarkers(markersData);

    const { data: signalData } = await supabase
      .from('pressure_signals')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (signalData?.length) setLatestSignal(signalData[0]);

    setLoading(false);
  }, [sessionId, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Real-time subscriptions
  useEffect(() => {
    const markersChannel = supabase
      .channel(`markers-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'markers',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMarkers((prev) => [...prev, payload.new as Marker]);
        }
      )
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

    const signalsChannel = supabase
      .channel(`signals-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pressure_signals',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setLatestSignal(payload.new as PressureSignalRecord);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(markersChannel);
      supabase.removeChannel(signalsChannel);
    };
  }, [sessionId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(clientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndSession = async () => {
    await supabase
      .from('sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionId);

    setSession((prev) => prev ? { ...prev, status: 'completed' } : null);
  };

  const handleClearMarkers = async () => {
    await supabase.from('markers').delete().eq('session_id', sessionId);
    setMarkers([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading session...</div>
      </div>
    );
  }

  if (!session) return null;

  const isActive = session.status === 'active';
  const signalConfig = latestSignal ? PRESSURE_CONFIG[latestSignal.signal] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header showLogout />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* Session header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">
                {session.client_name || 'Unnamed Client'}
              </h1>
              {isActive && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs bg-[#00F0FF]/10 text-[#00F0FF] rounded-full border border-[#00F0FF]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] pulse-dot" />
                  Live
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500">
              {markers.length} trigger point{markers.length !== 1 ? 's' : ''} mapped
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="px-4 py-2 text-sm border border-white/10 rounded-lg text-neutral-300 hover:text-white hover:border-white/20 transition-colors min-h-[40px]"
                >
                  {showQR ? 'Hide QR' : 'Share Link'}
                </button>
                <button
                  onClick={handleClearMarkers}
                  className="px-4 py-2 text-sm border border-white/10 rounded-lg text-neutral-300 hover:text-white hover:border-white/20 transition-colors min-h-[40px]"
                >
                  Clear Points
                </button>
                <button
                  onClick={handleEndSession}
                  className="px-4 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors min-h-[40px]"
                >
                  End Session
                </button>
              </>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm border border-white/10 rounded-lg text-neutral-300 hover:text-white hover:border-white/20 transition-colors min-h-[40px]"
            >
              Back
            </button>
          </div>
        </div>

        {/* Share panel */}
        {showQR && isActive && (
          <div className="mb-6 p-5 rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/[0.02]">
            <h2 className="text-sm font-medium text-[#00F0FF] mb-3">Share with client</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG value={clientUrl} size={160} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-neutral-400 mb-3">
                  Client scans this QR code or opens the link to start marking pain points.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={clientUrl}
                    className="flex-1 text-sm !bg-black/20 !border-white/10"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 text-sm bg-[#00F0FF] text-[#0a0a0a] rounded-xl font-medium hover:bg-[#00F0FF]/90 transition-colors whitespace-nowrap min-h-[48px]"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pressure signal banner */}
        {latestSignal && signalConfig && (
          <div
            key={latestSignal.id}
            className="mb-6 p-4 rounded-xl border signal-flash flex items-center gap-3"
            style={{
              borderColor: `${signalConfig.color}40`,
              backgroundColor: `${signalConfig.color}10`,
            }}
          >
            <span className="text-2xl">{signalConfig.icon}</span>
            <div>
              <p className="font-semibold" style={{ color: signalConfig.color }}>
                {signalConfig.label}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(latestSignal.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Body map controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {(['front', 'back'] as BodyView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors min-h-[36px] ${
                  view === v
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                    : 'text-neutral-500 hover:text-neutral-300'
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
                className={`px-4 py-1.5 text-sm rounded-md transition-colors min-h-[36px] ${
                  bodyType === bt
                    ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {bt === 'male' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Body maps — show both views side by side on desktop */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
            <BodyMap
              view={view}
              bodyType={bodyType}
              markers={markers}
            />
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hidden md:block">
            <BodyMap
              view={view === 'front' ? 'back' : 'front'}
              bodyType={bodyType}
              markers={markers}
            />
          </div>
        </div>

        {/* Marker list */}
        {markers.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
              Trigger Points ({markers.length})
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {markers.map((marker, i) => (
                <div
                  key={marker.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        marker.intensity === 'mild'
                          ? '#22c55e'
                          : marker.intensity === 'moderate'
                          ? '#eab308'
                          : '#ef4444',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      Point {i + 1} — {marker.intensity}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {marker.view} view
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
