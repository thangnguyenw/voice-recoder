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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

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

// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState('');
//   const [modalAction, setModalAction] = useState<'add' | 'remove' | null>(null);
//   const [targetUser, setTargetUser] = useState('');
//   const [authUsername, setAuthUsername] = useState('');
//   const [authPassword, setAuthPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Load users from REST API
//   const fetchUsers = async () => {
//     const res = await axios.get('/api/users'); // Bạn có thể đổi endpoint này
//     setUsers(res.data.users);
//   };

//   const openAuthModal = (action: 'add' | 'remove', username = '') => {
//     setModalAction(action);
//     setTargetUser(username || newUser.trim());
//     setAuthUsername('');
//     setAuthPassword('');
//   };

//   const handleConfirm = async () => {
//     if (!authUsername || !authPassword || !targetUser) return;

//     setLoading(true);
//     try {
//       if (modalAction === 'add') {
//         await axios.post('/api/add_user', {
//           name: targetUser,
//           auth_username: authUsername,
//           auth_password: authPassword,
//         });
//         setNewUser('');
//       } else if (modalAction === 'remove') {
//         await axios.post('/api/remove_user', {
//           name: targetUser,
//           auth_username: authUsername,
//           auth_password: authPassword,
//         });
//       }
//       await fetchUsers();
//     } catch (err: any) {
//       alert(err?.response?.data?.message || 'Operation failed');
//     } finally {
//       setModalAction(null);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <h2 className="text-xl font-bold mb-4">User Management</h2>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           className="flex-1 border p-2 rounded"
//           placeholder="Enter username"
//           value={newUser}
//           onChange={(e) => setNewUser(e.target.value)}
//         />
//         <button
//           onClick={() => openAuthModal('add')}
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           + Add
//         </button>
//       </div>

//       <ul className="space-y-2">
//         {users.length === 0 ? (
//           <li className="text-sm text-gray-500 italic">No users</li>
//         ) : (
//           users.map((user, index) => (
//             <li
//               key={index}
//               className="flex justify-between items-center bg-gray-100 p-2 rounded"
//             >
//               <span>{user.name}</span>
//               <button
//                 onClick={() => openAuthModal('remove', user.name)}
//                 className="text-red-500 hover:underline"
//               >
//                 Delete
//               </button>
//             </li>
//           ))
//         )}
//       </ul>

//       {/* Modal xác thực */}
//       {modalAction && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
//             <h3 className="text-lg font-bold mb-4">
//               {modalAction === 'add' ? 'Xác thực thêm người dùng' : 'Xác thực xoá người dùng'}
//             </h3>
//             <input
//               type="text"
//               placeholder="Tài khoản xác thực"
//               className="border p-2 w-full mb-2 rounded"
//               value={authUsername}
//               onChange={(e) => setAuthUsername(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Mật khẩu"
//               className="border p-2 w-full mb-4 rounded"
//               value={authPassword}
//               onChange={(e) => setAuthPassword(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setModalAction(null)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Huỷ
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 disabled={loading}
//               >
//                 Xác nhận
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
