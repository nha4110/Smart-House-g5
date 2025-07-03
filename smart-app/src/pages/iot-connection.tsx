import { useState } from 'react';
import { Wifi, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { DeviceService } from '@/lib/device-service';
import { ConnectionStatus } from '@/types/devices';
import { useToast } from '@/hooks/use-toast';
import { Module1Climate } from '@/components/devices/module1-climate';
import { Module2Rain } from '@/components/devices/module2-rain';

export default function IoTConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    backend: false,
    thingsboard: false,
    testing: false,
  });
  const { toast } = useToast();

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      setConnectionStatus(prev => ({ ...prev, testing: true }));
      
      const [backendResult, thingsboardResult] = await Promise.all([
        DeviceService.testBackendConnection(),
        DeviceService.testThingsBoardConnection(),
      ]);

      return { backendResult, thingsboardResult };
    },
    onSuccess: ({ backendResult, thingsboardResult }) => {
      setConnectionStatus({
        backend: backendResult.connected,
        thingsboard: thingsboardResult.connected,
        testing: false,
      });

      if (backendResult.connected && thingsboardResult.connected) {
        toast({
          title: "Connection Successful",
          description: "All systems are connected and ready for live control",
        });
      } else {
        toast({
          title: "Connection Issues",
          description: "Some connections failed. Check your network and try again.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      setConnectionStatus({
        backend: false,
        thingsboard: false,
        testing: false,
      });
      toast({
        title: "Connection Failed",
        description: "Unable to test connections. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isConnected = connectionStatus.backend && connectionStatus.thingsboard;

  const getStatusIcon = (connected: boolean, testing: boolean) => {
    if (testing) {
      return <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />;
    }
    return connected ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusText = (connected: boolean, testing: boolean) => {
    if (testing) return "Testing connection...";
    return connected ? "Connected" : "Connection failed";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          IoT Connection
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect to real IoT devices and ThingsBoard backend
        </p>
      </div>

      {/* Connection Status */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Connection Status
            </CardTitle>
            <Button
              onClick={() => testConnectionMutation.mutate()}
              disabled={connectionStatus.testing}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {connectionStatus.testing ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              {getStatusIcon(connectionStatus.backend, connectionStatus.testing)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Backend Server</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getStatusText(connectionStatus.backend, connectionStatus.testing)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusIcon(connectionStatus.thingsboard, connectionStatus.testing)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">ThingsBoard</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getStatusText(connectionStatus.thingsboard, connectionStatus.testing)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Device Controls */}
      <div className={isConnected ? '' : 'opacity-50 pointer-events-none'}>
        {!isConnected && (
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Device controls are disabled until connection is established
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isConnected && (
          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Connected successfully! Live device control enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Climate Data */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Climate Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <Module1Climate />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">--°C</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">--%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Device Control */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Device Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <Module2Rain />
              ) : (
                <div className="space-y-4">
                  {['Main Door', 'Windows', 'Climate System'].map((device) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{device}</span>
                      <Badge variant="secondary" className="bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                        Offline
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
