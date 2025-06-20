// "use client";

// import { useState, useEffect } from "react";
// import styles from "./Tachometer.module.css";

// const Tachometer = () => {
//   const [speed, setSpeed] = useState<number>(0);

//   useEffect(() => {
//     let animationFrame: number;

//     const animate = () => {
//       setSpeed((prevSpeed) => {
//         if (prevSpeed < 180) {
//           // Tăng dần đến 180
//           return Math.min(prevSpeed + 1, 180);
//         } else if (prevSpeed > 0) {
//           // Giảm dần về 0
//           return Math.max(prevSpeed - 1, 0);
//         }
//         return prevSpeed; // Giữ nguyên khi đạt 0
//       });

//       animationFrame = requestAnimationFrame(animate);
//     };

//     animationFrame = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationFrame);
//   }, []);

//   const rotateStyle = {
//     transform: `rotate(${speed * 1.5 + 90}deg)`, // Điều chỉnh góc bắt đầu từ -90 độ
//   };

//   return (
//     <div className={styles.tachometer}>
//       <div className={styles.dial}>
//         <div className={styles.markings}>
//           {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((mark) => (
//             <span
//               key={mark}
//               className={`${styles.mark} ${mark >= 120 ? styles.redZone : ""}`}
//               style={{ transform: `rotate(${mark}deg)` }} // Điều chỉnh góc quay của số
//             >
//               {mark}
//             </span>
//           ))}
//         </div>
//         <div className={styles.needle} style={rotateStyle}></div>
//         <div className={styles.center}></div>
//       </div>
//     </div>
//   );
// };

// export default Tachometer;

"use client";

import { useState, useEffect } from "react";
import styles from "./Tachometer.module.css";

const Tachometer = () => {
  const [speed, setSpeed] = useState<number>(0);

  useEffect(() => {
    let animationFrame: number;
    let direction: 'forward' | 'backward' = 'forward';

    const animate = () => {
      setSpeed((prevSpeed) => {
        let nextSpeed = prevSpeed;
        if (direction === 'forward') {
          nextSpeed = prevSpeed + 1;
          if (nextSpeed >= 195) {
            direction = 'backward';
          }
        } else {
          nextSpeed = prevSpeed - 1;
          if (nextSpeed <= -15) {
            direction = 'forward';
          }
        }
        return nextSpeed;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const rotateStyle = {
    transform: `rotate(${speed + 90}deg)`, // Góc quay từ 0 đến 360 rồi -180 đến 0
  };

  return (
    <div className={styles.tachometer}>
      <div className={styles.dial}>
        <div className={styles.markings}>
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((mark) => (
            <span
              key={mark}
              className={`${styles.mark} ${mark >= 120 ? styles.redZone : ""}`}
              style={{ transform: `rotate(${mark}deg)` }} // Góc quay của số
            >
              {mark}
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