'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Record audio', href: '/' },
  { name: 'List users', href: '/users' },
//   { name: 'Thống kê', href: '/stats' },
//   { name: 'Thông báo', href: '/notifications' }
];

// export default function TabNavigation() {
//   const pathname = usePathname();

//   return (
//     <div className="flex border-b border-gray-200 mb-6">
//       {tabs.map((tab) => (
//         <Link
//           key={tab.href}
//           href={tab.href}
//           className={`px-6 py-3 text-sm font-medium border-b-2 cursor-pointer transition-all ${
//             pathname === tab.href
//               ? 'border-[#111827] text-[#111827]'
//               : 'border-transparent text-gray-500 hover:text-[#111827]'
//           }`}
//         >
//           {tab.name}
//         </Link>
//       ))}
//     </div>
//   );
// }

// import Link from 'next/link';
import Image from 'next/image';

export default function TabNavigation() {
  return (
    <nav className="bg-white shadow flex items-center px-4 py-2 h-16 rounded-md">
      {/* Logo */}
      {/* <div className="mr-6 flex-shrink-0">
        <Link href="/">
          <Image src="images/logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div> */}

      {/* Tabs */}
      <div className="flex space-x-4">
        <Link href="/" className="text-gray-700 hover:text-black font-medium">
          Trang chủ
        </Link>
        <Link href="/train" className="text-gray-700 hover:text-black font-medium">
          Huấn luyện
        </Link>
        <Link href="/settings" className="text-gray-700 hover:text-black font-medium">
          Cài đặt
        </Link>
      </div>
    </nav>
  );
}
