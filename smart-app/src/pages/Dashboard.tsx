import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets, CloudRain, Shield } from 'lucide-react';
import { Module1Climate } from '@/components/devices/module1-climate';
import { Module2Rain } from '@/components/devices/module2-rain';
import { Module3Windows } from '@/components/devices/module3-windows';
import { Module4Security } from '@/components/devices/module4-security';
import { AutomationControls } from '@/components/automation/automation-controls';
import { SensorData } from '@/types/devices';
import { useWebSocket } from '@/hooks/use-websocket';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<{ 
    temperature?: SensorData; 
    humidity?: SensorData; 
    rain?: SensorData; 
  }>({});
  const { lastMessage } = useWebSocket('/ws');

  const { data: temperature } = useQuery<SensorData>({
    queryKey: ['/api/sensors/temperature'],
    refetchInterval: 10000,
  });

  const { data: humidity } = useQuery<SensorData>({
    queryKey: ['/api/sensors/humidity'],
    refetchInterval: 10000,
  });

  const { data: rain } = useQuery<SensorData>({
    queryKey: ['/api/sensors/rain'],
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (temperature) setSensorData(prev => ({ ...prev, temperature }));
    if (humidity) setSensorData(prev => ({ ...prev, humidity }));
    if (rain) setSensorData(prev => ({ ...prev, rain }));
  }, [temperature, humidity, rain]);

  // Update from WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'sensor_update' && lastMessage.sensors) {
      setSensorData({
        temperature: lastMessage.sensors.temperature,
        humidity: lastMessage.sensors.humidity,
        rain: lastMessage.sensors.rain,
      });
    }
  }, [lastMessage]);

  const getRainStatus = () => {
    return sensorData.rain?.value === 'true' ? 'Raining' : 'No Rain';
  };

  const getSecurityStatus = () => {
    // This would come from device states in a real implementation
    return 'Secure';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Device Control Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and control all your smart home devices
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensorData.temperature ? `${sensorData.temperature.value}${sensorData.temperature.unit}` : '--°C'}
              </p>
            </div>
            <Thermometer className="text-2xl text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensorData.humidity ? `${sensorData.humidity.value}${sensorData.humidity.unit}` : '--%'}
              </p>
            </div>
            <Droplets className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rain Status</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {getRainStatus()}
              </p>
            </div>
            <CloudRain className="text-2xl text-gray-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Security</p>
              <p className="text-2xl font-bold text-success">{getSecurityStatus()}</p>
            </div>
            <Shield className="text-2xl text-success" />
          </div>
        </div>
      </div>

      {/* Module Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Module1Climate />
        <Module2Rain />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Module3Windows />
        <Module4Security />
      </div>

      {/* Automation Controls */}
      <AutomationControls />
    </div>
  );
}
