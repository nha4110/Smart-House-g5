import { Home, DoorOpen, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useDeviceState } from '@/hooks/use-device-state';

export function Module2Rain() {
  const { isDeviceOn, updateDevice } = useDeviceState();

  const handleDeviceToggle = (deviceId: string, deviceType: string) => {
    const currentState = isDeviceOn(deviceId);
    updateDevice(deviceId, deviceType, !currentState);
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Rain Protection
          </CardTitle>
          <Badge className="bg-success text-white">Module 2 - Drying Porch</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Roof Cover</span>
            </div>
            <Switch
              checked={isDeviceOn('roof')}
              onCheckedChange={() => handleDeviceToggle('roof', 'servo')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DoorOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Patio Door</span>
            </div>
            <Switch
              checked={isDeviceOn('patio-door')}
              onCheckedChange={() => handleDeviceToggle('patio-door', 'servo')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Water Heater</span>
            </div>
            <Switch
              checked={isDeviceOn('water-heater')}
              onCheckedChange={() => handleDeviceToggle('water-heater', 'relay')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
