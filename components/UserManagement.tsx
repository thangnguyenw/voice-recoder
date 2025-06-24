'use client';
import { useState } from 'react';
import { useUsers } from '@/context/UsersContext';
import AuthModal from './modals/AuthModal';
import axios from 'axios';

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const { users, refetchUsers } = useUsers();
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX;

  const openModal = (type: 'add' | 'remove', user: string) => {
    setActionType(type);
    setSelectedUser(user.trim());
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setSelectedUser('');
    setActionType(null);
  };

  const handleConfirm = async (
    authUsername: string,
    authPassword: string,
    newUsername?: string,
    newPassword?: string
  ) => {
    if (!authUsername || !authPassword) {
      alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu xác thực!');
      return;
    }

    try {
      if (actionType === 'add') {
        if (!newUsername  || !newPassword) {
          alert('Vui lòng nhập tên người dùng và mật khẩu mới!');
          return;
        }

        await axios.post(`${prefix}/users/add`, {
          authUsername: authUsername,
          authPassword: authPassword,
          newUsername: newUsername ,
          newPassword: newPassword,
        });

        alert('Đã thêm người dùng thành công!');
        await refetchUsers();
      }

      if (actionType === 'remove') {
        await axios.delete(`${prefix}/users/${selectedUser}`, {
          data: {
            authUser: authUsername,
            authPass: authPassword,
          },
        });

        alert('Đã xoá người dùng thành công!');
        await refetchUsers();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          typeof err.response?.data === 'string'
            ? err.response.data
            : 'Có lỗi xảy ra khi xử lý yêu cầu!';
        alert(
          `${actionType === 'add' ? 'Thêm' : 'Xoá'} người dùng thất bại: ${msg}`
        );
      } else {
        alert('Có lỗi không xác định xảy ra!');
      }
      console.error('Lỗi thao tác:', err);
    } finally {
      resetModal();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-h-[250px] flex flex-col">
      {/* Tiêu đề và nút Add */}
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-xl font-bold mr-4">User Management</h2>
        <button
          onClick={() => openModal('add', '')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm transition"
        >
          + Add User
        </button>
      </div>

      {/* Danh sách user với cuộn và viền */}
      <div className="flex-grow overflow-y-auto pr-1 border border-gray-300 rounded p-2">
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
      </div>

      {/* Modal xác nhận */}
      {actionType && (
        <AuthModal
          show={showModal}
          title={`Xác nhận ${actionType === 'add' ? 'thêm' : 'xoá'} người dùng`}
          mode={actionType}
          onCancel={resetModal}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
