import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-accent)] text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.jpeg"
                alt="RiNeco Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-white/80 text-sm hidden md:block">
            サステナブル包装材料提案AI
          </p>
        </div>
      </div>
    </header>
  );
}
