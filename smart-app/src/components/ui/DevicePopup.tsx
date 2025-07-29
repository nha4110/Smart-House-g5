import { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';

interface DevicePopupProps {
  deviceId: number;
  onClose: () => void;
}

interface EventLog {
  event_type: string;
  details: string;
  timestamp: string;
}

interface Rule {
  rule_id: number;
  name: string;
  description: string;
  is_active: boolean;
  trigger_type: string;
  action: string;
}

interface DeviceDetails {
  device_id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  last_updated: string;
  event_logs: EventLog[];
  rules: Rule[];
}

interface DeviceBehavior {
  device: string;
  type?: string;
  status?: string;
  reason?: string;
  reading?: { temperature?: number; humidity?: number };
  message?: string;
}

export default function DevicePopup({ deviceId, onClose }: DevicePopupProps) {
  const [device, setDevice] = useState<DeviceDetails | null>(null);
  const [behavior, setBehavior] = useState<DeviceBehavior | null>(null);
  const [error, setError] = useState(false);
  const [isOn, setIsOn] = useState(false);

  // Configure Axios base URL using Vite's environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/device/${deviceId}`)
      .then(res => {
        const data = res.data;

        // Sanitize values to ensure they're all strings
        const sanitized: DeviceDetails = {
          ...data,
          name: String(data.name),
          type: String(data.type),
          location: String(data.location),
          status: String(data.status),
          last_updated: String(data.last_updated),
          event_logs: Array.isArray(data.event_logs) ? data.event_logs : [],
          rules: Array.isArray(data.rules) ? data.rules : [],
        };

        setDevice(sanitized);
        setIsOn(sanitized.status.toLowerCase() === 'on');
        setError(false);

        // Extract base device name (before #) and fetch behavior
        const deviceName = sanitized.name.split('#')[0].trim();
        axios.get(`${API_BASE_URL}/api/device-behavior/${encodeURIComponent(deviceName)}`)
          .then(res => setBehavior(res.data))
          .catch(err => {
            console.error('Error fetching device behavior:', err);
            setBehavior({ device: deviceName, message: 'Failed to fetch behavior' });
          });
      })
      .catch(err => {
        console.error('Error fetching device info:', err);
        setError(true);
      });
  }, [deviceId]);

  const toggleDevice = async (enabled: boolean) => {
    try {
      await axios.put(`${API_BASE_URL}/api/device/${deviceId}/status`, {
        status: enabled ? 'on' : 'off',
      });
      setIsOn(enabled);
      setDevice(prev => prev ? { ...prev, status: enabled ? 'on' : 'off' } : prev);
    } catch (err) {
      console.error('Error updating device status:', err);
    }
  };

  const deleteDevice = async () => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/device/${deviceId}`);
      onClose();
    } catch (err) {
      console.error('Error deleting device:', err);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-black/100 flex justify-center items-center">
        <div className="bg-zinc-900 border border-white rounded-2xl shadow-xl p-6 max-w-3xl w-full space-y-4 text-white">
          <p className="text-red-400">⚠️ Failed to load device data.</p>
          <button
            onClick={onClose}
            className="text-sm text-blue-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!device) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-zinc-900 border border-white rounded-2xl shadow-2xl p-6 max-w-6xl w-full animate-fadeIn space-y-4 text-white">
        {/* Device Name Header */}
        <div className="flex justify-center">
          <div className="bg-zinc-800 text-white font-semibold rounded-lg px-6 py-3 text-xl text-center shadow-md border border-zinc-700">
            {String(device.name)}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 grid-rows-[1fr_1fr_auto] gap-4 h-[600px]">
          {/* Device Info */}
          <div className="col-span-1">
            <div className="bg-zinc-800 p-4 rounded-lg shadow-inner text-sm h-full space-y-1 border border-zinc-700">
              <h4 className="font-semibold text-lg mb-2">Device Info</h4>
              <p><strong>ID:</strong> {device.device_id}</p>
              <p><strong>Type:</strong> {String(device.type)}</p>
              <p><strong>Location:</strong> {String(device.location)}</p>
              <p><strong>Status:</strong> {String(device.status)}</p>
              <p><strong>Last Updated:</strong> {new Date(device.last_updated).toLocaleString()}</p>
              {behavior && (
                <>
                  <p><strong>Behavior Status:</strong> {behavior.status || behavior.reading ? `${behavior.reading?.temperature}°C, ${behavior.reading?.humidity}%` : behavior.message || 'N/A'}</p>
                  <p><strong>Reason:</strong> {behavior.reason || behavior.message || 'N/A'}</p>
                </>
              )}
            </div>
          </div>

          {/* Event Log */}
          <div className="row-span-2 overflow-y-auto bg-zinc-800 p-4 rounded-lg text-sm border border-zinc-700">
            <h4 className="text-lg font-semibold mb-2">Event Log</h4>
            {device.event_logs.length === 0 ? (
              <p className="italic text-gray-400">No events recorded.</p>
            ) : (
              <ul className="space-y-2">
                {device.event_logs.map((log, idx) => (
                  <li key={idx} className="border-b border-zinc-600 pb-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{String(log.event_type)}</span>
                      <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-300 text-xs">{String(log.details)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rules */}
          <div className="bg-zinc-800 p-4 rounded-lg shadow-inner text-sm overflow-y-auto max-h-64 border border-zinc-700">
            <h4 className="text-lg font-semibold mb-2">Rules</h4>
            {device.rules.length === 0 ? (
              <p className="italic text-gray-400">No rules assigned to this device.</p>
            ) : (
              <ul className="space-y-3">
                {device.rules.map(rule => (
                  <li key={rule.rule_id} className="border-l-4 border-indigo-500 pl-3">
                    <p className="font-semibold text-white">
                      {String(rule.name)}
                      {!rule.is_active && <span className="text-red-400 ml-2">(Inactive)</span>}
                    </p>
                    <p className="text-xs text-gray-300">{rule.description ? String(rule.description) : "No description provided."}</p>
                    <p className="text-xs italic text-gray-500">
                      Trigger: {String(rule.trigger_type)} → Action: {String(rule.action)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Right Controls */}
          <div className="col-start-2 flex justify-end items-end space-x-4">
            <div className="flex items-center space-x-2">
              <p>Turn device off/on</p>
              <Switch
                checked={isOn}
                onChange={toggleDevice}
                className={`${isOn ? 'bg-green-500' : 'bg-zinc-600'} relative inline-flex h-6 w-12 items-center rounded-full transition`}
              >
                <span
                  className={`${isOn ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <span className="text-sm text-white">{isOn ? 'On' : 'Off'}</span>
            </div>

            <button
              onClick={deleteDevice}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>

            <button
              onClick={() => {
                onClose();
                window.location.reload();
              }}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}