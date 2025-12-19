
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  BrainCircuit, 
  Menu, 
  X,
  TrendingUp,
  Wallet,
  PieChart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'investments', label: 'Investimentos', icon: PieChart },
    { id: 'ai', label: 'Preditor IA', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">FinanceAI</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-400">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-8 transition-transform duration-300
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight">FinanceAI</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
              FA
            </div>
            <div>
              <p className="text-sm font-semibold">Conta Individual</p>
              <p className="text-xs text-zinc-500">Plano Premium IA</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
