'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  show: boolean;
  title?: string;
  mode: 'add' | 'remove';
  onCancel: () => void;
  onConfirm: (
    authUsername: string,
    authPassword: string,
    newUsername?: string,
    newPassword?: string
  ) => void;
}

export default function AuthModal({
  show,
  title,
  mode,
  onCancel,
  onConfirm,
}: AuthModalProps) {
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  useEffect(() => {
    if (show) {
      setAuthUsername('');
      setAuthPassword('');
      setNewUsername('');
      setNewUserPassword('');
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] bg-white/5 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-6">
          {title || 'Xác nhận thao tác'}
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Tài khoản xác thực</label>
          <input
            type="text"
            value={authUsername}
            onChange={(e) => setAuthUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Nhập tài khoản"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 pr-10 [appearance:textfield] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {mode === 'add' && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tài khoản người dùng mới
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Nhập tên tài khoản mới"
              />
            </div>

            <div className="mb-6 relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mật khẩu người dùng mới
              </label>
              <input
                type={showNewUserPassword ? 'text' : 'password'}
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 pr-10 [appearance:textfield] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="absolute right-2 top-9 text-gray-600"
                onClick={() => setShowNewUserPassword((prev) => !prev)}
              >
                {showNewUserPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-400 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() =>
              onConfirm(authUsername, authPassword, newUsername, newUserPassword)
            }
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
