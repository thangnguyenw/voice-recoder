'use client';
import { useState } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import AuthModal from './modals/AuthModal';

export default function UserManagement() {
  const { users, sendMessage } = useWebSocket();
  const [newUser, setNewUser] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);
  const [selectedUser, setSelectedUser] = useState('');

  const openModal = (type: 'add' | 'remove', user: string) => {
    setActionType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirm = (authUsername: string, authPassword: string) => {
    // 👉 Giả định xác thực hợp lệ (bạn có thể thay bằng gọi API)
    if (authUsername === 'admin' && authPassword === '123456') {
      if (actionType === 'add') {
        const trimmed = selectedUser.trim();
        if (!trimmed || users.some((u) => u.name === trimmed)) return;
        sendMessage({ type: 'add_user', name: trimmed });
        setNewUser('');
      } else if (actionType === 'remove') {
        sendMessage({ type: 'remove_user', name: selectedUser });
      }
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }

    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setSelectedUser('');
    setActionType(null);
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
        <button
          onClick={() => openModal('add', newUser)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
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
              <span>{user.name} ({user.audioCount} sound files)</span>
              <button
                onClick={() => openModal('remove', user.name)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Modal xác thực */}
      <AuthModal
        show={showModal}
        title={`Xác nhận ${actionType === 'add' ? 'thêm' : 'xoá'} người dùng`}
        onCancel={resetModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
