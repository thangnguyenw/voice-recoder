'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Record audio', href: '/' },
  { name: 'List users', href: '/users' },
//   { name: 'Thống kê', href: '/stats' },
//   { name: 'Thông báo', href: '/notifications' }
];

export default function TabNavigation() {
  return (
    <nav className="bg-white shadow flex items-center px-4 h-20 rounded-md justify-between">
      {/* Logo + Tên hệ thống */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
        </Link>

        {/* Tên hệ thống */}
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-gray-900">
            VOICE RECOGNITION SYSTEM
          </span>
          <span className="text-sm text-gray-600">
            Hanoi University of Science and Technology
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 h-full items-center">
        {/* <Link
          href="/"
          className="text-gray-700 hover:text-black font-medium h-full flex items-center px-3"
        >
          Trang chủ
        </Link> */}
        <Link
          href="/users"
          className="text-gray-700 hover:text-black font-medium h-full flex items-center px-3"
        >
          Language
        </Link>
        <Link
          href="/settings"
          className="text-gray-700 hover:text-black font-medium h-full flex items-center px-3"
        >
          Theme
        </Link>
      </div>
    </nav>
  );
}