import { useLocation } from 'wouter';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    const username = localStorage.getItem('currentUser');

    if (!username) {
      console.warn('No currentUser found in localStorage');
      navigate('/');
      return;
    }

    try {
      await fetch(`/api/logout/${username}`, { method: 'DELETE' });
      localStorage.removeItem('currentUser');
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to logout. Try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your session</p>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout and return to Home
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
