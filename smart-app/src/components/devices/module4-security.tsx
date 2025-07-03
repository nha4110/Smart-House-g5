import { DoorClosed, CreditCard, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeviceState } from '@/hooks/use-device-state';
import { useToast } from '@/hooks/use-toast';

export function Module4Security() {
  const { isDeviceOn, updateDevice } = useDeviceState();
  const { toast } = useToast();

  const handleEmergencyUnlock = () => {
    updateDevice('main-door', 'servo', true);
    toast({
      title: "Emergency Unlock Activated",
      description: "Main door has been unlocked for 30 seconds",
    });

    // Auto-lock after 30 seconds
    setTimeout(() => {
      updateDevice('main-door', 'servo', false);
    }, 30000);
  };

  const isDoorLocked = !isDeviceOn('main-door');

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Security & Access
          </CardTitle>
          <Badge className="bg-success text-white">Module 4 - Main Door</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DoorClosed className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Main Door</span>
            </div>
            <Badge className={isDoorLocked ? "bg-success text-white" : "bg-yellow-500 text-white"}>
              {isDoorLocked ? "Locked" : "Unlocked"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">RFID Access</span>
            </div>
            <Badge className="bg-success text-white">Active</Badge>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Last Access</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Today, 2:34 PM - RFID Card
            </p>
          </div>
          <Button
            onClick={handleEmergencyUnlock}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Emergency Unlock
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
