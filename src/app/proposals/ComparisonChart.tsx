"use client";

import { useEffect, useRef } from "react";
import { Card } from "../components/Card";

interface ComparisonChartProps {
  currentMaterial: any;
  proposals: any[];
}

export function ComparisonChart({ currentMaterial, proposals }: ComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || proposals.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // レーダーチャートの軸
    const axes = ["物性", "環境性", "コスト", "安全性", "供給性"];
    const angleStep = (Math.PI * 2) / axes.length;

    // グリッド描画
    ctx.strokeStyle = "#e5e7eb";
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
    ctx.fillStyle = "#374151";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < axes.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius + 30);
      const y = centerY + Math.sin(angle) * (radius + 30);
      ctx.fillText(axes[i], x, y);
    }

    // 現在の素材（ダミーデータ）
    const currentScores = [60, 30, 70, 80, 75];
    drawPolygon(ctx, centerX, centerY, radius, currentScores, "#dc2626", 0.2);

    // 提案素材
    const colors = ["#16a34a", "#0891b2", "#9333ea"];
    proposals.slice(0, 3).forEach((proposal, index) => {
      const scores = [
        proposal.scores.physical,
        proposal.scores.environmental,
        proposal.scores.cost,
        proposal.scores.safety,
        proposal.scores.supply,
      ];
      drawPolygon(ctx, centerX, centerY, radius, scores, colors[index], 0.3);
    });

    // 凡例
    const legendY = height - 60;
    ctx.font = "12px sans-serif";
    
    // 現在の素材
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(20, legendY, 15, 15);
    ctx.fillStyle = "#374151";
    ctx.fillText("現在の素材", 40, legendY + 8);

    // 提案素材
    proposals.slice(0, 3).forEach((proposal, index) => {
      const x = 150 + index * 150;
      ctx.fillStyle = colors[index];
      ctx.fillRect(x, legendY, 15, 15);
      ctx.fillStyle = "#374151";
      ctx.fillText(proposal.materialName, x + 20, legendY + 8);
    });
  }, [currentMaterial, proposals]);

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
    
    ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
    ctx.fill();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return (
    <Card title="性能比較レーダーチャート">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="max-w-full"
        />
      </div>
    </Card>
  );
}