'use client';

import { useState, useRef, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Mic, MicOff, Play, Save } from 'lucide-react';
import { useWebSocket } from '@/context/WebSocketContext';

export default function Recorder() {
  const [recognitionMode, setRecognitionMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const ws = useRef<WebSocket | null>(null);

  // ✅ Lấy từ context
  const { sendAudio } = useWebSocket();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        console.log('🎧 Ghi xong, chuẩn bị gửi...');

        const buffer = await audioBlob.arrayBuffer();
        sendAudio(buffer); // ✅ Gửi thông qua hàm context
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('🔴 Bắt đầu ghi âm');

      // ⏱️ Dừng ghi âm sau 5 giây
      setTimeout(() => {
        stopRecording();
      }, 6000);
    } catch (err) {
      console.error('❌ Lỗi khi ghi âm:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    console.log('⏹️ Dừng ghi âm');
  };

  return (
    <div className="w-full">
      {/* Recording Panel */}
      <div className="col-span-2 bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Record audio and recognize voice</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Recognize speaker mode</span>
            <Switch
              checked={recognitionMode}
              onChange={setRecognitionMode}
              className={`${
                recognitionMode ? 'bg-[#111827]' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  recognitionMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>

        {/* Mic status */}
        <div className="flex flex-col items-center justify-center text-center h-60 text-gray-400">
          {isRecording ? (
            <>
              <Mic size={64} strokeWidth={1.5} className="text-red-500 animate-pulse" />
              <p className="mt-3 text-base text-red-600">Đang ghi âm...</p>
            </>
          ) : (
            <>
              <MicOff size={64} strokeWidth={1.2} />
              <p className="mt-3 text-base">Hệ thống đang tắt chế độ nhận diện</p>
            </>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-2 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#6B7280] hover:bg-[#4B5563]'
            } text-white rounded-md shadow flex items-center gap-2 transition`}
          >
            {isRecording ? (
              <>
                <MicOff size={18} /> Stop recording
              </>
            ) : (
              <>
                <Mic size={18} /> Start recording
              </>
            )}
          </button>

          <div className="flex gap-2">
            {audioURL && <audio controls src={audioURL} className="max-w-[200px]" />}
          </div>
        </div>
      </div>
    </div>
  );
}