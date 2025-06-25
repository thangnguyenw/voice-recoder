'use client';

// import { useState, useEffect } from 'react';
// import { useWebSocket } from '@/context/WebSocketContext';

//     export default function RecognitionResult() {
//     const { messageResult } = useWebSocket();

//     const displayMessage =
//         !messageResult || messageResult.trim() === ''
//         ? 'Chưa có kết quả nhận diện'
//         : messageResult;

//     return (
//         <div className="bg-white shadow-md rounded-xl p-5 min-h-36 flex flex-col justify-center items-center text-gray-500">

//         <h3 className="text-lg font-semibold mb-2 text-[#111827]">Kết quả nhận diện</h3>
//         <p className="text-sm">{displayMessage}</p>
//         </div>
//     );
//     }

// import { useWebSocket } from '@/context/WebSocketContext';
// import { CheckCircle2, XCircle } from 'lucide-react';

// export default function RecognitionResult() {
//   const { messageResult, users } = useWebSocket();

//   const isUnknown = messageResult?.trim() === 'Không xác định được người nói';

//   let name = '';
//   let score = 0;
//   let validUser = false;

//   if (!isUnknown && messageResult && messageResult.includes(':')) {
//     const [rawName, rawScore] = messageResult.split(':');
//     name = rawName.trim();
//     score = parseFloat(rawScore.trim());
//     validUser = users.some((u) => u.name.toLowerCase() === name.toLowerCase());
//   }

//   const displayMessage = !messageResult || messageResult.trim() === ''
//     ? 'No result'
//     : messageResult;

//     return (
//     <div className="bg-white shadow-md rounded-xl p-5 min-h-36 flex flex-col justify-center items-center text-gray-500">
//         <h3 className="text-lg font-semibold mb-2 text-[#111827]">Recognition Result</h3>

//         {isUnknown ? (
//         <p className="text-sm flex items-center gap-2 text-red-500">
//             {messageResult}
//         </p>
//         ) : (
//         <p className="text-sm flex items-center gap-2 text-gray-800">
//             {name && score ? `${name}: ${score.toFixed(2)}` : displayMessage}
//             {messageResult && name && (
//             validUser ? (
//                 <CheckCircle2 className="text-green-500 w-5 h-5" />
//             ) : (
//                 <XCircle className="text-red-500 w-5 h-5" />
//             )
//             )}
//         </p>
//         )}
//     </div>
//     );
// }

import { useEffect } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext"; // thay bằng đường dẫn thực tế
import { CheckCircle2, XCircle } from "lucide-react";

export default function RecognitionResult() {
  const { messageResult } = useWebSocket();

  // 🔍 Debug mỗi khi nhận message mới
  useEffect(() => {
    if (messageResult) {
      console.log("[📥 Nhận từ WebSocket]", messageResult);
    }
  }, [messageResult]);

  // Trường hợp ban đầu chưa có dữ liệu
  if (!messageResult) {
    return (
      <div className="bg-white shadow-md rounded-xl p-5 min-h-[250px] flex flex-col justify-center items-center text-gray-500 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2 text-[#111827]">
          Recognition Result
        </h3>
        <p className="text-sm text-gray-500 italic">No recognition result</p>
      </div>
    );
  }

  // Trích xuất dữ liệu
  const speaker = messageResult.check_speaker_message;
  const command = messageResult.transcribe_audio_message;

  const isSpeakerValid =
    speaker && speaker !== "None" && speaker !== "speaker is not valid";

  const isCommandValid =
    command && command !== "None" && command !== "command not detected";

  // Tách tên và điểm nếu hợp lệ
  let name = "";
  let score = 0;
  if (isSpeakerValid && speaker.includes(":")) {
    const [rawName, rawScore] = speaker.split(":");
    name = rawName.trim();
    score = parseFloat(rawScore.trim());
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-5 min-h-[250px] flex flex-col justify-center items-center text-gray-500 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-[#111827]">
        Recognition Result
      </h3>

      {!isSpeakerValid ? (
        // ❌ Người nói không hợp lệ
        <p className="text-sm text-red-500 flex items-center gap-2">
          Speaker is not valid
          <XCircle className="w-5 h-5 text-red-500" />
        </p>
      ) : (
        <>
          {/* ✅ Người nói hợp lệ */}
          <p className="font-medium text-sm text-green-500 flex items-center gap-2">
            {`${name}: ${score.toFixed(2)}`}
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </p>

          {isCommandValid ? (
            // ✅ Có lệnh hợp lệ
            <p className="font-medium text-sm text-green-500 mt-3 flex items-center gap-2">
              <span>Command detected:</span>
              <span className="font-medium">{command}</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </p>
          ) : (
            // ❌ Không có lệnh
            <p className="font-medium text-sm text-red-500 mt-3 flex items-center gap-2">
              <span>Command not detected</span>
              <XCircle className="w-5 h-5 text-red-500" />
            </p>
          )}
        </>
      )}
    </div>
  );
}
