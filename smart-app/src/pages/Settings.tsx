import { useState } from 'react';
import { useLocation } from 'wouter';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/use-theme';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [targetTemp, setTargetTemp] = useState([24]);
  const [maxHumidity, setMaxHumidity] = useState([70]);
  const [, navigate] = useLocation();

  const [settings, setSettings] = useState({
    autoRain: true,
    autoClimate: true,
    voiceControl: true,
    autoLock: true,
    intrusionAlerts: true,
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    const username = localStorage.getItem('currentUser');

    if (!username) {
      console.warn('No currentUser found in localStorage');
      navigate('/');
      return;
    }

    try {
      // ✅ Send DELETE request to backend logout route
      await fetch(`/api/logout/${username}`, { method: 'DELETE' });

      // Clear and redirect
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
        <p className="text-gray-600 dark:text-gray-400">
          Customize your smart home experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                ['autoRain', 'Auto Rain Protection', 'Automatically close windows when rain detected'],
                ['autoClimate', 'Smart Climate Control', 'Auto adjust AC and dehumidifier'],
                ['voiceControl', 'Voice Control', 'Enable Google Assistant integration'],
              ].map(([key, label, desc]) => (
                <div className="flex items-center justify-between" key={key}>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key as keyof typeof settings]}
                    onCheckedChange={(value) => handleSettingChange(key as string, value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Climate Thresholds */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Climate Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Temperature: <span className="text-primary">{targetTemp[0]}°C</span>
                </label>
                <Slider
                  value={targetTemp}
                  onValueChange={setTargetTemp}
                  max={30}
                  min={18}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Humidity: <span className="text-primary">{maxHumidity[0]}%</span>
                </label>
                <Slider
                  value={maxHumidity}
                  onValueChange={setMaxHumidity}
                  max={80}
                  min={40}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                ['autoLock', 'Auto Lock', 'Lock doors when leaving home'],
                ['intrusionAlerts', 'Intrusion Alerts', 'Send notifications for security events'],
              ].map(([key, label, desc]) => (
                <div className="flex items-center justify-between" key={key}>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key as keyof typeof settings]}
                    onCheckedChange={(value) => handleSettingChange(key as string, value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
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
    </div>
  );
}
