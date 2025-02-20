import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <Header />
      {children}
    </div>
  );
} 