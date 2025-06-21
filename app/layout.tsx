import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WebSocketProvider } from "@/context/WebSocketContext";
import TabNavigation from '@/components/TabNavigation';
import SystemStatus from '@/components/SystemStatus';
import RecognitionResult from '@/components/RecognitionResult';
import "./globals.css";
import Tachometer from "@/components/Tachometer";
import UserManagement from "@/components/UserManagement";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
     <body className="bg-gray-100 min-h-screen p-6 text-gray-900">
        <WebSocketProvider>
          {/* <div className="w-full max-w-7xl mx-auto font-sans text-[#111827]"> */}
          <div className="w-full mx-auto font-sans text-[#111827]">
            {/* Tiêu đề chính */}
            {/* <h1 className="text-3xl font-bold mb-4">VOICE RECOGNITION SYSTEM</h1> */}

            {/* Tabs điều hướng */}
            <TabNavigation />

            {/* Phần chính: trái là nội dung động, phải là hệ thống */}
            <div className="flex flex-col gap-4 mt-4">
            <section className="flex-1 min-h-[410px]">{children}</section>

            <aside className="w-full flex flex-row items-center gap-4 h-[250px]">
              <div className="w-[300px] h-full">
                <SystemStatus />
              </div>

              <div className="w-[300px] h-full">
                <RecognitionResult />
              </div>

              <div className="flex justify-center items-center w-[250px] h-[250px] bg-gray-100 rounded-full shadow">
                <Tachometer />
              </div>

              <div className="flex-1 h-full">
                <UserManagement />
              </div>
            </aside>

          </div>
          </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}


// export const metadata = {
//   title: 'RPM Gauge with Recharts',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body style={{ margin: 0 }}>{children}</body>
//     </html>
//   );
// }
