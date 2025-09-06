'use client';

import { useEffect, useRef } from 'react';
import { Card } from '../components/Card';

interface SustainabilityChartProps {
  currentMaterial: {
    composition: string;
    properties: string[];
  };
  proposals: {
    materialName: string;
    composition: string[];
    scores: Record<string, number>;
  }[];
  performanceReqs: string[];
}

export function SustainabilityChart({
  currentMaterial,
  proposals,
  performanceReqs,
}: SustainabilityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || proposals.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // レーダーチャートの軸（性能要件と同じ軸を使用）
    const axes =
      performanceReqs.length > 0
        ? performanceReqs.slice(0, 8) // 最大8軸まで
        : ['物性', '環境性', 'コスト', '安全性', '供給性'];
    const angleStep = (Math.PI * 2) / axes.length;

    // グリッド描画
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < axes.length; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius * (i / 5);
        const y = centerY + Math.sin(angle) * radius * (i / 5);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 軸線描画
    for (let i = 0; i < axes.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    }

    // 軸ラベル描画
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < axes.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius + 35);
      const y = centerY + Math.sin(angle) * (radius + 35);

      // 長いテキストを短縮
      let label = axes[i];
      if (label.length > 8) {
        label = label.substring(0, 6) + '...';
      }
      ctx.fillText(label, x, y);
    }

    // 最初の提案素材の各成分を個別に描画（サステナビリティ素材）
    if (proposals.length > 0) {
      const sustainableComponents = proposals[0].composition; // 最初の提案素材を使用
      const componentColors = ['#16a34a', '#22c55e', '#4ade80', '#86efac']; // 緑系のグラデーション

      sustainableComponents.slice(0, 4).forEach((component, index) => {
        // 各成分ごとにランダムなスコアを生成（サステナビリティは高めのスコア）
        const scores = Array(axes.length)
          .fill(0)
          .map(() => Math.floor(Math.random() * 20) + 70 + index * 5); // 70-95の範囲
        drawPolygon(
          ctx,
          centerX,
          centerY,
          radius,
          scores,
          componentColors[index] || '#16a34a',
          0.3
        );
      });
    }

    // 凡例（改善されたレイアウト）
    const legendY = height - 30;
    const legendItemWidth = 100; // 各凡例項目の幅を固定
    const totalWidth = 4 * legendItemWidth; // 4つの項目分の幅
    const legendStartX = (width - totalWidth) / 2; // 中央揃え

    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';

    // サステナビリティ素材（最初の提案）の個別成分を表示
    if (proposals.length > 0) {
      const sustainableComponents = proposals[0].composition;
      const componentColors = ['#16a34a', '#22c55e', '#4ade80', '#86efac']; // 緑系のグラデーション

      // 各成分を個別に表示
      sustainableComponents.slice(0, 4).forEach((component, index) => {
        const x = legendStartX + index * legendItemWidth;

        // 色付きの四角
        ctx.fillStyle = componentColors[index] || '#16a34a';
        ctx.fillRect(x, legendY, 12, 12);

        // ラベルテキスト（成分名）
        ctx.fillStyle = '#374151';
        const label =
          component.length > 10 ? component.substring(0, 8) + '...' : component;
        ctx.fillText(label, x + 16, legendY + 8);
      });
    }
  }, [currentMaterial, proposals, performanceReqs]);

  function drawPolygon(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    scores: number[],
    color: string,
    alpha: number
  ) {
    const angleStep = (Math.PI * 2) / scores.length;

    ctx.beginPath();
    for (let i = 0; i < scores.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const score = scores[i] / 100;
      const x = centerX + Math.cos(angle) * radius * score;
      const y = centerY + Math.sin(angle) * radius * score;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    ctx.fillStyle =
      color +
      Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return (
    <Card title="サステナビリティ素材構成">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          className="max-w-full"
        />
      </div>
    </Card>
  );
}
