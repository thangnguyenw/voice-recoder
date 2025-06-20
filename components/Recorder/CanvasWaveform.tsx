'use client';

import { useEffect, useRef } from 'react';

export default function CanvasWaveform({
  active,
  reset,
}: {
  active: boolean;
  reset: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array>();
  const animationRef = useRef<number>();

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // Làm mờ nhẹ sóng cũ (hiệu ứng trail mượt)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#10b981'; // green-500

    ctx.beginPath();
    const sliceWidth = width / dataArrayRef.current.length;
    let x = 0;

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d')!;
    draw(ctx, canvas.width, canvas.height);

    // 👉 GIẢM TỐC ĐỘ (1/30s)
    animationRef.current = window.setTimeout(() => {
      requestAnimationFrame(loop);
    }, 1000 / 30); // khoảng 30fps
  };

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animationRef.current!);
      audioContextRef.current?.close();
      return;
    }

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      loop();
    };

    start();

    return () => {
      cancelAnimationFrame(animationRef.current!);
      audioContextRef.current?.close();
    };
  }, [active]);

  // Reset waveform
  useEffect(() => {
    if (reset && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [reset]);

  return (
    <div className="w-full flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        className="rounded bg-white shadow border"
      />
    </div>
  );
}
