import { Inter } from 'next/font/google';
import AdminLayout from '@/components/admin/AdminLayout';
import AuthProvider from '@/components/providers/SessionProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Panel - PGI Jomboydon',
  description: 'Admin panel for PGI Jomboydon website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </div>
    </AuthProvider>
  );
} 