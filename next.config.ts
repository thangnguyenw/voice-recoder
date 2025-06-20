// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: 'export', // Xuất HTML tĩnh để dùng với Tauri
//   reactStrictMode: true,
//   trailingSlash: true, // Quan trọng để các route tĩnh hoạt động tốt sau khi export
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // <--- thêm dòng này để tắt tối ưu hóa ảnh
  },
  // các cấu hình khác nếu có
}

module.exports = nextConfig