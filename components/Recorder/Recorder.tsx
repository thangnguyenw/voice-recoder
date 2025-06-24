'use client';

import { useState, useRef } from 'react';
import { Switch } from '@headlessui/react';
import { Mic, MicOff } from 'lucide-react';
import { useWebSocket } from '@/context/WebSocketContext';
import CanvasWaveform from './CanvasWaveform';
import AuthModal from '../modals/AuthModal';
import ManualButton from './ManualButton';

export default function Recorder() {
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [recognitionMode, setRecognitionMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [pendingSwitchValue, setPendingSwitchValue] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [buttonState, setButtonState] = useState<'off' | 'transitioning-on' | 'on' | 'transitioning-off'>('off');

  const { sendAudio } = useWebSocket();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
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

        const buffer = await audioBlob.arrayBuffer();
        sendAudio(buffer);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        stopRecording();
      }, 6000);
    } catch (err) {
      console.error('❌ Lỗi khi ghi âm:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleToggleRecognition = (newValue: boolean) => {
    if (!newValue) {
      setPendingSwitchValue(newValue);
      setShowModal(true);
    } else {
      setRecognitionMode(true);
    }
  };

  const handleConfirm = (username: string, password: string) => {
    if (pendingSwitchValue === false) {
      setRecognitionMode(false);
    }
    setShowModal(false);
    setPendingSwitchValue(null);
  };

  return (
    <div className="w-full">
      <div className="col-span-2 bg-white shadow-md rounded-xl p-6">
        {/* Header + Mode Selector + Speaker Switch */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-xl font-semibold">Điều khiển hệ thống</h2>

          <div className="flex items-center gap-4">
            {/* Switch nhận diện */}
            {mode === 'voice' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Nhận diện người nói
                </span>
                <Switch
                  checked={recognitionMode}
                  onChange={handleToggleRecognition}
                  className={`${
                    recognitionMode ? 'bg-green-500' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      recognitionMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            )}

            {/* Chọn chế độ */}
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
              <button
                onClick={() => setMode('voice')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  mode === 'voice' ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
              >
                🎙️ Giọng nói
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  mode === 'manual' ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
              >
                ✋ Thủ công
              </button>
            </div>
          </div>

          <AuthModal
            show={showModal}
            title={`Confirm switching to ${
              recognitionMode ? 'normal' : 'recognition'
            } mode`}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        </div>

        {/* Nội dung giữ kích thước ổn định */}
        <div className="min-h-[300px] transition-all duration-300">
          {mode === 'voice' ? (
            <>
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
                <div className="mt-4 w-full">
                  <CanvasWaveform active={isRecording} reset={!isRecording} />
                </div>
              </div>

              <div className="flex justify-center items-center mt-2 gap-6 flex-wrap">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-8 py-3.5 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#6B7280] hover:bg-[#4B5563]'
                  } text-white rounded-full shadow flex items-center gap-2 transition`}
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

                {audioURL && (
                  <audio controls src={audioURL} className="max-w-[200px]" />
                )}
              </div>
            </>
          ) : (
            // ==== Chế độ thủ công ====
            <div className="flex flex-col items-center justify-center text-center h-60">
              {/* <button
                onClick={() => alert('🚗 Đã gửi lệnh thủ công!')}
                className="bg-gray-200 hover:bg-gray-300 w-28 h-28 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
              >
                <img
                  src="/images/start-button.png"
                  alt="Nút điều khiển"
                  className="w-14 h-14"
                />
              </button>
              <p className="mt-4 text-gray-600 text-sm">
                Nhấn để gửi lệnh điều khiển thủ công
              </p> */}
              {mode === 'manual' && (
                <ManualButton buttonState={buttonState} setButtonState={setButtonState} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
