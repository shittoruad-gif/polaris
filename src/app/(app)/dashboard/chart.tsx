'use client';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function DashboardChart({ sales }: { sales: { m: string; amount: number; repeat: number }[] }) {
  return (
    <Line
      data={{
        labels: sales.map(s => s.m),
        datasets: [
          { label: '売上(¥)', data: sales.map(s => s.amount), borderColor: '#c8a45c', backgroundColor: 'rgba(200,164,92,.15)', tension: .35, fill: true, yAxisID: 'y' },
          { label: 'リピート率(%)', data: sales.map(s => s.repeat), borderColor: '#0b1a2b', tension: .35, yAxisID: 'y1' },
        ],
      }}
      options={{
        scales: {
          y: { position: 'left', ticks: { callback: (v) => '¥' + (Number(v) / 10000) + '万' } },
          y1: { position: 'right', grid: { display: false }, min: 0, max: 100, ticks: { callback: (v) => v + '%' } },
        },
        plugins: { legend: { position: 'bottom' } },
      }}
    />
  );
}
