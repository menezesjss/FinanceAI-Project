
import React, { useState, useEffect, useMemo } from 'react';
import { INVESTMENT_TYPES, Investment } from '../types';
import { Plus, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Trash2, PieChart } from 'lucide-react';

const Investments: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('fa_investments');
    if (saved) setInvestments(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fa_investments', JSON.stringify(investments));
  }, [investments]);

  const [formData, setFormData] = useState({
    name: '',
    type: INVESTMENT_TYPES[0],
    investedAmount: '',
    currentAmount: '',
  });

  const totals = useMemo(() => {
    const invested = investments.reduce((acc, inv) => acc + inv.investedAmount, 0);
    const current = investments.reduce((acc, inv) => acc + inv.currentAmount, 0);
    const profit = current - invested;
    const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
    return { invested, current, profit, profitPercent };
  }, [investments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      investedAmount: parseFloat(formData.investedAmount),
      currentAmount: parseFloat(formData.currentAmount),
      lastUpdated: new Date().toISOString()
    };
    setInvestments([...investments, newInv]);
    setIsModalOpen(false);
    setFormData({ name: '', type: INVESTMENT_TYPES[0], investedAmount: '', currentAmount: '' });
  };

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Investimentos & Patrimônio</h1>
          <p className="text-zinc-500">Gerencie sua carteira de ativos e acompanhe a rentabilidade.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={20} />
          Novo Ativo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium mb-1">Total Investido</p>
          <p className="text-2xl font-bold">{formatBRL(totals.invested)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium mb-1">Valor Atual</p>
          <p className="text-2xl font-bold text-purple-400">{formatBRL(totals.current)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium mb-1">Lucro/Prejuízo Total</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${totals.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatBRL(totals.profit)}
            </p>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${totals.profit >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {totals.profit >= 0 ? '+' : ''}{totals.profitPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Ativo</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Investido</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Atual</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Rentabilidade</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {investments.map(inv => {
              const profit = inv.currentAmount - inv.investedAmount;
              const profitPct = (profit / inv.investedAmount) * 100;
              return (
                <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4 font-medium">{inv.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-lg text-zinc-400">
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{formatBRL(inv.investedAmount)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-zinc-200">{formatBRL(inv.currentAmount)}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 text-sm font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {profit >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {profitPct.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeInvestment(inv.id)} className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {investments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                  Nenhum investimento cadastrado. Comece a investir hoje!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Adicionar Ativo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome do Ativo</label>
                <input required type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="Ex: PETR4, Tesouro Selic 2029" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tipo</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {INVESTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Valor Investido</label>
                  <input required type="number" step="0.01" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" placeholder="0,00" value={formData.investedAmount} onChange={e => setFormData({...formData, investedAmount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Valor Atual</label>
                  <input required type="number" step="0.01" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" placeholder="0,00" value={formData.currentAmount} onChange={e => setFormData({...formData, currentAmount: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-zinc-800 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20">Salvar Ativo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
