import { apiRequest } from './queryClient';

export class DeviceService {
  static async testBackendConnection(): Promise<{ connected: boolean; message: string }> {
    const response = await apiRequest('GET', '/api/iot/test-backend');
    return response.json();
  }

  static async testThingsBoardConnection(): Promise<{ connected: boolean; message: string }> {
    const response = await apiRequest('GET', '/api/iot/test-thingsboard');
    return response.json();
  }

  static async getDevices() {
    const response = await apiRequest('GET', '/api/devices');
    return response.json();
  }

  static async updateDevice(deviceId: string, state: boolean, value?: string) {
    const response = await apiRequest('POST', `/api/devices/${deviceId}`, {
      state,
      value,
    });
    return response.json();
  }

  static async getSensorData(sensorType: string) {
    const response = await apiRequest('GET', `/api/sensors/${sensorType}`);
    return response.json();
  }

  static async createUser(username: string) {
    const response = await apiRequest('POST', '/api/users', {
      username,
      isAnonymous: true,
    });
    return response.json();
  }
}
