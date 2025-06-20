'use client';

import { PieChart, Pie, Cell } from 'recharts';

interface RpmGaugeProps {
  rpm: number;
  maxRpm?: number;
}

const COLORS = ['#00FF00', '#FFFF00', '#FF0000'];

export default function RpmGauge({ rpm, maxRpm = 8000 }: RpmGaugeProps) {
  const percent = Math.min(rpm / maxRpm, 1);
  const needleAngle = 180 * percent;

  const data = [
    { value: maxRpm * 0.5 }, // Xanh
    { value: maxRpm * 0.3 }, // Vàng
    { value: maxRpm * 0.2 }, // Đỏ
  ];

  // Vạch chia từ 1k đến maxRpm
  const ticks = [];
  const centerX = 200;
  const centerY = 100;
  const radius = 100;

  for (let i = 1000; i <= maxRpm; i += 1000) {
    const angle = (i / maxRpm) * 180;
    const rad = (Math.PI / 180) * angle;

    const tickStartX = centerX + Math.cos(Math.PI - rad) * (radius - 5);
    const tickStartY = centerY + Math.sin(Math.PI - rad) * (radius - 5);
    const tickEndX = centerX + Math.cos(Math.PI - rad) * (radius + 5);
    const tickEndY = centerY + Math.sin(Math.PI - rad) * (radius + 5);
    const labelX = centerX + Math.cos(Math.PI - rad) * (radius + 20);
    const labelY = centerY + Math.sin(Math.PI - rad) * (radius + 20);

    ticks.push({
      label: `${i / 1000}k`,
      tickStartX,
      tickStartY,
      tickEndX,
      tickEndY,
      labelX,
      labelY,
    });
  }

  return (
    <div style={{ width: 400, color: 'white', textAlign: 'center' }}>
      <h2 style={{ marginBottom: 10 }}>RPM: {rpm}</h2>
      <div style={{ position: 'relative', width: 400, height: 200 }}>
        <PieChart width={400} height={200}>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            dataKey="value"
            paddingAngle={2}
            cx={centerX}
            cy={centerY}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>

        {/* Vạch chia và nhãn */}
        <svg
          width={400}
          height={200}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {ticks.map((tick, i) => (
            <g key={i}>
              <line
                x1={tick.tickStartX}
                y1={tick.tickStartY}
                x2={tick.tickEndX}
                y2={tick.tickEndY}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={tick.labelX}
                y={tick.labelY}
                fill="white"
                fontSize={12}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {tick.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Kim RPM */}
        <div
          style={{
            position: 'absolute',
            top: `${centerY}px`,
            left: `${centerX}px`,
            width: '4px',
            height: '90px',
            backgroundColor: 'white',
            transform: `rotate(${needleAngle}deg) translate(-50%, -100%)`,
            transformOrigin: 'bottom center',
            borderRadius: '2px',
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            transition: 'transform 0.3s ease-out',
            zIndex: 2,
          }}
        />

        {/* Tâm đồng hồ */}
        <div
          style={{
            position: 'absolute',
            top: `${centerY - 6}px`,
            left: `${centerX - 6}px`,
            width: '12px',
            height: '12px',
            backgroundColor: 'white',
            borderRadius: '50%',
            zIndex: 3,
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
          }}
        />
      </div>
    </div>
  );
}
