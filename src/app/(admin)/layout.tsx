import { Inter } from 'next/font/google';
import AuthProvider from '@/components/providers/SessionProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Panel - PGI Jomboydon',
  description: 'Admin panel for PGI Jomboydon website',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={`${inter.className} min-h-screen bg-[#4B83F2]`}>
        {children}
      </div>
    </AuthProvider>
  );
} 