'use client';

import { useRouter } from 'next/navigation';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { Card } from './components/Card';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-main)]/10 to-[var(--brand-accent)]/20">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--brand-base)] mb-4">
              持続可能な包装材料への
              <span className="text-[var(--brand-main)]">第一歩</span>
            </h1>
            <p className="text-xl text-[var(--brand-base)]/70 mb-8">
              AI がサステナブルな代替素材を提案し、
              環境負荷を削減する最適な包装材料を見つけます
            </p>
            <Button size="lg" onClick={() => router.push('/scenarios')}>
              分析を開始する
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                簡単3ステップ
              </h3>
              <p className="text-[var(--brand-base)]/70">
                製品を選んで、要件を入力し、AIの提案を確認するだけ
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                環境配慮
              </h3>
              <p className="text-[var(--brand-base)]/70">
                CO2削減、リサイクル性、生分解性を総合評価
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                データ駆動
              </h3>
              <p className="text-[var(--brand-base)]/70">
                最新の素材データベースとWeb情報を統合分析
              </p>
            </Card>
          </div>

          {/* Sample Scenarios */}
          <Card title="対応製品カテゴリー">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: '🥔',
                  name: 'ポテトチップス袋',
                  desc: '内容物保護と長期保存',
                },
                { icon: '🧊', name: '冷凍食品パウチ', desc: '耐寒性と密封性' },
                {
                  icon: '☕',
                  name: 'コーヒー豆包装',
                  desc: '酸素バリアと香り保持',
                },
                { icon: '🥤', name: '飲料ボトル', desc: '透明性と炭酸保持' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--brand-main)]/5 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[var(--brand-base)]">
                      {item.name}
                    </h4>
                    <p className="text-sm text-[var(--brand-base)]/70">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
