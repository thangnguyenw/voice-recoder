'use client'
import { useWebSocket } from "@/contexts/WebSocketContext";

export default function Page() {
  const { users } = useWebSocket(); // { "Nguyễn Văn A": 3, ... }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">available users</h2>
      <ul className="space-y-3">
        {users.length > 0 ? (
          users.map((user, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-900">{user["name"]}</span>
              <span className="text-sm text-gray-600">
                {user["audioCount"]} audio file
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No user available</p>
        )}
      </ul>
    </div>
  );
}