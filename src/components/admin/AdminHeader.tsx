'use client';

import { useSession, signOut } from 'next-auth/react';
import { 
  BellIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = 'Dashboard' }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {title}
          </h1>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-gray-500">
            Welcome, {session?.user?.name || 'Admin'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            title="Notifications"
          >
            <BellIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 border-r pr-4">
              <UserCircleIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">{session?.user?.name}</span>
            </div>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
              title="Sign out"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 