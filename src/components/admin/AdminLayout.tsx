'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiSettings, FiHome, FiBox, FiFileText } from 'react-icons/fi';
import { RiPagesLine } from 'react-icons/ri';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Products', href: '/admin/products', icon: FiBox },
    { name: 'News', href: '/admin/news', icon: FiFileText },
    { name: 'Landing Settings', href: '/admin/landing-settings', icon: RiPagesLine },
    { name: 'Site Settings', href: '/admin/site-settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-xl font-semibold">Admin Panel</span>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm rounded-md ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
} 