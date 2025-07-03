import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeviceState } from '@/hooks/use-device-state';

export function Module3Windows() {
  const { isDeviceOn, updateDevice } = useDeviceState();

  const handleDeviceToggle = (deviceId: string, deviceType: string) => {
    const currentState = isDeviceOn(deviceId);
    updateDevice(deviceId, deviceType, !currentState);
  };

  const devices = [
    { id: 'living-window', name: 'Living Room Window', type: 'servo' },
    { id: 'bedroom-window', name: 'Bedroom Window', type: 'servo' },
    { id: 'living-lights', name: 'Living Room Lights', type: 'relay' },
    { id: 'kitchen-lights', name: 'Kitchen Lights', type: 'relay' },
    { id: 'ac', name: 'Air Conditioner', type: 'relay' },
    { id: 'dehumidifier', name: 'Dehumidifier', type: 'relay' },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Windows & Lighting
          </CardTitle>
          <Badge className="bg-success text-white">Module 3 - Living Room</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{device.name}</span>
              <Switch
                checked={isDeviceOn(device.id)}
                onCheckedChange={() => handleDeviceToggle(device.id, device.type)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
