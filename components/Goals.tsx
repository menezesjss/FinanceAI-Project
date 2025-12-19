
import React, { useState } from 'react';
import { useFinance } from '../store';
import { Plus, Target, Trash2, CheckCircle2 } from 'lucide-react';

const Goals: React.FC = () => {
  const { goals, addGoal, deleteGoal } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) return;
    addGoal({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline
    });
    setFormData({ title: '', targetAmount: '', currentAmount: '0', deadline: new Date().toISOString().split('T')[0] });
    setIsModalOpen(false);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Metas de Economia</h1>
          <p className="text-zinc-500">Defina seus sonhos e acompanhe o progresso de cada um.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={20} />
          Criar Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const isCompleted = progress === 100;

          return (
            <div key={goal.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'}`}>
                  <Target size={24} />
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="p-2 text-zinc-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
              <p className="text-sm text-zinc-500 mb-6">Alvo: {formatBRL(goal.targetAmount)}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Progresso</span>
                  <span className="font-bold text-zinc-200">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-purple-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Guardado</p>
                  <p className="text-lg font-bold">{formatBRL(goal.currentAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Prazo</p>
                  <p className="text-sm font-semibold">{new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {isCompleted && (
                <div className="mt-6 flex items-center justify-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold rounded-xl">
                  <CheckCircle2 size={16} />
                  Meta Atingida!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Nova Meta de Economia</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome da Meta</label>
                <input required type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="Ex: Novo Carro, Reserva de Emergência" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Valor Alvo (R$)</label>
                  <input required type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Já guardado (R$)</label>
                  <input required type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" value={formData.currentAmount} onChange={e => setFormData({...formData, currentAmount: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Data Desejada</label>
                <input required type="date" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-zinc-800 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20">Criar Meta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
