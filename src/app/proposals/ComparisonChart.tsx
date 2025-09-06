'use client';

import { useEffect, useRef } from 'react';
import { Card } from '../components/Card';

interface ComparisonChartProps {
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

export function ComparisonChart({
  currentMaterial,
  proposals,
  performanceReqs,
}: ComparisonChartProps) {
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

    // レーダーチャートの軸（性能要件が設定されている場合はそれを使用、なければデフォルト）
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

    // 現在の素材（軸数に合わせてダミーデータを生成）
    const currentScores = Array(axes.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 40) + 40); // 40-80の範囲
    drawPolygon(ctx, centerX, centerY, radius, currentScores, '#dc2626', 0.2);

    // 提案素材
    const colors = ['#16a34a', '#0891b2', '#9333ea'];
    proposals.slice(0, 3).forEach((proposal, index) => {
      // 軸数に合わせてスコアを生成（実際のアプリでは適切なマッピングを行う）
      const scores = Array(axes.length)
        .fill(0)
        .map(() => Math.floor(Math.random() * 30) + 60); // 60-90の範囲
      drawPolygon(ctx, centerX, centerY, radius, scores, colors[index], 0.3);
    });

    // 凡例
    const legendY = height - 40;
    ctx.font = '10px sans-serif';

    // 現在の素材
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(15, legendY, 12, 12);
    ctx.fillStyle = '#374151';
    ctx.fillText('現在', 30, legendY + 6);

    // 提案素材（compositionの最初の2要素を使用）
    proposals.slice(0, 3).forEach((proposal, index) => {
      const x = 70 + index * 80;
      ctx.fillStyle = colors[index];
      ctx.fillRect(x, legendY, 12, 12);
      ctx.fillStyle = '#374151';

      // compositionの最初の2要素を"/"で結合して表示
      const compositionLabel = proposal.composition.slice(0, 2).join('/');
      const shortName =
        compositionLabel.length > 10
          ? compositionLabel.substring(0, 8) + '...'
          : compositionLabel;
      ctx.fillText(shortName, x + 15, legendY + 6);
    });
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
    <Card title="現在の素材構成">
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
