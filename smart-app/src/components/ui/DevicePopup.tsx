import { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';

interface DevicePopupProps {
  deviceId: number;
  onClose: () => void;
}

interface EventLog {
  event_type: string;
  details: { status?: string; reason?: string; reading?: { temperature?: number; humidity?: number } };
  timestamp: string;
}

interface Rule {
  rule_id: number;
  device_id: number;
  name: string;
  description: string;
  is_active: boolean;
  trigger_type: string;
  action: string;
}

interface RFIDLog {
  access_id: number;
  device_id: number;
  card_uid: string;
  is_valid: boolean;
  was_successful: boolean;
  attempted_at: string;
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
  rfid_logs: RFIDLog[];
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
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showRFIDForm, setShowRFIDForm] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    rule_id: null as number | null,
    name: '',
    description: '',
    is_active: true,
    trigger_type: '',
    action: '',
  });
  const [rfidForm, setRFIDForm] = useState({
    card_uid: '',
    is_valid: true,
    was_successful: true,
  });

  const fetchDeviceData = async (controller: AbortController) => {
    try {
      const res = await axios.get(`/api/device/${deviceId}`, { signal: controller.signal });
      if (!res.data) return;
      const data = res.data;

      const sanitized: DeviceDetails = {
        ...data,
        name: String(data.name),
        type: String(data.type),
        location: String(data.location),
        status: String(data.status),
        last_updated: String(data.last_updated),
        event_logs: Array.isArray(data.event_logs)
          ? data.event_logs.map((log: EventLog) => {
              let parsedDetails = log.details;
              if (typeof log.details === 'string') {
                try {
                  parsedDetails = JSON.parse(log.details);
                } catch (e) {
                  console.error('Error parsing event log details:', e, log.details);
                  parsedDetails = {};
                }
              }
              return { ...log, details: parsedDetails };
            })
          : [],
        rules: Array.isArray(data.rules) ? data.rules : [],
        rfid_logs: Array.isArray(data.rfid_logs) ? data.rfid_logs : [],
      };

      console.log('Device data received:', sanitized);
      setDevice(sanitized);
      setIsOn(sanitized.status.toLowerCase() === 'on');
      setError(false);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching device info:', err);
      setError(true);
    }
  };

  const fetchBehavior = async (controller: AbortController) => {
    try {
      console.log('Fetching behavior for device_id:', deviceId);
      const res = await axios.get(`/api/device-behavior/${deviceId}`, { signal: controller.signal });
      console.log('Behavior response:', res.data);
      setBehavior(res.data);
      await fetchDeviceData(new AbortController());
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching device behavior:', err);
      setBehavior({ device: `ID ${deviceId}`, message: 'Failed to fetch behavior' });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDeviceData(controller);

    if (device?.status.toLowerCase() === 'on') {
      fetchBehavior(controller);
    }

    return () => {
      controller.abort();
    };
  }, [deviceId]);

  useEffect(() => {
    if (device?.status.toLowerCase() === 'on') {
      const controller = new AbortController();
      fetchBehavior(controller);
      return () => controller.abort();
    } else {
      setBehavior({ device: device?.name || `ID ${deviceId}`, message: 'Device is off' });
    }
  }, [device?.status]);

  const toggleDevice = async (enabled: boolean) => {
    try {
      console.log(`Manually toggling device ${deviceId} to ${enabled ? 'on' : 'off'}`);
      
      await axios.put(`/api/device/${deviceId}/status`, {
        status: enabled ? 'on' : 'off',
      });
      
      setIsOn(enabled);
      setDevice(prev => prev ? { ...prev, status: enabled ? 'on' : 'off', last_updated: new Date().toISOString() } : prev);
      
      // Log the manual toggle action to event logs
      await axios.post('/api/event-logs', {
        device_id: deviceId,
        event_type: 'manual_toggle',
        details: {
          status: enabled ? 'on' : 'off',
          reason: `Manual toggle by user to ${enabled ? 'on' : 'off'}`,
          triggered_by: 'user'
        },
        triggered_by: 'user'
      });
      
      if (enabled) {
        // Wait a moment for the database to update, then fetch behavior
        setTimeout(async () => {
          await fetchBehavior(new AbortController());
        }, 1000);
      } else {
        // When turning off, update behavior immediately
        setBehavior({ 
          device: device?.name || `ID ${deviceId}`, 
          message: 'Device manually turned off',
          status: 'off',
          reason: 'Manual toggle by user'
        });
        
        // Log the behavior update
        await axios.post('/api/event-logs', {
          device_id: deviceId,
          event_type: 'behavior_update',
          details: {
            status: 'off',
            reason: 'Manual toggle by user'
          },
          triggered_by: 'user'
        });
      }
      
      // Refresh device data to get latest information
      await fetchDeviceData(new AbortController());
      
    } catch (err) {
      console.error('Error updating device status:', err);
      // Revert the toggle state if the API call failed
      setIsOn(!enabled);
      alert('Failed to update device status. Please try again.');
    }
  };

  const fetchBehavior = async (controller: AbortController) => {
    try {
      console.log('Fetching behavior for device_id:', deviceId);
      const res = await axios.get(`/api/device-behavior/${deviceId}`, { signal: controller.signal });
      console.log('Behavior response:', res.data);
      setBehavior(res.data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching device behavior:', err);
      setBehavior({ device: `ID ${deviceId}`, message: 'Failed to fetch behavior' });
    }
  };

  const deleteDevice = async () => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    try {
      await axios.delete(`/api/device/${deviceId}`);
      onClose();
    } catch (err) {
      console.error('Error deleting device:', err);
      alert('Failed to delete device. Please try again.');
    }
  };

  const handleRuleSubmit = async () => {
    if (!ruleForm.name || !ruleForm.trigger_type || !ruleForm.action) {
      alert('Please fill in all required rule fields.');
      return;
    }

    try {
      const ruleData = {
        device_id: deviceId,
        name: ruleForm.name,
        description: ruleForm.description,
        is_active: ruleForm.is_active,
        trigger_type: ruleForm.trigger_type,
        action: ruleForm.action,
      };

      let response;
      if (ruleForm.rule_id) {
        response = await axios.put(`/api/rules/${ruleForm.rule_id}`, ruleData);
      } else {
        response = await axios.post('/api/rules', ruleData);
      }

      await fetchDeviceData(new AbortController());
      setShowRuleForm(false);
      setRuleForm({ rule_id: null, name: '', description: '', is_active: true, trigger_type: '', action: '' });
    } catch (err) {
      console.error('Error saving rule:', err);
      alert('Failed to save rule. Please try again.');
    }
  };

  const editRule = (rule: Rule) => {
    setRuleForm({
      rule_id: rule.rule_id,
      name: rule.name,
      description: rule.description || '',
      is_active: rule.is_active,
      trigger_type: rule.trigger_type,
      action: rule.action,
    });
    setShowRuleForm(true);
  };

  const handleRFIDSubmit = async () => {
    if (!rfidForm.card_uid) {
      alert('Please enter a card UID.');
      return;
    }

    try {
      await axios.post('/api/rfid', {
        device_id: deviceId,
        card_uid: rfidForm.card_uid,
        is_valid: rfidForm.is_valid,
        was_successful: rfidForm.was_successful,
      });
      await fetchDeviceData(new AbortController());
      setShowRFIDForm(false);
      setRFIDForm({ card_uid: '', is_valid: true, was_successful: true });
    } catch (err) {
      console.error('Error logging RFID access:', err);
      alert('Failed to log RFID access. Please try again.');
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
        <div className="flex justify-center">
          <div className="bg-zinc-800 text-white font-semibold rounded-lg px-6 py-3 text-xl text-center shadow-md border border-zinc-700">
            {String(device.name)}
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-[1fr_1fr_auto] gap-4 h-[600px]">
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
                  <p>
                    <strong>Behavior Status:</strong>{' '}
                    {behavior.reading
                      ? `${behavior.reading.temperature || 'N/A'}°C, ${behavior.reading.humidity || 'N/A'}%`
                      : behavior.status || behavior.message || 'N/A'}
                    {!isOn && (device.name.toLowerCase().includes('main door')|| device.name.toLowerCase().includes('windows') || device.name.toLowerCase().includes('hot/cold water tank')) && (
                      <button
                        onClick={() => toggleDevice(true)}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Turn On
                      </button>
                    )}
                    {!isOn && device.name.toLowerCase() === 'main door' && (
                      <button
                        onClick={() => toggleDevice(true)}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Turn On
                      </button>
                    )}
                    {!isOn && device.name.toLowerCase() === 'hot/cold water tank' && (
                      <button
                        onClick={() => toggleDevice(true)}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Turn On
                      </button>
                    )}
                  </p>
                  <p><strong>Reason:</strong> {behavior.reason || behavior.message || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
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
                    <div className="text-gray-300 text-xs">
                      {log.details ? (
                        <>
                          {log.details.status && <div>Status: {log.details.status}</div>}
                          {log.details.reason && <div>Reason: {log.details.reason}</div>}
                          {log.details.reading && (
                            <div>
                              Reading: {log.details.reading.temperature || 'N/A'}°C,{' '}
                              {log.details.reading.humidity || 'N/A'}%
                            </div>
                          )}
                        </>
                      ) : (
                        'No details'
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {device.name.toLowerCase().includes('rfid reader') && (
              <>
                <h4 className="text-lg font-semibold mb-2 mt-4">RFID Access Log</h4>
                <button
                  onClick={() => setShowRFIDForm(true)}
                  className="text-sm text-blue-400 hover:text-white mb-2"
                >
                  Log New RFID Scan
                </button>
                {device.rfid_logs.length === 0 ? (
                  <p className="italic text-gray-400">No RFID access recorded.</p>
                ) : (
                  <ul className="space-y-2">
                    {device.rfid_logs.map((log, idx) => (
                      <li key={idx} className="border-b border-zinc-600 pb-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-white">Card: {log.card_uid}</span>
                          <span className="text-xs text-gray-400">{new Date(log.attempted_at).toLocaleString()}</span>
                        </div>
                        <div className="text-gray-300 text-xs">
                          <div>Valid: {log.is_valid ? 'Yes' : 'No'}</div>
                          <div>Successful: {log.was_successful ? 'Yes' : 'No'}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg shadow-inner text-sm overflow-y-auto max-h-64 border border-zinc-700">
            <h4 className="text-lg font-semibold mb-2">Rules</h4>
            <button
              onClick={() => setShowRuleForm(true)}
              className="text-sm text-blue-400 hover:text-white mb-2"
            >
              Add New Rule
            </button>
            {device.rules.length === 0 ? (
              <p className="italic text-gray-400">No rules assigned to this device.</p>
            ) : (
              <ul className="space-y-3">
                {device.rules.map(rule => (
                  <li key={rule.rule_id} className="border-l-4 border-indigo-500 pl-3">
                    <div className="flex justify-between">
                      <p className="font-semibold text-white">
                        {String(rule.name)}
                        {!rule.is_active && <span className="text-red-400 ml-2">(Inactive)</span>}
                      </p>
                      <button
                        onClick={() => editRule(rule)}
                        className="text-xs text-blue-400 hover:text-white"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-gray-300">{rule.description ? String(rule.description) : "No description provided."}</p>
                    <p className="text-xs italic text-gray-500">
                      Trigger: {String(rule.trigger_type)} → Action: {String(rule.action)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {showRuleForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-white">
            <h4 className="text-lg font-bold">{ruleForm.rule_id ? 'Edit Rule' : 'Add New Rule'}</h4>
            <div>
              <label className="block text-sm font-medium mb-1">Rule Name</label>
              <input
                type="text"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-zinc-800 text-white"
                placeholder="e.g., Turn on AC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={ruleForm.description}
                onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-zinc-800 text-white"
                placeholder="e.g., Turn on AC when temperature exceeds 30°C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trigger Type</label>
              <input
                type="text"
                value={ruleForm.trigger_type}
                onChange={(e) => setRuleForm({ ...ruleForm, trigger_type: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-zinc-800 text-white"
                placeholder="e.g., temperature"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <input
                type="text"
                value={ruleForm.action}
                onChange={(e) => setRuleForm({ ...ruleForm, action: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-zinc-800 text-white"
                placeholder="e.g., turn_on"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={ruleForm.is_active}
                onChange={(checked) => setRuleForm({ ...ruleForm, is_active: checked })}
                className={`${ruleForm.is_active ? 'bg-green-500' : 'bg-zinc-600'} relative inline-flex h-6 w-12 items-center rounded-full transition`}
              >
                <span
                  className={`${ruleForm.is_active ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowRuleForm(false)}
                className="text-sm text-gray-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRuleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
      {showRFIDForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-white">
            <h4 className="text-lg font-bold">Log RFID Scan</h4>
            <div>
              <label className="block text-sm font-medium mb-1">Card UID</label>
              <input
                type="text"
                value={rfidForm.card_uid}
                onChange={(e) => setRFIDForm({ ...rfidForm, card_uid: e.target.value })}
                className="w-full px-3 py-2 rounded border bg-zinc-800 text-white"
                placeholder="e.g., ABC123"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Valid Card</label>
              <Switch
                checked={rfidForm.is_valid}
                onChange={(checked) => setRFIDForm({ ...rfidForm, is_valid: checked })}
                className={`${rfidForm.is_valid ? 'bg-green-500' : 'bg-zinc-600'} relative inline-flex h-6 w-12 items-center rounded-full transition`}
              >
                <span
                  className={`${rfidForm.is_valid ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Access Successful</label>
              <Switch
                checked={rfidForm.was_successful}
                onChange={(checked) => setRFIDForm({ ...rfidForm, was_successful: checked })}
                className={`${rfidForm.was_successful ? 'bg-green-500' : 'bg-zinc-600'} relative inline-flex h-6 w-12 items-center rounded-full transition`}
              >
                <span
                  className={`${rfidForm.was_successful ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowRFIDForm(false)}
                className="text-sm text-gray-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRFIDSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm"
              >
                Log Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
