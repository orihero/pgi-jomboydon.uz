import { Inter } from 'next/font/google';
import LandingHeader from '@/components/landing/LandingHeader';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <LandingHeader />
      {children}
    </div>
  );
} 