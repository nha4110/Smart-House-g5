// ✅ File: smart-app/src/lib/device-service.ts

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8081/api'
    : '/api'; // Use relative path on Vercel

/**
 * Makes a typed API request with standard headers.
 * Handles JSON body automatically.
 */
async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response;
}

export class DeviceService {
  /**
   * Test connection to backend server.
   * @returns { connected: boolean, message: string }
   */
  static async testBackendConnection(): Promise<{ connected: boolean; message: string }> {
    const response = await apiRequest('GET', '/iot/test-backend');
    return response.json();
  }

  /**
   * Test connection to ThingsBoard IoT platform.
   * @returns { connected: boolean, message: string }
   */
  static async testThingsBoardConnection(): Promise<{ connected: boolean; message: string }> {
    const response = await apiRequest('GET', '/iot/test-thingsboard');
    return response.json();
  }

  /**
   * Get all smart devices currently managed by the system.
   */
  static async getDevices(): Promise<any[]> {
    const response = await apiRequest('GET', '/devices');
    return response.json();
  }

  /**
   * Update the state or value of a specific device.
   * @param deviceId - The ID of the device to control.
   * @param state - The on/off state of the device.
   * @param value - Optional value such as temperature or brightness.
   */
  static async updateDevice(
    deviceId: string,
    state: boolean,
    value?: string
  ): Promise<any> {
    const response = await apiRequest('POST', `/devices/${deviceId}`, {
      state,
      value,
    });
    return response.json();
  }

  /**
   * Retrieve sensor data by sensor type (e.g., temperature, humidity).
   * @param sensorType - The sensor type to query.
   */
  static async getSensorData(sensorType: string): Promise<any> {
    const response = await apiRequest('GET', `/sensors/${sensorType}`);
    return response.json();
  }

  /**
   * Create an anonymous user account (limit enforced to 3 users).
   * @param username - A randomly generated anonymous username.
   * @returns Newly created user with id, username, and timestamp.
   */
  static async createUser(username: string): Promise<{
    id: number;
    username: string;
    created_at: string;
  }> {
    const response = await apiRequest('POST', '/users', {
      username,
    });

    if (!response.ok) {
      let message = 'Failed to create anonymous user';
      try {
        const error = await response.json();
        message = error?.error || message;
      } catch (_) {
        // fallback if not JSON
      }
      throw new Error(message);
    }

    return response.json();
  }
}
