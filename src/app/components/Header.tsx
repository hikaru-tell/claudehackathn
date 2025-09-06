import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-accent)] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="RiNeco Logo"
              width={100}
              height={100}
              className="w-24 h-24 object-contain"
            />
          </div>
          <p className="text-white/80 text-sm hidden md:block">
            サステナブル包装材料提案AI
          </p>
        </div>
      </div>
    </header>
  );
}
