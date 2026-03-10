'use client';

import Link from 'next/link';
import { Session } from '@/types';
import { formatDate } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  markerCount?: number;
}

export default function SessionCard({ session, markerCount = 0 }: SessionCardProps) {
  const isActive = session.status === 'active';

  return (
    <Link
      href={`/session/${session.id}`}
      className="block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-white group-hover:text-[#00F0FF] transition-colors">
            {session.client_name || 'Unnamed Client'}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {formatDate(session.created_at)}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            isActive
              ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20'
              : 'bg-neutral-800 text-neutral-400 border border-white/5'
          }`}
        >
          {isActive ? 'Active' : 'Completed'}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
            <circle cx="8" cy="8" r="3" />
          </svg>
          {markerCount} point{markerCount !== 1 ? 's' : ''}
        </span>
        {session.notes && (
          <span className="truncate max-w-[200px]">{session.notes}</span>
        )}
      </div>
    </Link>
  );
}
