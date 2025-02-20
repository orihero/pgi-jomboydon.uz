'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activities')
        ]);

        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();

        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats?.totalProducts ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats?.totalOrders ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats?.totalUsers ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <span className="text-gray-600">{activity.action}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 