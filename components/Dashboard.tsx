
import React, { useMemo, useState } from 'react';
import { useFinance } from '../store';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, BrainCircuit, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { transactions } = useFinance();
  const [dailyFilter, setDailyFilter] = useState<'all' | 'income' | 'expense'>('all');

  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  // Gráfico 1: Performance Diária do Mês Atual
  const dailyData = useMemo(() => {
    const date = new Date();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getDate() === day && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });

      let value = 0;
      if (dailyFilter === 'all') {
        value = filtered.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
      } else {
        value = filtered.filter(t => t.type === dailyFilter).reduce((acc, t) => acc + t.amount, 0);
      }

      data.push({ day: dayStr, valor: value });
    }
    return data;
  }, [transactions, dailyFilter]);

  // Gráfico 2: Crescimento Mensal (Receita vs Despesa)
  const growthData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const year = d.getFullYear();

      const filtered = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === mIdx && td.getFullYear() === year;
      });

      data.push({
        name: `${months[mIdx]}`,
        Receita: filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        Despesa: filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#f3e8ff'];

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Visão Geral Financeira</h1>
          <p className="text-zinc-500">Acompanhe seu desempenho e crescimento este mês.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
          <Calendar className="text-purple-500" size={20} />
          <span className="font-medium">{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Saldo Atual" value={formatBRL(metrics.balance)} icon={Wallet} color="text-purple-400" />
        <KpiCard title="Receita no Mês" value={formatBRL(metrics.totalIncome)} icon={TrendingUp} color="text-emerald-400" />
        <KpiCard title="Despesas no Mês" value={formatBRL(metrics.totalExpenses)} icon={TrendingDown} color="text-rose-400" />
        <KpiCard title="Taxa de Economia" value={`${metrics.savingsRate.toFixed(1)}%`} icon={DollarSign} color="text-sky-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Performance Diária */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold">Desempenho Diário</h3>
            <div className="flex bg-zinc-800 p-1 rounded-lg">
              {(['all', 'income', 'expense'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDailyFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    dailyFilter === f ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f === 'all' ? 'Saldo' : f === 'income' ? 'Ganhos' : 'Gastos'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  formatter={(val: number) => formatBRL(val)}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={dailyFilter === 'expense' ? '#f43f5e' : dailyFilter === 'income' ? '#10b981' : '#9333ea'} 
                  strokeWidth={3} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Crescimento Mensal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Crescimento (Últimos 6 Meses)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  formatter={(val: number) => formatBRL(val)}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesa" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Gastos por Categoria</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatBRL(v)} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <BrainCircuit size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Insight da IA</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Otimize sua saúde financeira</h3>
            <p className="text-zinc-300 leading-relaxed">
              Baseado no seu padrão atual, você tem potencial de economizar <span className="text-white font-bold">R$ 450,00</span> extras este mês se reduzir gastos na categoria Lazer.
            </p>
          </div>
          <button className="mt-6 w-full py-3 bg-white text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition-colors">
            Análise Detalhada com Gemini
          </button>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-zinc-500 font-medium">{title}</span>
      <div className={`p-2 rounded-lg bg-zinc-800 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold">{value}</span>
    </div>
  </div>
);

export default Dashboard;
