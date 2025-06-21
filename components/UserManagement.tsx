'use client';

import { useState } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';

export default function UserManagement() {
  const { users, sendMessage } = useWebSocket(); // lấy từ context
  const [newUser, setNewUser] = useState('');

  const addUser = () => {
    const trimmed = newUser.trim();
    if (!trimmed || users.some(u => u.name === trimmed)) return;
    sendMessage({ type: 'add_user', name: trimmed });
    setNewUser('');
  };

  const removeUser = (name: string) => {
    sendMessage({ type: 'remove_user', name });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md min-h-[250px]">
      <h2 className="text-xl font-bold mb-4 text-center">User Management</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter username"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button onClick={addUser} className="bg-black text-white px-4 py-2 rounded">
          + Add
        </button>
      </div>

      <ul className="space-y-2">
        {users.length === 0 ? (
          <li className="text-sm text-gray-500 italic">No users</li>
        ) : (
          users.map((user, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{user.name}</span>
              <button
                onClick={() => removeUser(user.name)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}