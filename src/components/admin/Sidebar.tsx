'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CubeIcon, CogIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import AdminHeader from './AdminHeader';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Landing Page', href: '/admin/landing-settings', icon: VideoCameraIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPage = menuItems.find(item => item.href === pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 ${
                    pathname === item.href ? 'bg-gray-100 text-primary' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-1">
          <AdminHeader title={currentPage} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 