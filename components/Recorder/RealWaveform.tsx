'use client';

import { useEffect, useRef, useState } from 'react';

const BAR_COUNT = 128;

export default function RealWaveform({
  active,
  reset,
}: {
  active: boolean;
  reset: boolean;
}) {
  const barsRef = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const [, setTrigger] = useState(0); // trigger render nhẹ

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number>();

  // Khi đang ghi âm
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current!);
      audioContextRef.current?.close();
      return;
    }

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const tick = () => {
        if (!analyser || !dataArrayRef.current) return;

        analyser.getByteTimeDomainData(dataArrayRef.current);
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const val = dataArrayRef.current[i] - 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        const volume = Math.min(100, rms * 2);

        // Cập nhật barsRef mượt mà hơn
        barsRef.current = [...barsRef.current.slice(1), volume];
        setTrigger((v) => (v + 1) % 10000); // Kích re-render nhẹ

        rafRef.current = requestAnimationFrame(tick);
      };

      tick();
    };

    init();

    return () => {
      cancelAnimationFrame(rafRef.current!);
      audioContextRef.current?.close();
    };
  }, [active]);

  // Reset waveform khi cần
  useEffect(() => {
    if (reset) {
      barsRef.current = Array(BAR_COUNT).fill(0);
      setTrigger((v) => v + 1);
    }
  }, [reset]);

  return (
    <div className="flex items-end justify-center h-20 gap-[1px]">
      {barsRef.current.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${Math.max(2, h)}px`,
          }}
          className="w-[2px] bg-green-500 rounded transition-all duration-[40ms]"
        />
      ))}
    </div>
  );
}
