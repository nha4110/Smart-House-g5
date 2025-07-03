import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/use-theme';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    autoRain: true,
    autoClimate: true,
    voiceControl: true,
    autoLock: true,
    intrusionAlerts: true,
  });
  const [targetTemp, setTargetTemp] = useState([24]);
  const [maxHumidity, setMaxHumidity] = useState([70]);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dark Mode
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Rain Protection
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically close windows when rain detected
                  </p>
                </div>
                <Switch
                  checked={settings.autoRain}
                  onCheckedChange={(value) => handleSettingChange('autoRain', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Smart Climate Control
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Auto adjust AC and dehumidifier
                  </p>
                </div>
                <Switch
                  checked={settings.autoClimate}
                  onCheckedChange={(value) => handleSettingChange('autoClimate', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Voice Control
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enable Google Assistant integration
                  </p>
                </div>
                <Switch
                  checked={settings.voiceControl}
                  onCheckedChange={(value) => handleSettingChange('voiceControl', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Thresholds */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Climate Thresholds
            </CardTitle>
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
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Lock
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Lock doors when leaving home
                  </p>
                </div>
                <Switch
                  checked={settings.autoLock}
                  onCheckedChange={(value) => handleSettingChange('autoLock', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Intrusion Alerts
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Send notifications for security events
                  </p>
                </div>
                <Switch
                  checked={settings.intrusionAlerts}
                  onCheckedChange={(value) => handleSettingChange('intrusionAlerts', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
