import { useQuery } from '@tanstack/react-query';
import { Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SensorData } from '@/types/devices';
import { useWebSocket } from '@/hooks/use-websocket';
import { useEffect, useState } from 'react';

export function Module1Climate() {
  const [sensorData, setSensorData] = useState<{ temperature?: SensorData; humidity?: SensorData }>({});
  const { lastMessage } = useWebSocket('/ws');

  const { data: temperature } = useQuery<SensorData>({
    queryKey: ['/api/sensors/temperature'],
    refetchInterval: 10000,
  });

  const { data: humidity } = useQuery<SensorData>({
    queryKey: ['/api/sensors/humidity'],
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (temperature) setSensorData(prev => ({ ...prev, temperature }));
    if (humidity) setSensorData(prev => ({ ...prev, humidity }));
  }, [temperature, humidity]);

  // Update from WebSocket
  useEffect(() => {
    if (lastMessage?.type === 'sensor_update' && lastMessage.sensors) {
      setSensorData({
        temperature: lastMessage.sensors.temperature,
        humidity: lastMessage.sensors.humidity,
      });
    }
  }, [lastMessage]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Climate Monitoring
          </CardTitle>
          <Badge className="bg-success text-white">Module 1 - Kitchen</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
              <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {sensorData.temperature ? `${sensorData.temperature.value}${sensorData.temperature.unit}` : '--°C'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {sensorData.humidity ? `${sensorData.humidity.value}${sensorData.humidity.unit}` : '--%'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
