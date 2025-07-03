export interface DeviceState {
  id: number;
  deviceId: string;
  deviceType: string;
  state: boolean;
  value?: string | null;
  lastUpdated: Date;
}

export interface SensorData {
  id: number;
  sensorType: string;
  value: string;
  unit: string;
  timestamp: Date;
}

export interface AutomationSetting {
  id: number;
  userId?: number | null;
  settingKey: string;
  settingValue: boolean;
}

export interface User {
  id: number;
  username: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface ConnectionStatus {
  backend: boolean;
  thingsboard: boolean;
  testing: boolean;
}
