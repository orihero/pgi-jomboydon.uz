'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const response = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white rounded-[32px] p-10">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-medium text-gray-900 mb-2">
            Login to Account
          </h1>
          <p className="text-[#667085]">
            Please enter your email and password to continue
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-[#344054] text-sm">
              Email address:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full h-11 px-3.5 py-2.5 bg-[#F9FAFB] border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B83F2] focus:ring-opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-[#344054] text-sm">
                Password
              </label>
              <button 
                type="button" 
                className="text-sm text-[#4B83F2] hover:text-[#3A67C2]"
              >
                Forget Password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full h-11 px-3.5 py-2.5 bg-[#F9FAFB] border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B83F2] focus:ring-opacity-50"
              placeholder="••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              className="h-4 w-4 text-[#4B83F2] border-[#D0D5DD] rounded focus:ring-[#4B83F2]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[#667085]">
              Remember Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-white bg-[#4B83F2] hover:bg-[#3A67C2] rounded-lg transition-colors disabled:opacity-50"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-[#667085]">
            Don't have an account?{' '}
            <button type="button" className="text-[#4B83F2] hover:text-[#3A67C2]">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 