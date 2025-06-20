'use client';

import { useEffect, useState } from 'react';

interface PortSelectorProps {
  onPortSelect: (port: string) => void;
}

export default function PortSelector({ onPortSelect }: PortSelectorProps) {
  const [ports, setPorts] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState('');

  useEffect(() => {
    fetch('/api/ports')
      .then((res) => res.json())
      .then((data) => setPorts(data))
      .catch((err) => console.error('Lỗi tải port:', err));
  }, []);

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Chọn cổng:</label>
      <select
        className="border p-2 rounded w-full"
        value={selectedPort}
        onChange={(e) => {
          const port = e.target.value;
          setSelectedPort(port);
          onPortSelect(port);
        }}
      >
        <option value="">-- Chọn cổng --</option>
        {ports.map((port) => (
          <option key={port} value={port}>
            {port}
          </option>
        ))}
      </select>
    </div>
  );
}
