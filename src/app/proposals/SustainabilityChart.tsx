'use client';

import { useEffect, useRef, useState } from 'react';
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
  performanceReqs: (
    | string
    | { name: string; value: string; unit?: string; importance: string }
  )[]; // Support for array of strings or objects
}

export function SustainabilityChart({
  currentMaterial,
  proposals,
  performanceReqs,
}: SustainabilityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedProposalIndex, setSelectedProposalIndex] = useState(0);

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

    // Radar chart axes (use same axes as performance requirements)
    const axes =
      performanceReqs.length > 0
        ? performanceReqs
            .slice(0, 8) // Maximum 8 axes
            .map((req) => (typeof req === 'object' ? req.name : req))
        : ['Physical', 'Environmental', 'Cost', 'Safety', 'Supply Chain'];
    const angleStep = (Math.PI * 2) / axes.length;

    // Draw grid
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

    // Draw axis lines
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

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < axes.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius + 35);
      const y = centerY + Math.sin(angle) * (radius + 35);

      // Shorten long text
      let label = axes[i];
      if (label.length > 8) {
        label = label.substring(0, 6) + '...';
      }
      ctx.fillText(label, x, y);
    }

    // Draw each component of selected proposal material individually (sustainability material)
    if (proposals.length > 0 && selectedProposalIndex < proposals.length) {
      const sustainableComponents =
        proposals[selectedProposalIndex].composition; // 選択された提案素材を使用
      const componentColors = ['#16a34a', '#22c55e', '#4ade80', '#86efac']; // 緑系のグラデーション

      sustainableComponents.slice(0, 4).forEach((component, index) => {
        // Generate random scores for each component (sustainability has higher scores)
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

    // Legend (improved layout)
    const legendY = height - 30;
    const legendItemWidth = 100; // 各凡例項目の幅を固定
    const totalWidth = 4 * legendItemWidth; // 4つの項目分の幅
    const legendStartX = (width - totalWidth) / 2; // 中央揃え

    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';

    // Display individual components of sustainability material (selected proposal)
    if (proposals.length > 0 && selectedProposalIndex < proposals.length) {
      const sustainableComponents =
        proposals[selectedProposalIndex].composition;
      const componentColors = ['#16a34a', '#22c55e', '#4ade80', '#86efac']; // 緑系のグラデーション

      // Display each component individually
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
  }, [currentMaterial, proposals, performanceReqs, selectedProposalIndex]);

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
    <Card title="Sustainability Material Composition">
      {/* Proposal material selection dropdown */}
      {proposals.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Proposal Material:
          </label>
          <select
            value={selectedProposalIndex}
            onChange={(e) => setSelectedProposalIndex(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
          >
            {proposals.slice(0, 3).map((proposal, index) => (
              <option key={index} value={index}>
                TOP{index + 1}: {proposal.materialName}
              </option>
            ))}
          </select>
        </div>
      )}
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
