'use client';

import { useSession } from 'next-auth/react';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <BellIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">{session?.user?.name}</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 