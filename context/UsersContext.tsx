// context/UsersContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
  audioCount: number;
}

interface UsersContextValue {
  users: User[];
  refetchUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextValue>({
  users: [],
  refetchUsers: async () => {},
});

const prefix = process.env.NEXT_PUBLIC_API_PREFIX;

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${prefix}/users`);
      console.log(res);
      if (res.data.users && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, refetchUsers: fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
