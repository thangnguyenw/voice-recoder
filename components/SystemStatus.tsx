'use client';

import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUsers } from '@/contexts/UsersContext';

const prefix = process.env.NEXT_PUBLIC_API_PREFIX;

export default function SystemStatus() {
  const { motorRpm, connected } = useWebSocket();
  const {users, refetchUsers} = useUsers();
  const [selectedPort, setSelectedPort] = useState('');
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const res = await axios.get(`${prefix}/port/list`);
        setAvailablePorts(res.data.ports || res.data);
      } catch (err) {
        console.error('Error fetching ports:', err);
        setError('Không thể tải danh sách cổng');
      }
    };

    fetchPorts();
  }, []);

  const handlePortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const port = e.target.value;
    setSelectedPort(port);
  
    if (!port) return;
  
    try {
      await axios.post(`${prefix}/port/change`, { port });
      console.log(`✅ Đã chọn port: ${port}`);
    } catch (err) {
      console.error('❌ Lỗi khi đổi cổng:', err);
    }
  };

  return (
    <div className="min-h-[250px] bg-white shadow-md rounded-xl p-5 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-3 text-center">System Status</h3>

      {/* Select ESP32 Port */}
      <div className="mb-4 w-full max-w-xs">
        <div className="flex items-center gap-2 justify-center">
          <label htmlFor="port-select" className="text-sm font-medium text-gray-700">
            ESP32 Port:
          </label>

          <div className="relative">
            <select
              id="port-select"
              value={selectedPort}
              onChange={handlePortChange}
              className="appearance-none pl-2 pr-6 py-[4px] border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={error !== null || availablePorts.length === 0}
            >
              <option value="">--</option>
              {availablePorts.map((port) => (
                <option key={port} value={port}>
                  {port}
                </option>
              ))}
            </select>

            {/* Mũi tên xuống custom */}
            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <p className="text-sm mb-1">
        <span className="font-semibold text-gray-700">Connection:</span>{' '}
        <span className={`font-semibold ${connected ? 'text-green-600' : 'text-gray-500'}`}>
          {connected ? 'connected 🟢' : 'disconnected 🔴'}
        </span>
      </p>

      <p className="text-sm mb-2">
        <span className="font-medium text-gray-700">Authorized users:</span>{' '}
        <span className="text-gray-900 font-normal">{users.length} users</span>
      </p>

      <p className="text-sm mb-2 text-gray-900 font-semibold">
        Motor status:{' '}
        <span className="text-black font-normal">
          {motorRpm === null ? 'No data available' : 'Running'}
        </span>
      </p>
    </div>
  );
}
