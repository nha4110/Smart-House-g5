import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { module1Devices } from '@/components/ui/module1';
import { module2Devices } from '@/components/ui/module2';
import { module3Devices } from '@/components/ui/module3';
import { module4Devices } from '@/components/ui/module4';
import DevicePopup from '@/components/ui/DevicePopup';

interface Device {
  device_id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  module: string;
  last_updated: string;
}

interface TemplateDevice {
  name: string;
  type: string;
  function: string;
  status: string;
}

const addDefaultStatus = (devices: Omit<TemplateDevice, 'status'>[]): TemplateDevice[] =>
  devices.map((d) => ({ ...d, status: 'off' }));

// Combine and tag each template with module name
const moduleTaggedTemplates = [
  ...addDefaultStatus(module1Devices).map(d => ({ ...d, module: 'module1' })),
  ...addDefaultStatus(module2Devices).map(d => ({ ...d, module: 'module2' })),
  ...addDefaultStatus(module3Devices).map(d => ({ ...d, module: 'module3' })),
  ...addDefaultStatus(module4Devices).map(d => ({ ...d, module: 'module4' })),
];

const predefinedLocations = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Toilet", "Drying Porch", "Porch"];

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [description, setDescription] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [moduleTag, setModuleTag] = useState('');
  const [newDevice, setNewDevice] = useState<Omit<Device, 'device_id' | 'last_updated'>>({
    name: '',
    type: '',
    location: '',
    status: 'off',
    module: '',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch devices from API and update local storage
  const fetchDevices = async () => {
    try {
      const res = await axios.get('/api/devices');
      const fetchedDevices = res.data;
      setDevices(fetchedDevices);
      localStorage.setItem('devices', JSON.stringify(fetchedDevices));
    } catch (err) {
      console.error('Failed to fetch devices', err);
    }
  };

  // Load devices on mount
  useEffect(() => {
    // Load from local storage first
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      try {
        const parsedDevices = JSON.parse(storedDevices);
        if (Array.isArray(parsedDevices)) {
          setDevices(parsedDevices);
        }
      } catch (err) {
        console.error('Failed to parse devices from local storage', err);
      }
    }
    // Fetch fresh data in the background
    fetchDevices();
  }, [refreshTrigger]);

  const handleAdd = () => setShowModal(true);

  const resetForm = () => {
    setTemplateName('');
    setTemplateType('');
    setCustomLabel('');
    setDescription('');
    setModuleTag('');
    setNewDevice({ name: '', type: '', location: '', status: 'off', module: '' });
  };

  const isFormValid = templateName && newDevice.type && newDevice.location && newDevice.module;

  const confirmAddDevice = async () => {
    if (!isFormValid) {
      alert('Please fill in all fields.');
      return;
    }

    const finalName = customLabel ? `${templateName} #${customLabel}` : templateName;
    try {
      const response = await axios.post('/api/devices', {
        ...newDevice,
        name: finalName,
      });
      setDevices(prev => [...prev, response.data]);
      localStorage.setItem('devices', JSON.stringify([...devices, response.data]));
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add device', err);
      alert('Failed to add device. Please check the backend logs.');
    }
  };

  const handleTemplateChange = (value: string) => {
    setTemplateName(value);
    const selected = moduleTaggedTemplates.find((d) => d.name === value);
    if (selected) {
      setTemplateType(selected.type);
      setDescription(selected.function);
      setModuleTag(selected.module);
      setNewDevice((prev) => ({
        ...prev,
        type: selected.type,
        status: 'off',
        module: selected.module,
      }));
    }
  };

  const handlePopupClose = () => {
    setSelectedDeviceId(null);
    setRefreshTrigger(prev => prev + 1); // Trigger device refresh
  };

  const groupedDevices: Record<string, Device[]> = devices.reduce((acc, device) => {
    const location = device.location || 'Unassigned';
    if (!acc[location]) acc[location] = [];
    acc[location].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Home Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and control your smart home devices</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Add Device
        </button>
      </header>

      {/* Grouped Devices by Location */}
      {Object.entries(groupedDevices).map(([location, locationDevices]) => (
        <section key={location} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{location}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationDevices.map((device) => (
              <div
                key={device.device_id}
                onClick={() => setSelectedDeviceId(device.device_id)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:ring-2 hover:ring-blue-500"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{device.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type: {device.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status: {device.status}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Module: {device.module}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Last Updated: {new Date(device.last_updated).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Device Info Popup */}
      {selectedDeviceId !== null && (
        <DevicePopup
          deviceId={selectedDeviceId}
          onClose={handlePopupClose}
        />
      )}

      {/* Add Device Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 animate-fadeIn">
            <h4 className="text-lg font-bold text-gray-100">Add New Device</h4>

            {/* Device Template */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Device Template</label>
              <select
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white"
                value={templateName}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">Select a Device</option>
                {moduleTaggedTemplates.map((d, i) => (
                  <option key={i} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Custom Label */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Custom Label</label>
              <input
                type="text"
                placeholder="e.g., 1222"
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>

            {/* Device Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <select
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
              >
                <option value="">Select Location</option>
                {predefinedLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Auto-filled Fields */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400"><strong>Type:</strong> {templateType}</div>
              {description && <div className="text-sm text-gray-400 italic">{description}</div>}
              {moduleTag && <div className="text-sm text-gray-500">Module: <strong>{moduleTag}</strong></div>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddDevice}
                disabled={!isFormValid}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}