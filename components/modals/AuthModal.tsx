'use client';
import { useState, useEffect } from 'react';

interface AuthModalProps {
  show: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: (username: string, password: string) => void;
}

export default function AuthModal({ show, title, onCancel, onConfirm }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (show) {
      setUsername('');
      setPassword('');
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] bg-white/5 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-6">{title || 'Xác nhận thao tác'}</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Nhập tài khoản"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-400 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() => onConfirm(username, password)}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
