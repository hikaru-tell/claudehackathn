export function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-xl">R</span>
            </div>
            <h1 className="text-2xl font-bold">RiNeco</h1>
          </div>
          <p className="text-green-100 text-sm hidden md:block">
            サステナブル包装材料提案AI
          </p>
        </div>
      </div>
    </header>
  );
}