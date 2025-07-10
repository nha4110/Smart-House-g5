import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { module1Devices } from '@/components/ui/module1';
import { module2Devices } from '@/components/ui/module2';
import { module3Devices } from '@/components/ui/module3';
import { module4Devices } from '@/components/ui/module4';

interface Device {
  device_id: number;
  name: string;
  type: string;
  location: string;
  status: string;
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

const deviceTemplates: TemplateDevice[] = [
  ...addDefaultStatus(module1Devices),
  ...addDefaultStatus(module2Devices),
  ...addDefaultStatus(module3Devices),
  ...addDefaultStatus(module4Devices),
];

const predefinedLocations = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Toilet", "Drying Porch", "Porch"];

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [newDevice, setNewDevice] = useState<Omit<Device, 'device_id' | 'last_updated'>>({
    name: '',
    type: '',
    location: '',
    status: 'off',
  });

  useEffect(() => {
    axios.get('/api/devices')
      .then(res => setDevices(res.data))
      .catch(err => console.error('Failed to fetch devices', err));
  }, []);

  const handleAdd = () => setShowModal(true);

  const isFormValid = templateName && newDevice.type && newDevice.location;

  const confirmAddDevice = async () => {
    if (!isFormValid) {
      alert('Please fill in all fields.');
      return;
    }

    const finalName = customLabel ? `${templateName} #${customLabel}` : templateName;
    try {
      const response = await axios.post('/api/devices', { ...newDevice, name: finalName });
      setDevices(prev => [...prev, response.data]);
      setShowModal(false);
      setTemplateName('');
      setTemplateType('');
      setCustomLabel('');
      setDescription('');
      setNewDevice({ name: '', type: '', location: '', status: 'off' });
    } catch (err) {
      console.error('Failed to add device', err);
      alert('Failed to add device. Check backend/server logs.');
    }
  };

  const groupedDevices: Record<string, Device[]> = devices.reduce((acc: Record<string, Device[]>, dev) => {
    acc[dev.location] = acc[dev.location] || [];
    acc[dev.location].push(dev);
    return acc;
  }, {});

  const handleTemplateChange = (value: string) => {
    setTemplateName(value);
    const selected = deviceTemplates.find((d) => d.name === value);
    if (selected) {
      setTemplateType(selected.type);
      setDescription(selected.function);
      setNewDevice((prev) => ({ ...prev, type: selected.type, status: 'off' }));
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Home Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and control your smart home devices
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Add Device
        </button>
      </header>

      {/* Grouped Devices */}
      {Object.entries(groupedDevices).map(([location, locationDevices]) => (
        <section key={location} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{location}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationDevices.map((device) => (
              <div key={device.device_id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{device.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type: {device.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status: {device.status}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Last Updated: {new Date(device.last_updated).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Add Device Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 animate-fadeIn">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Add New Device</h4>

            {/* Template Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Template</label>
              <select
                className="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:text-white"
                value={templateName}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="">Select a Device</option>
                {deviceTemplates.map((d, i) => (
                  <option key={i} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Custom Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Label</label>
              <input
                type="text"
                placeholder="e.g., 1222"
                className="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:text-white"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>

            {/* Device Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <select
                className="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:text-white"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
              >
                <option value="">Select Location</option>
                {predefinedLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Auto-filled Info */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400"><strong>Type:</strong> {templateType}</div>
              {description && <div className="text-sm text-gray-500 dark:text-gray-300 italic">{description}</div>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white"
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
