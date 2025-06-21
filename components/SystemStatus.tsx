'use client';

import { useWebSocket } from '@/context/WebSocketContext';
import { useState } from 'react';

export default function SystemStatus() {
  const { motorRpm, connected, users} = useWebSocket(); // Lấy từ context

  return (
    <div className="min-h-[250px] bg-white shadow-md rounded-xl p-5 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-3 text-center">System Status</h3>

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

        {/* <p className="text-sm mb-2 text-gray-900 font-semibold">
            <span>RPM speed:</span>{' '}
            <span className="text-black font-normal">
            {motorRpm === null ? 'No data available' : `${motorRpm.toFixed(0)} RPM`}
            </span>
        </p> */}

        {/* {motorRpm !== null && (
            <div className="h-2 bg-gray-200 rounded-full">
            <div
                className="h-2 bg-[#111827] rounded-full transition-all"
                style={{ width: `${Math.min((motorRpm / 4000) * 100, 100)}%` }}
            />
            </div>
        )} */}
    </div>
  );
}