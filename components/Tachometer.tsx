"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Tachometer.module.css";
import { useWebSocket } from "@/contexts/WebSocketContext";

const Tachometer = () => {
  const { motorRpm } = useWebSocket(); // lấy rpm (đã chuẩn hóa từ 0 → 240)
  const [speed, setSpeed] = useState<number>(0);
  const animationRef = useRef<number| null>(null);

  // Debug giá trị từ WebSocket
  useEffect(() => {
    console.log('🌀 motorRpm cập nhật từ WebSocket:', motorRpm);
  }, [motorRpm]);

  // useEffect(() => {
  //   const animate = () => {
  //     setSpeed((prev) => {
  //       if (motorRpm == null) return prev;
  //       const diff = motorRpm - prev;
  //       const step = diff * 0.1;
  //       if (Math.abs(step) < 0.5) return motorRpm;
  //       return prev + step;
  //     });

  //     animationRef.current = requestAnimationFrame(animate);
  //   };

  //   animationRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(animationRef.current!);
  // }, [motorRpm]);
  useEffect(() => {
    const animate = () => {
      setSpeed((prev) => {
        if (motorRpm == null) return prev;
  
        // Tính góc từ motorRpm (0 → 540) thành -30° → 150°
        const targetAngle = (motorRpm / 540) * 180;
  
        const diff = targetAngle - prev;
        const step = diff * 0.1;
  
        if (Math.abs(step) < 0.5) return targetAngle;
        return prev + step;
      });
  
      animationRef.current = requestAnimationFrame(animate);
    };
  
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [motorRpm]);
  
  

  // Góc quay = speed + offset 45 độ như bạn đang dùng
  const rotateStyle = {
    transform: `rotate(${speed + 60}deg)`,
  };

  return (
    <div className={styles.tachometer}>
      <div className={styles.dial}>
        <div className={styles.markings}>
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((mark) => (
            <span
              key={mark}
              className={`${styles.mark} ${mark >= 160 ? styles.redZone : ""}`}
              style={{ transform: `rotate(${mark-30}deg)` }} // Góc quay của số
            >
              {mark*3}
            </span>
          ))}
        </div>
        <div className={styles.needle} style={rotateStyle}></div>
        <div className={styles.center}></div>
      </div>
    </div>
  );
};

export default Tachometer;