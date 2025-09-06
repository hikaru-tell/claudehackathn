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
              Your First Step to
              <span className="text-[var(--brand-main)]">Sustainable Packaging</span>
            </h1>
            <p className="text-xl text-[var(--brand-base)]/70 mb-8">
              AI suggests sustainable alternative materials and finds
              the optimal packaging to reduce environmental impact
            </p>
            <Button size="lg" onClick={() => router.push('/scenarios')}>
              Start Analysis
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                Easy 3 Steps
              </h3>
              <p className="text-[var(--brand-base)]/70">
                Simply select a product, input requirements, and review AI recommendations
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                Environmental Care
              </h3>
              <p className="text-[var(--brand-base)]/70">
                Comprehensive evaluation of CO2 reduction, recyclability, and biodegradability
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-[var(--brand-base)] mb-2">
                Data-Driven
              </h3>
              <p className="text-[var(--brand-base)]/70">
                Integrated analysis of latest material databases and web information
              </p>
            </Card>
          </div>

          {/* Sample Scenarios */}
          <Card title="Supported Product Categories">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: '🥔',
                  name: 'Potato Chip Bags',
                  desc: 'Content protection and long-term storage',
                },
                { icon: '🧊', name: 'Frozen Food Pouches', desc: 'Cold resistance and sealing' },
                {
                  icon: '☕',
                  name: 'Coffee Bean Packaging',
                  desc: 'Oxygen barrier and aroma retention',
                },
                { icon: '🥤', name: 'Beverage Bottles', desc: 'Transparency and carbonation retention' },
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
