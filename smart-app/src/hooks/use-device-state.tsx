import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeviceState } from '@/types/devices';
import { apiRequest } from '@/lib/queryClient';
import { useWebSocket } from './use-websocket';

export function useDeviceState() {
  const queryClient = useQueryClient();
  const { lastMessage, sendMessage } = useWebSocket('/ws');

  // Fetch all device states
  const { data: devices = [], isLoading } = useQuery<DeviceState[]>({
    queryKey: ['/api/devices'],
  });

  // Update device state mutation
  const updateDeviceMutation = useMutation({
    mutationFn: async ({ deviceId, deviceType, state, value }: {
      deviceId: string;
      deviceType: string;
      state: boolean;
      value?: string;
    }) => {
      const response = await apiRequest('POST', `/api/devices/${deviceId}`, {
        deviceType,
        state,
        value,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    },
  });

  // Listen for WebSocket updates
  useEffect(() => {
    if (lastMessage?.type === 'device_state_updated') {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    }
  }, [lastMessage, queryClient]);

  const updateDevice = (deviceId: string, deviceType: string, state: boolean, value?: string) => {
    // Send via WebSocket for real-time updates
    sendMessage({
      type: 'device_control',
      deviceId,
      deviceType,
      state,
      value,
    });

    // Also update via REST API
    updateDeviceMutation.mutate({ deviceId, deviceType, state, value });
  };

  const getDeviceState = (deviceId: string): DeviceState | undefined => {
    return devices.find(device => device.deviceId === deviceId);
  };

  const isDeviceOn = (deviceId: string): boolean => {
    const device = getDeviceState(deviceId);
    return device?.state || false;
  };

  return {
    devices,
    isLoading,
    updateDevice,
    getDeviceState,
    isDeviceOn,
    isUpdating: updateDeviceMutation.isPending,
  };
}
